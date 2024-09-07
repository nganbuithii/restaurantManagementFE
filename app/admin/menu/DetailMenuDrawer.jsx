'use client';
import React, { useState, useEffect } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import { FaTimes, FaEdit, FaSave, FaEnvelope, FaClock } from 'react-icons/fa';
import { authApi, endpoints } from '@/app/configs/API';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Label } from '@/components/ui/label';

export default function DetailDrawerMenu({ isOpen, onClose, idDetail, onUpdate }) {
    const [menu, setMenu] = useState(null);
    const [allDishes, setAllDishes] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editedMenu, setEditedMenu] = useState(null);
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        const getMenuInfo = async () => {
            try {
                const response = await authApi(token).get(endpoints.getMenuById(idDetail));
                const menuData = response.data.data;
                setMenu(menuData);
                setEditedMenu({
                    ...menuData,
                    menuItems: menuData.menuItems || []
                });
            } catch (error) {
                console.error("Failed to fetch menu details:", error);
                toast.error('Failed to fetch menu details.', { containerId: 'D' });
            }
        };

        if (isOpen && idDetail) {
            getMenuInfo();
            setIsEditing(false);
        }
    }, [isOpen, idDetail, token]);

    const getAllDishes = async () => {
        try {
            const response = await authApi(token).get(endpoints.getAllDishes);
            setAllDishes(response.data.data);
        } catch (error) {
            console.error("Failed to fetch all dishes:", error);
            toast.error('Failed to fetch dishes.', { containerId: 'D' });
        }
    };

    const handleEdit = async () => {
        await getAllDishes(); // Fetch all dishes when entering edit mode
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedMenu(menu);
    };

    const handleSave = async () => {
        try {
            const response = await authApi(token).patch(endpoints.getMenuById(idDetail), editedMenu);
            setMenu(response.data.data);
            setIsEditing(false);
            toast.success('Menu updated successfully', { containerId: 'D' });
            if (onUpdate) onUpdate();
            onClose();
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(`Error: ${error.response.data.message || 'Something went wrong'}`, { containerId: 'D' });
            } else {
                toast.error('An unexpected error occurred.', { containerId: 'D' });
            }
            console.error("Failed to update menu:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedMenu(prev => ({ ...prev, [name]: value }));
    };

    const handleMenuItemChange = (id, checked) => {
        const updatedMenuItems = checked 
            ? [...editedMenu.menuItems, { id }] 
            : editedMenu.menuItems.filter(item => item.id !== id);

        setEditedMenu(prev => ({ ...prev, menuItems: updatedMenuItems }));
    };

    const addMenuItem = () => {
        setEditedMenu(prev => ({
            ...prev,
            menuItems: [...prev.menuItems, { name: '' }]
        }));
    };

    if (!menu || !allDishes) {
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
            <Drawer open={isOpen} onClose={onClose}>
                <DrawerContent aria-labelledby="drawer-title" aria-describedby="drawer-description" className="bg-gradient-to-br from-orange-50 to-orange-100">
                    <DrawerHeader className="border-b border-orange-200">
                        <DrawerTitle className="text-2xl font-bold text-orange-800">
                            {isEditing ? 'Edit Menu' : 'Menu Details'}
                        </DrawerTitle>
                        <Button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-orange-200 text-orange-800 hover:bg-orange-300 transition duration-300">
                            <FaTimes />
                        </Button>
                    </DrawerHeader>
                    <div className="p-6 space-y-6">
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold text-orange-800">
                                    {isEditing ? (
                                        <Input
                                            name="name"
                                            value={editedMenu.name}
                                            onChange={handleInputChange}
                                            className="font-semibold text-orange-800"
                                        />
                                    ) : menu.name}
                                </h3>
                                {!isEditing && (
                                    <Button onClick={handleEdit} className="bg-orange-500 text-white hover:bg-orange-600 transition duration-300">
                                        <FaEdit className="mr-2" /> Edit
                                    </Button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-orange-100 p-2 rounded-full">
                                        <FaEnvelope className="text-orange-600" />
                                    </div>
                                    <div>
                                        <Label className="text-sm text-gray-600">Status</Label>
                                        {isEditing ? (
                                            <select
                                                name="isActive"
                                                value={editedMenu.isActive}
                                                onChange={handleInputChange}
                                                className="font-semibold text-orange-800 border rounded p-1"
                                            >
                                                <option value={true}>Active</option>
                                                <option value={false}>Inactive</option>
                                            </select>
                                        ) : (
                                            <p className="font-semibold text-orange-800">{menu.isActive ? 'Active' : 'Inactive'}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <div className="bg-orange-100 p-2 rounded-full">
                                        <FaClock className="text-orange-600" />
                                    </div>
                                    <div>
                                        <Label className="text-sm text-gray-600">Created At</Label>
                                        <p className="font-semibold text-orange-800">{formatDate(menu.createdAt)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <div className="bg-orange-100 p-2 rounded-full">
                                        <FaClock className="text-orange-600" />
                                    </div>
                                    <div>
                                        <Label className="text-sm text-gray-600">Updated At</Label>
                                        <p className="font-semibold text-orange-800">{formatDate(menu.updatedAt)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
                                <h4 className="text-lg font-semibold text-orange-800 mb-4">Menu Items</h4>
                                {isEditing ? (
                                    <>
                                        {allDishes.length > 0 ? (
                                            allDishes.map((dish) => (
                                                <div key={dish.id} className="flex items-center mb-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={editedMenu.menuItems.some(item => item.id === dish.id)}
                                                        onChange={(e) => handleMenuItemChange(dish.id, e.target.checked)}
                                                        className="mr-2"
                                                    />
                                                    <label className="text-orange-800">{dish.name}</label>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-600">No dishes available.</p>
                                        )}
                                    </>
                                ) : (
                                    menu.menuItems && menu.menuItems.length > 0 ? (
                                        <ul className="list-disc list-inside space-y-2">
                                            {menu.menuItems.map((item, index) => (
                                                <li key={index} className="text-orange-800">
                                                    {item.name}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-600">No menu items available.</p>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                    <DrawerFooter className="border-t border-orange-200">
                        {isEditing ? (
                            <>
                                <Button onClick={handleSave} className="bg-green-600 text-white hover:bg-green-700 transition duration-300">
                                    <FaSave className="mr-2" /> Save Changes
                                </Button>
                                <Button onClick={handleCancelEdit} className="bg-gray-500 text-white hover:bg-gray-600 transition duration-300">
                                    Cancel
                                </Button>
                            </>
                        ) : (
                            <Button onClick={onClose} className="bg-orange-600 text-white hover:bg-orange-700 transition duration-300">
                                Close
                            </Button>
                        )}
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
            <ToastContainer position="top-right" autoClose={3000} containerId="D"/>
        </>
    );
}
