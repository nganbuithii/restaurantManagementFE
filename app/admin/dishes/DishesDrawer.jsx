'use client';
import { useState, useEffect } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import { FaTimes } from 'react-icons/fa';
import { authApi, endpoints } from '@/app/configs/API';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';

export default function DishesDrawer({ isOpen, onClose, onCreated }) {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [files, setFiles] = useState([]);
    const [ingredientIds, setIngredientIds] = useState([]);
    const [ingres, setIngres] = useState([]);
    const [filePreviews, setFilePreviews] = useState([]);

    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        const fetchIngre = async () => {
            try {
                const response = await authApi(token).get(endpoints.createIngredient);
                setIngres(response.data.data.data);
            } catch (error) {
                console.error("Failed to fetch ingredients:", error);
            }
        };

        if (isOpen) {
            fetchIngre();
        }
    }, [isOpen, token]);

    const handleCheckboxChange = (id) => {
        setIngredientIds(prev => {
            const numberId = Number(id);
            return prev.includes(numberId) 
                ? prev.filter(ingredientId => ingredientId !== numberId)
                : [...prev, numberId];
        });
    };

    const handleFileChange = (event) => {
        const filesArray = Array.from(event.target.files);
        setFiles(filesArray);
        setFilePreviews(filesArray.map(file => URL.createObjectURL(file)));
    };

    useEffect(() => {
        return () => filePreviews.forEach(URL.revokeObjectURL);
    }, [filePreviews]);

    const handleRemoveImage = (index) => {
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
        setFilePreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('price', parseFloat(price).toFixed(2));
            formData.append('ingredientIds', JSON.stringify(ingredientIds));
            files.forEach(file => formData.append('files', file));

            await authApi(token).post(endpoints.getAllDishes, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success('Dish added successfully!', { containerId: 'B' });
            onCreated();
            onClose();
        } catch (error) {
            toast.error(error.response?.data || 'An unexpected error occurred.', { containerId: 'B' });
            console.error("Failed to add dish:", error);
        }
    };

    return (
        <>
            <Drawer open={isOpen} onClose={onClose}>
                <DrawerContent className="bg-white">
                    <DrawerHeader className="border-b">
                        <DrawerTitle className="text-xl font-semibold">Add New Dish</DrawerTitle>
                        <Button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
                            <FaTimes />
                        </Button>
                    </DrawerHeader>
                    <div className="p-6 space-y-4">
                        <Input
                            placeholder="Dish Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
                        />

                        <Input
                            placeholder="Price"
                            type="number"
                            step="0.01"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
                        />

                        <div>
                            <h3 className="font-semibold mb-2">Ingredients:</h3>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                {ingres.map((ingredient) => (
                                    <div key={ingredient.id} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={`ingredient-${ingredient.id}`}
                                            checked={ingredientIds.includes(Number(ingredient.id))}
                                            onChange={() => handleCheckboxChange(ingredient.id)}
                                            className="mr-2 rounded text-orange-500 focus:ring-orange-500"
                                        />
                                        <label htmlFor={`ingredient-${ingredient.id}`}>{ingredient.name}</label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2">Images:</h3>
                            <input
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                className="mb-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                            />
                            <div className="flex flex-wrap gap-2">
                                {filePreviews.map((preview, index) => (
                                    <div key={index} className="relative">
                                        <Image
                                            src={preview}
                                            alt={`preview-${index}`}
                                            width={64}
                                            height={64}
                                            className="object-cover rounded"
                                        />
                                        <button
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                                        >
                                            <FaTimes className="text-gray-600 text-xs" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <DrawerFooter className="border-t">
                        <Button onClick={handleSubmit} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded">
                            Add Dish
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
            <ToastContainer containerId="B" position="top-right" autoClose={3000} />
        </>
    );
}