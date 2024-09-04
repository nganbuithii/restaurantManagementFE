import { useState, useEffect } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useSelector } from 'react-redux';
import { FaTimes } from 'react-icons/fa';
import { authApi, endpoints } from '@/app/configs/API';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function DishesDrawer({ isOpen, onClose, onCreated }) {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [files, setFiles] = useState([]);
    const [ingredientQuantities, setIngredientQuantities] = useState([]);
    const [ingres, setIngres] = useState([]);
    const [unit, setUnit] = useState('');
    const [productDate, setProductDate] = useState('');
    const [quantity, setQuantity] = useState('');
    const [status, setStatus] = useState('');

    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        const fetchIngre = async () => {
            try {
                const response = await authApi(token).get(endpoints.createIngredient);
                console.log(response.data.data);
                setIngres(response.data.data.data);
            } catch (error) {
                console.error("Failed to fetch ingredients:", error);
            }
        };

        if (isOpen) {
            fetchIngre();
        }
    }, [isOpen, token]);

    const handleFileChange = (event) => {
        setFiles([...event.target.files]);
    };

    const handleCheckboxChange = (id) => {
        setIngredientQuantities(prev => {
            if (prev.includes(id)) {
                return prev.filter(ingredientId => ingredientId !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const handleRemoveImage = (index) => {
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('price', parseFloat(price));
            formData.append('unit', unit);
            formData.append('productDate', productDate);
            formData.append('quantity', quantity);
            formData.append('status', status);
            ingredientQuantities.forEach(id => formData.append('ingredientQuantities[]', id));
            files.forEach(file => formData.append('files', file));

            const response = await authApi(token).post(endpoints.getAllDishes, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success('Added successfully!');
            onCreated();
            onClose();
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(`Error: ${error.response.data.message || 'Something went wrong'}`);
            } else {
                toast.error('An unexpected error occurred.');
            }
            console.error("Failed to create dish:", error);
        }
    };

    return (
        <>
            <Drawer open={isOpen} onClose={onClose}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Add New Dishes</DrawerTitle>
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
                            placeholder="Price"
                            type="number"
                            step="0.01"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="mb-2"
                        />

                        <div className="mb-4">
                            <label className="block mb-2">Ingredients:</label>
                            {ingres.map((ingredient) => (
                                <div key={ingredient.id} className="flex items-center mb-2">
                                    <input
                                        type="checkbox"
                                        id={`ingredient-${ingredient.id}`}
                                        checked={ingredientQuantities.includes(ingredient.id)}
                                        onChange={() => handleCheckboxChange(ingredient.id)}
                                        className="mr-2"
                                    />
                                    <label htmlFor={`ingredient-${ingredient.id}`}>{ingredient.name}</label>
                                </div>
                            ))}
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Images:</label>
                            <input
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                className="mb-2"
                            />
                            <div className="flex flex-wrap">
                                {Array.from(files).map((file, index) => (
                                    <div key={index} className="relative mr-2 mb-2">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`preview-${index}`}
                                            className="w-24 h-24 object-cover"
                                        />
                                        <Button
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute -top-3 right-0 p-2 py-0 bg-red-500 text-white rounded-full "
                                        >
                                            &times;
                                        </Button>
                                    </div>
                                ))}
                            </div>
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
