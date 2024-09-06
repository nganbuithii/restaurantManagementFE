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

export default function DetailDrawerIngres({ isOpen, onClose, idDetail, onUpdate }) {
    const [ingres, setIngres] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedIngres, setEditedIngres] = useState(null);
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        const getInfoIngre = async () => {
            try {
                const response = await authApi(token).get(endpoints.getInById(idDetail));
                setIngres(response.data.data);
                setEditedIngres(response.data.data);

            } catch (error) {
                console.error("Failed to fetch ingredients:", error);
                toast.error('Failed to fetch ingredient details.');
            }
        };

        if (isOpen && idDetail) {
            getInfoIngre();
            setIsEditing(false);
        }
    }, [isOpen, idDetail, token]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedIngres(ingres);
    };

    const handleSave = async () => {
        try {
            const response = await authApi(token).patch(endpoints.getInById(idDetail), editedIngres);
            setIngres(response.data.data);
            setIsEditing(false);
            toast.success('Ingredient updated successfully', { containerId: 'C' });
            if (onUpdate) onUpdate();
            onClose();
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error('ERROR', error.response, "+", error.response.data, { containerId: 'C' });
            } else {
                toast.error('An unexpected error occurred.', { containerId: 'C' });
            }
            console.error("Failed to delete:", error);
            onClose();
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedIngres(prev => ({ ...prev, [name]: value }));
    };

    if (!ingres) {
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
                <DrawerContent aria-labelledby="drawer-title" 
        aria-describedby="drawer-description" className="bg-gradient-to-br from-orange-50 to-orange-100">
                    <DrawerHeader className="border-b border-orange-200">
                        <DrawerTitle className="text-2xl font-bold text-orange-800">
                            {isEditing ? 'Edit Ingredient' : 'Ingredient Details'}
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
                                            value={editedIngres.name}
                                            onChange={handleInputChange}
                                            className="font-semibold text-orange-800"
                                        />
                                    ) : ingres.name}
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
                                        <FaDollarSign className="text-orange-600" />
                                    </div>
                                    <div>
                                        <Label className="text-sm text-gray-600">Price</Label>
                                        {isEditing ? (
                                            <Input
                                                name="price"
                                                type="number"
                                                value={editedIngres.price}
                                                onChange={handleInputChange}
                                                className="font-semibold text-orange-800"
                                            />
                                        ) : (
                                            <p className="font-semibold text-orange-800">${(ingres.price || 0).toFixed(2)}</p>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-3">
                                    <div className="bg-orange-100 p-2 rounded-full">
                                        <FaToggleOn className="text-orange-600" />
                                    </div>
                                    <div>
                                        <Label className="text-sm text-gray-600">Status</Label>
                                        {isEditing ? (
                                            <select
                                                name="status"
                                                value={editedIngres.status}
                                                onChange={handleInputChange}
                                                className="font-semibold text-orange-800 border rounded p-1"
                                            >
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                            </select>
                                        ) : (
                                            <p className="font-semibold text-orange-800">{ingres.status}</p>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-3">
                                    <div className="bg-orange-100 p-2 rounded-full">
                                        <FaCalendar className="text-orange-600" />
                                    </div>
                                    <div>
                                        <Label className="text-sm text-gray-600">Production Date</Label>
                                        {isEditing ? (
                                            <Input
                                                name="productDate"
                                                type="date"
                                                value={editedIngres.productDate.split('T')[0]}
                                                onChange={handleInputChange}
                                                className="font-semibold text-orange-800"
                                            />
                                        ) : (
                                            <p className="font-semibold text-orange-800">{formatDate(ingres.productDate)}</p>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-3">
                                    <div className="bg-orange-100 p-2 rounded-full">
                                        <FaClock className="text-orange-600" />
                                    </div>
                                    <div>
                                        <Label className="text-sm text-gray-600">Last Updated</Label>
                                        <p className="font-semibold text-orange-800">{formatDate(ingres.updatedAt)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {ingres.imageUrls && (
                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <h4 className="text-lg font-semibold text-orange-800 mb-4">Product Images</h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {ingres.imageUrls.map((url, index) => (
                                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
                                            <Image
                                                src={url}
                                                alt={`Image ${index + 1}`}
                                                layout="fill"
                                                objectFit="cover"
                                                className="transition-transform duration-300 hover:scale-110"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
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
            <ToastContainer position="top-right" autoClose={3000} containerId="C"/>
        </>
    );
}