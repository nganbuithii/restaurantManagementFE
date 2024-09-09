import React, { useState, useEffect } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import { FaTimes, FaWarehouse } from 'react-icons/fa';
import { authApi, endpoints } from '@/app/configs/API';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function DetailStoreHouseDrawer({ isOpen, onClose, slipId }) {
    const [slip, setSlip] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        const fetchSlipDetails = async () => {
            if (!isOpen || !slipId) return;

            try {
                const response = await authApi(token).get(endpoints.getSlipById(slipId));
                setSlip(response.data.data);
                setFormData({
                    type: response.data.data.type,
                    isActive: response.data.data.isActive,
                    // Thêm các trường cần thiết ở đây
                });
            } catch (error) {
                console.error("Error fetching warehouse slip details:", error);
                toast.error('Failed to load warehouse slip details. Please try again.', { containerId: 'C' });
            }
        };

        fetchSlipDetails();
    }, [isOpen, slipId, token]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        // Reset formData to the original slip data if needed
        setFormData({
            type: slip.type,
            isActive: slip.isActive,
            // Thêm các trường cần thiết ở đây
        });
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSave = async () => {
        try {
            await authApi(token).put(endpoints.updateSlipById(slipId), formData);
            toast.success('Warehouse slip updated successfully.');
            setIsEditing(false);
            // Refresh the slip data
            const response = await authApi(token).get(endpoints.getSlipById(slipId));
            setSlip(response.data.data);
        } catch (error) {
            console.error("Error updating warehouse slip:", error);
            toast.error('Failed to update warehouse slip. Please try again.', { containerId: 'C' });
        }
    };

    if (!slip) return null;

    return (
        <Drawer open={isOpen} onClose={onClose}>
            <DrawerContent className="bg-gradient-to-br from-blue-50 to-orange-100">
                <DrawerHeader className="bg-white shadow-md sticky top-0 z-10 p-6">
                    <DrawerTitle className="text-3xl font-bold text-orange-800 flex items-center">
                        <FaWarehouse className="mr-4 text-orange-600" />
                        Warehouse Slip Details
                    </DrawerTitle>
                    <Button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 transition duration-300">
                        <FaTimes />
                    </Button>
                </DrawerHeader>
                <div className="p-6 space-y-8">
                    <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Type</h3>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        className="text-lg font-semibold text-gray-900"
                                    />
                                ) : (
                                    <p className="text-lg font-semibold text-gray-900">{slip.type}</p>
                                )}
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                                {isEditing ? (
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        checked={formData.isActive}
                                        onChange={handleChange}
                                        className="mr-2"
                                    />
                                ) : (
                                    <p className="text-lg font-semibold text-gray-900">{slip.isActive ? 'Active' : 'Inactive'}</p>
                                )}
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Created At</h3>
                                <p className="text-lg font-semibold text-gray-900">{new Date(slip.createdAt).toLocaleString()}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Updated At</h3>
                                <p className="text-lg font-semibold text-gray-900">{new Date(slip.updatedAt).toLocaleString()}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">User</h3>
                                <p className="text-lg font-semibold text-gray-900">{slip.user.fullName}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Supplier</h3>
                                <p className="text-lg font-semibold text-gray-900">{slip.supplier.name}</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Details</h3>
                            <div className="bg-orange-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                                {slip.details.map((detail) => (
                                    <div key={detail.id} className="bg-white p-3 rounded-md shadow-sm mb-2">
                                        <p className="text-sm font-medium text-gray-900">Ingredient: {detail.ingredient.name}</p>
                                        <p className="text-sm font-medium text-gray-900">Quantity: {detail.quantity}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {isEditing && (
                            <div className="mt-4">
                                <Button onClick={handleSave} className="bg-blue-500 text-white hover:bg-blue-600 transition duration-300 py-2 px-4 rounded">
                                    Save
                                </Button>
                                <Button onClick={handleCancel} className="ml-2 bg-gray-500 text-white hover:bg-gray-600 transition duration-300 py-2 px-4 rounded">
                                    Cancel
                                </Button>
                            </div>
                        )}
                        {!isEditing && (
                            <Button onClick={handleEditClick} className="mt-4 bg-yellow-500 text-white hover:bg-yellow-600 transition duration-300 py-2 px-4 rounded">
                                Edit
                            </Button>
                        )}
                    </div>
                </div>
                <DrawerFooter className="bg-white shadow-md sticky bottom-0 z-10 p-6">
                    <Button onClick={onClose} className="w-full bg-orange-600 text-white hover:bg-orange-700 transition duration-300 text-lg py-3 rounded-lg">
                        Close
                    </Button>
                </DrawerFooter>
            </DrawerContent>
            <ToastContainer position="top-right" autoClose={3000} containerId="C" />
        </Drawer>
    );
}
