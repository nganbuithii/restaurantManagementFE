'use client';
import React, { useState, useEffect } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Button } from '@/components/ui/button';
import { FaTimes, FaClock } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { authApi, endpoints } from '@/app/configs/API';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Label } from '@/components/ui/label';

export default function DetailOrderDrawer({ isOpen, onClose, orderId }) {
    const [order, setOrder] = useState(null);
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        const getOrderDetails = async () => {
            try {
                const response = await authApi(token).get(endpoints.getOrderById(orderId));
                setOrder(response.data.data);
            } catch (error) {
                console.error("Failed to fetch order details:", error);
                toast.error('Failed to fetch order details.', { containerId: 'D' });
            }
        };

        if (isOpen && orderId) {
            getOrderDetails();
        }
    }, [isOpen, orderId, token]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (!order) {
        return null;
    }

    return (
        <>
            <Drawer open={isOpen} onClose={onClose}>
                <DrawerContent aria-labelledby="drawer-title" aria-describedby="drawer-description" className="bg-gradient-to-br from-orange-50 to-orange-100">
                    <DrawerHeader className="border-b border-orange-200">
                        <DrawerTitle className="text-2xl font-bold text-orange-800">
                            Order Details
                        </DrawerTitle>
                        <Button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-orange-200 text-orange-800 hover:bg-orange-300 transition duration-300">
                            <FaTimes />
                        </Button>
                    </DrawerHeader>
                    <div className="p-6 space-y-6">
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-orange-100 p-2 rounded-full">
                                        <FaClock className="text-orange-600" />
                                    </div>
                                    <div>
                                        <Label className="text-sm text-gray-600">Order ID</Label>
                                        <p className="font-semibold text-orange-800">{order.id}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <div className="bg-orange-100 p-2 rounded-full">
                                        <FaClock className="text-orange-600" />
                                    </div>
                                    <div>
                                        <Label className="text-sm text-gray-600">Status</Label>
                                        <p className="font-semibold text-orange-800">{order.status}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <div className="bg-orange-100 p-2 rounded-full">
                                        <FaClock className="text-orange-600" />
                                    </div>
                                    <div>
                                        <Label className="text-sm text-gray-600">Total Price</Label>
                                        <p className="font-semibold text-orange-800">${order.totalPrice}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <div className="bg-orange-100 p-2 rounded-full">
                                        <FaClock className="text-orange-600" />
                                    </div>
                                    <div>
                                        <Label className="text-sm text-gray-600">Discount Price</Label>
                                        <p className="font-semibold text-orange-800">${order.discountPrice}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <div className="bg-orange-100 p-2 rounded-full">
                                        <FaClock className="text-orange-600" />
                                    </div>
                                    <div>
                                        <Label className="text-sm text-gray-600">Created At</Label>
                                        <p className="font-semibold text-orange-800">{formatDate(order.createdAt)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
                                <h4 className="text-lg font-semibold text-orange-800 mb-4">Order Details</h4>
                                {order.details && order.details.length > 0 ? (
                                    <ul className="list-disc list-inside space-y-2">
                                        {order.details.map((detail, index) => (
                                            <li key={index} className="text-orange-800">
                                                {detail.menuItemName}: {detail.quantity}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-600">No details available.</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <DrawerFooter className="border-t border-orange-200">
                        <Button onClick={onClose} className="bg-orange-600 text-white hover:bg-orange-700 transition duration-300">
                            Close
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
            <ToastContainer position="top-right" autoClose={3000} containerId="D"/>
        </>
    );
}
