import { useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useSelector } from 'react-redux';
import { FaTimes } from 'react-icons/fa'; 
import { authApi, endpoints } from '@/app/configs/API';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function IngredientDrawer({ isOpen, onClose, onCreated }) {
    const [name, setName] = useState('');
    const [unit, setUnit] = useState('');
    const [productDate, setProductDate] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [status, setStatus] = useState(''); 

    const token = useSelector((state) => state.auth.token);

    const handleSubmit = async () => {
        try {
            const response = await authApi(token).post(endpoints.createIngredient, {
                name,
                unit,
                productDate,
                price: parseFloat(price),
                quantity: parseInt(quantity, 10),
                status,
            });

        console.log("create success")
                toast.success('Ingredient added successfully!');
                onCreated(); 
                onClose();
            
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(`Error: ${error.response.data.message || 'Something went wrong'}`);
            } else {
                toast.error('An unexpected error occurred.');
            }
            console.error("Failed to create user:", error);
        }
    };

    return (
        <>
            <Drawer open={isOpen} onClose={onClose}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Add New Ingredient</DrawerTitle>
                        <Button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300">
                            <FaTimes />
                        </Button>
                    </DrawerHeader>
                    <div className="p-6 mb-4">
                        <Input
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mb-2"
                        />
                        <Input
                            placeholder="Unit"
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                            className="mb-2"
                        />
                        <Input
                            placeholder="Product Date (YYYY-MM-DD)"
                            type="date"
                            value={productDate}
                            onChange={(e) => setProductDate(e.target.value)}
                            className="mb-2"
                        />
                        <Input
                            placeholder="Price"
                            type="number"
                            step="0.01"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="mb-2"
                        />
                        <Input
                            placeholder="Quantity"
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="mb-2"
                        />
                        <div className="mb-4">
                            <Select onValueChange={(value) => setStatus(value)} value={status}>
                                <SelectTrigger className="w-full bg-white border border-gray-300 rounded-lg shadow-sm">
                                    <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="available">available</SelectItem>
                                    <SelectItem value="out_of_stock">out_of_stock</SelectItem>
                                </SelectContent>
                            </Select> 
                        </div>
                    </div>
                    <DrawerFooter>
                        <Button onClick={handleSubmit} className="bg-blue-500 text-white">
                            Submit
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
            <ToastContainer position="top-right" autoClose={3000} />
        </>
    );
}
