import React, { useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useSelector } from 'react-redux';
import { FaTimes, FaCalendar, FaDollarSign, FaToggleOn, FaClock, FaPlus } from 'react-icons/fa';
import { authApi, endpoints } from '@/app/configs/API';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Label } from '@/components/ui/label';

export default function IngredientDrawer({ isOpen, onClose, onCreated }) {
    const [ingredient, setIngredient] = useState({
        name: '', unit: '', productDate: '', price: '', quantity: '', status: ''
    });

    const token = useSelector((state) => state.auth.token);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setIngredient(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            await authApi(token).post(endpoints.createIngredient, {
                name: ingredient.name,
                unit: ingredient.unit,
                productDate: ingredient.productDate,
                price: parseFloat(ingredient.price),
                quantity: parseInt(ingredient.quantity, 10),
                status: ingredient.status,
            });
            console.log("create success");
            toast.success('Ingredient added successfully!', { containerId: 'B' });
            onCreated(); 
            onClose();
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(`Error: ${error.response.data.message || 'Something went wrong'}`, { containerId: 'B' });
            } else {
                toast.error('An unexpected error occurred.', { containerId: 'B' });
            }
            console.error("Failed to create ingredient:", error);
        }
    };

    return (
        <>
            <Drawer open={isOpen} onClose={onClose}>
                <DrawerContent className="bg-gradient-to-br from-orange-50 to-orange-100">
                    <DrawerHeader className="border-b border-orange-200">
                        <DrawerTitle className="text-2xl font-bold text-orange-800">Add New Ingredient</DrawerTitle>
                        <Button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-orange-200 text-orange-800 hover:bg-orange-300 transition duration-300">
                            <FaTimes />
                        </Button>
                    </DrawerHeader>
                    <div className="p-6 space-y-6">
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <div className="mb-4">
                                <Label htmlFor="name" className="text-sm text-gray-600">Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={ingredient.name}
                                    onChange={handleChange}
                                    className="font-semibold text-orange-800"
                                    placeholder="Ingredient Name"
                                />
                            </div>
                            
                            <div className="mb-4">
                                <Label htmlFor="unit" className="text-sm text-gray-600">Unit</Label>
                                <Input
                                    id="unit"
                                    name="unit"
                                    value={ingredient.unit}
                                    onChange={handleChange}
                                    className="font-semibold text-orange-800"
                                    placeholder="Unit"
                                />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-orange-100 p-2 rounded-full">
                                        <FaDollarSign className="text-orange-600" />
                                    </div>
                                    <div className="flex-1">
                                        <Label htmlFor="price" className="text-sm text-gray-600">Price</Label>
                                        <Input
                                            id="price"
                                            name="price"
                                            type="number"
                                            value={ingredient.price}
                                            onChange={handleChange}
                                            className="font-semibold text-orange-800"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-3">
                                    <div className="bg-orange-100 p-2 rounded-full">
                                        <FaToggleOn className="text-orange-600" />
                                    </div>
                                    <div className="flex-1">
                                        <Label htmlFor="status" className="text-sm text-gray-600">Status</Label>
                                        <Select 
                                            onValueChange={(value) => setIngredient(prev => ({ ...prev, status: value }))}
                                            value={ingredient.status}
                                        >
                                            <SelectTrigger id="status" className="font-semibold text-orange-800">
                                                <SelectValue placeholder="Select Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="available">Available</SelectItem>
                                                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                                                <SelectItem value="pending">Pending</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-3">
                                    <div className="bg-orange-100 p-2 rounded-full">
                                        <FaCalendar className="text-orange-600" />
                                    </div>
                                    <div className="flex-1">
                                        <Label htmlFor="productDate" className="text-sm text-gray-600">Production Date</Label>
                                        <Input
                                            id="productDate"
                                            name="productDate"
                                            type="date"
                                            value={ingredient.productDate}
                                            onChange={handleChange}
                                            className="font-semibold text-orange-800"
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-3">
                                    <div className="bg-orange-100 p-2 rounded-full">
                                        <FaClock className="text-orange-600" />
                                    </div>
                                    <div className="flex-1">
                                        <Label htmlFor="quantity" className="text-sm text-gray-600">Quantity</Label>
                                        <Input
                                            id="quantity"
                                            name="quantity"
                                            type="number"
                                            value={ingredient.quantity}
                                            onChange={handleChange}
                                            className="font-semibold text-orange-800"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DrawerFooter className="border-t border-orange-200">
                        <Button onClick={handleSubmit} className="bg-orange-600 text-white hover:bg-orange-700 transition duration-300">
                            <FaPlus className="mr-2" /> Add Ingredient
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
            <ToastContainer position="top-right" autoClose={3000} containerId="B" />
        </>
    );
}
