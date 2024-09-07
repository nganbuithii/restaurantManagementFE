'use client';
import React, { useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import { FaTimes, FaBuilding, FaEnvelope, FaMapMarkerAlt, FaPlus } from 'react-icons/fa';
import { authApi, endpoints } from '@/app/configs/API';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Label } from '@/components/ui/label';

export default function SupplierDrawer({ isOpen, onClose, onCreated }) {
    const [supplier, setSupplier] = useState({
        name: '',
        email: '',
        address: ''
    });

    const token = useSelector((state) => state.auth.token);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSupplier(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            await authApi(token).post(endpoints.getAllSupliers, supplier);
            toast.success("Supplier added successfully!", { containerId: 'B' });
            onCreated();
            onClose();
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(`Error: ${error.response.data.message || 'Something went wrong'}`, { containerId: 'B' });
            } else {
                toast.error('An unexpected error occurred.', { containerId: 'B' });
            }
            console.error("Failed to add supplier:", error);
        }
    };

    return (
        <>
            <Drawer open={isOpen} onClose={onClose}>
                <DrawerContent className="bg-gradient-to-br from-orange-50 to-orange-100">
                    <DrawerHeader className="border-b border-orange-200">
                        <DrawerTitle className="text-2xl font-bold text-orange-800">Add New Supplier</DrawerTitle>
                        <Button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-orange-200 text-orange-800 hover:bg-orange-300 transition duration-300">
                            <FaTimes />
                        </Button>
                    </DrawerHeader>
                    <div className="p-6 space-y-6">
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <div className="mb-4">
                                <Label htmlFor="name" className="text-sm text-gray-600">Company Name</Label>
                                <div className="flex items-center space-x-3">
                                    <div className="bg-orange-100 p-2 rounded-full">
                                        <FaBuilding className="text-orange-600" />
                                    </div>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={supplier.name}
                                        onChange={handleChange}
                                        className="font-semibold text-orange-800 flex-1"
                                        placeholder="Enter company name"
                                    />
                                </div>
                            </div>
                            
                            <div className="mb-4">
                                <Label htmlFor="email" className="text-sm text-gray-600">Email</Label>
                                <div className="flex items-center space-x-3">
                                    <div className="bg-orange-100 p-2 rounded-full">
                                        <FaEnvelope className="text-orange-600" />
                                    </div>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={supplier.email}
                                        onChange={handleChange}
                                        className="font-semibold text-orange-800 flex-1"
                                        placeholder="Enter email address"
                                    />
                                </div>
                            </div>
                            
                            <div className="mb-4">
                                <Label htmlFor="address" className="text-sm text-gray-600">Address</Label>
                                <div className="flex items-center space-x-3">
                                    <div className="bg-orange-100 p-2 rounded-full">
                                        <FaMapMarkerAlt className="text-orange-600" />
                                    </div>
                                    <Input
                                        id="address"
                                        name="address"
                                        value={supplier.address}
                                        onChange={handleChange}
                                        className="font-semibold text-orange-800 flex-1"
                                        placeholder="Enter supplier address"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <DrawerFooter className="border-t border-orange-200">
                        <Button onClick={handleSubmit} className="bg-orange-600 text-white hover:bg-orange-700 transition duration-300">
                            <FaPlus className="mr-2" /> Add Supplier
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
            <ToastContainer containerId="B" position="top-right" autoClose={3000} />
        </>
    );
}