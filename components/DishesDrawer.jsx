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
            if (prev.includes(numberId)) {
                return prev.filter(ingredientId => ingredientId !== numberId);
            } else {
                return [...prev, numberId];
            }
        });
    };

    const handleFileChange = (event) => {
        const filesArray = Array.from(event.target.files);
        setFiles(filesArray);
        setFilePreviews(filesArray.map(file => URL.createObjectURL(file)));
    };

    useEffect(() => {
        return () => {
            filePreviews.forEach(url => URL.revokeObjectURL(url));
        };
    }, [filePreviews]);

    const handleRemoveImage = (index) => {
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('price', parseFloat(price).toFixed(2));
            formData.append('ingredientIds', JSON.stringify(ingredientIds));
            files.forEach(file => formData.append('files', file));

            const response = await authApi(token).post(endpoints.getAllDishes, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success('Thêm món ăn thành công!', { containerId: 'B' });
            onCreated();
            onClose();
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra';
            toast.error(`Lỗi: ${errorMessage}`, { containerId: 'B' });
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
                                        checked={ingredientIds.includes(Number(ingredient.id))}
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
                                {filePreviews.map((preview, index) => (
                                    <div key={index} className="relative mr-2 mb-2">
                                        <Image
                                            src={preview}
                                            alt={`preview-${index}`}
                                            width={96}
                                            height={96}
                                            className="object-cover"
                                        />
                                        <Button
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute -top-3 right-0 p-2 py-0 bg-red-500 text-white rounded-full"
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
            <ToastContainer containerId="B" position="top-right" autoClose={3000} />
        </>
    );
}
