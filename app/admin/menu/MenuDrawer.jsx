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

export default function MenuDrawer({ isOpen, onClose, onCreated }) {
    const [name, setName] = useState('');
    const [dishes, setDishes] = useState([]);
    const [selectedDishes, setSelectedDishes] = useState([]);

    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        const fetchDishes = async () => {
            try {
                const response = await authApi(token).get(endpoints.getAllDishes);
                setDishes(response.data.data.data);
            } catch (error) {
                console.error("Failed to fetch dishes:", error);
            }
        };

        if (isOpen) {
            fetchDishes();
        }
    }, [isOpen, token]);

    const handleCheckboxChange = (id) => {
        setSelectedDishes((prev) =>
            prev.includes(id) ? prev.filter((dishId) => dishId !== id) : [...prev, id]
        );
    };

    const handleSubmit = async () => {
        try {
            await authApi(token).post(endpoints.getAllMenus, {
                name,
                menuItemIds: selectedDishes
            });
            toast.success('Menu created successfully', { containerId: 'B' });
            onCreated();
            onClose();
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error('ERROR: ' + error.response.data.message, { containerId: 'B' });
            } else {
                toast.error('An unexpected error occurred.', { containerId: 'B' });
            }
            console.error("Failed to create menu:", error);
        }
    };

    return (
        <>
            <Drawer open={isOpen} onClose={onClose}>
                <DrawerContent className="bg-orange-50 max-h-[90vh] overflow-y-auto">
                    <DrawerHeader className="border-b border-orange-200">
                        <DrawerTitle className="text-2xl font-bold text-orange-800">
                            Add New Menu
                        </DrawerTitle>
                        <Button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-orange-200 text-orange-800 hover:bg-orange-300">
                            <FaTimes />
                        </Button>
                    </DrawerHeader>
                    <div className="p-6 space-y-6">
                        <Input
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full mb-4 border border-orange-300 rounded-md p-2"
                        />
                        
                        <div className="mb-4">
                            <label className="block mb-2 text-orange-800 font-semibold">Dishes:</label>
                            {dishes.map((dish) => (
                                <div key={dish.id} className="flex items-center mb-2">
                                    <input
                                        type="checkbox"
                                        id={`dish-${dish.id}`}
                                        checked={selectedDishes.includes(dish.id)}
                                        onChange={() => handleCheckboxChange(dish.id)}
                                        className="mr-2 accent-orange-500"
                                    />
                                    <label htmlFor={`dish-${dish.id}`} className="text-orange-800">{dish.name}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <DrawerFooter className="border-t border-orange-200">
                        <Button onClick={handleSubmit} className="bg-orange-600 text-white hover:bg-orange-700 transition duration-300">
                            Submit
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
            <ToastContainer containerId="B" position="top-right" autoClose={3000} />
        </>
    );
}
