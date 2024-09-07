import React, { useState, useEffect } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import { FaTimes, FaCalendar, FaDollarSign, FaToggleOn, FaClock, FaEdit, FaSave } from 'react-icons/fa';
import { authApi, endpoints } from '@/app/configs/API';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import { Label } from '@/components/ui/label';

export default function DetailDishesDrawer({ isOpen, onClose, dishId, onUpdate }) {
    const [dish, setDish] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedDish, setEditedDish] = useState(null);
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        const fetchDishDetails = async () => {
            try {
                const response = await authApi(token).get(endpoints.getDisheById(dishId));
                setDish(response.data.data);
                setEditedDish(response.data.data);
            } catch (error) {
                console.error("Failed to fetch dish details:", error);
                toast.error('Failed to fetch dish details.', { containerId: 'D' });
            }
        };

        if (isOpen && dishId) {
            fetchDishDetails();
            setIsEditing(false);
        }
    }, [isOpen, dishId, token]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedDish(dish);
        onClose();
    };

    const handleSave = async () => {
        try {
            const response = await authApi(token).patch(endpoints.getDisheById(dishId), editedDish);
            setDish(response.data.data);
            setIsEditing(false);
            toast.success('Dish updated successfully', { containerId: 'D' });
            if (onUpdate) onUpdate();
            onClose();
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(`ERROR: ${error.response.data.message}`, { containerId: 'D' });
            } else {
                toast.error('An unexpected error occurred.', { containerId: 'D' });
            }
            console.error("Failed to update:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedDish(prev => ({ ...prev, [name]: value }));
    };

    if (!dish) {
        return null;
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <>
            <Drawer open={isOpen} onClose={onClose} >
                <DrawerContent aria-labelledby="drawer-title"
                    aria-describedby="drawer-description" className="bg-gradient-to-br from-orange-50 to-orange-100">
                    <DrawerHeader className="border-b border-orange-200 flex justify-between items-center p-4">
                        <DrawerTitle id="drawer-title" className="text-2xl font-bold text-orange-800">
                            {isEditing ? 'Edit Dish' : 'Dish Details'}
                        </DrawerTitle>
                        <Button onClick={onClose} className="p-2 rounded-full bg-orange-200 text-orange-800 hover:bg-orange-300 transition duration-300">
                            <FaTimes />
                        </Button>
                    </DrawerHeader>
                    <div className=" max-h-[90vh] overflow-y-auto p-6 space-y-6">
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-semibold text-orange-800">
                                    {isEditing ? (
                                        <Input
                                            name="name"
                                            value={editedDish.name}
                                            onChange={handleInputChange}
                                            className="font-semibold text-orange-800"
                                        />
                                    ) : dish.name}
                                </h3>
                                {!isEditing && (
                                    <Button onClick={handleEdit} className="bg-orange-500 text-white hover:bg-orange-600 transition duration-300">
                                        <FaEdit className="mr-2" /> Edit
                                    </Button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                                    <FaDollarSign className="text-orange-600 text-2xl" />
                                    <div>
                                        <Label className="text-sm text-gray-600">Price</Label>
                                        {isEditing ? (
                                            <Input
                                                name="price"
                                                type="number"
                                                value={editedDish.price}
                                                onChange={handleInputChange}
                                                className="font-semibold text-orange-800"
                                            />
                                        ) : (
                                            <p className="font-semibold text-orange-800">${(dish.price || 0).toFixed(2)}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                                    <FaToggleOn className="text-orange-600 text-2xl" />
                                    <div>
                                        <Label className="text-sm text-gray-600">Status</Label>
                                        {isEditing ? (
                                            <select
                                                name="isActive"
                                                value={editedDish.isActive}
                                                onChange={handleInputChange}
                                                className="font-semibold text-orange-800 border rounded p-2"
                                            >
                                                <option value={true}>Active</option>
                                                <option value={false}>Inactive</option>
                                            </select>
                                        ) : (
                                            <p className="font-semibold text-orange-800">{dish.isActive ? 'Active' : 'Inactive'}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                                    <FaCalendar className="text-orange-600 text-2xl" />
                                    <div>
                                        <Label className="text-sm text-gray-600">Created At</Label>
                                        <p className="font-semibold text-orange-800">{formatDate(dish.createdAt)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                                    <FaClock className="text-orange-600 text-2xl" />
                                    <div>
                                        <Label className="text-sm text-gray-600">Last Updated</Label>
                                        <p className="font-semibold text-orange-800">{formatDate(dish.updatedAt)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {dish.images && dish.images.length > 0 && (
                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <h4 className="text-lg font-semibold text-orange-800 mb-4">Dish Images</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {dish.images.map((image) => (
                                        <div key={image.id} className="relative w-full h-32 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
                                            <Image
                                                src={image.url}
                                                alt={`Dish Image ${image.id}`}
                                                layout="fill"
                                                objectFit="cover"
                                                className="transition-transform duration-300 hover:scale-110"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {dish.ingredients && dish.ingredients.length > 0 && (
                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <h4 className="text-lg font-semibold text-orange-800 mb-4">Ingredients</h4>
                                <ul className="list-disc list-inside pl-5">
                                    {dish.ingredients.map((ingredient, index) => (
                                        <li key={index} className="text-orange-800">
                                            {ingredient.ingredient.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    <DrawerFooter className="border-t border-orange-200 p-4">
                        {isEditing ? (
                            <div className="flex space-x-4">
                                <Button onClick={handleSave} className="bg-green-600 text-white hover:bg-green-700 transition duration-300 flex items-center">
                                    <FaSave className="mr-2" /> Save Changes
                                </Button>
                                <Button onClick={handleCancelEdit} className="bg-gray-500 text-white hover:bg-gray-600 transition duration-300 flex items-center">
                                    Cancel
                                </Button>
                            </div>
                        ) : (
                            <Button onClick={onClose} className="bg-orange-600 text-white hover:bg-orange-700 transition duration-300 flex items-center w-1/4">
                                Close
                            </Button>
                        )}
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
            <ToastContainer position="top-right" autoClose={3000} containerId="D" />
        </>
    );
}
