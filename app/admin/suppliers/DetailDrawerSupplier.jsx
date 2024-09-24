import React, { useState, useEffect } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import { FaTimes, FaBuilding, FaEnvelope, FaMapMarkerAlt, FaEdit, FaSave, FaToggleOn, FaClock } from 'react-icons/fa';
import { authApi, endpoints } from '@/app/configs/API';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Label } from '@/components/ui/label';
import { checkPermission } from '@/utils/permissionUtils';

export default function DetailDrawerSupplier({ isOpen, onClose, idDetail, onUpdate }) {
    const permissions = useSelector(state => state.auth.permissions);
    const canUpdateSuppliers = checkPermission(permissions, 'Suppliers', 'UPDATE');

    const [supplier, setSupplier] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedSupplier, setEditedSupplier] = useState(null);
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        const getSupplierInfo = async () => {
            try {
                const response = await authApi(token).get(endpoints.getSupplierById(idDetail));
                setSupplier(response.data.data);
                setEditedSupplier(response.data.data);
            } catch (error) {
                console.error("Failed to fetch supplier:", error);
                toast.error('Failed to fetch supplier details.', { containerId: 'D' });
            }
        };

        if (isOpen && idDetail) {
            getSupplierInfo();
            setIsEditing(false);
        }
    }, [isOpen, idDetail, token]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedSupplier(supplier);
    };

    const handleSave = async () => {
        try {
            const response = await authApi(token).patch(endpoints.getSupplierById(idDetail), editedSupplier);
            setSupplier(response.data.data);
            setIsEditing(false);
            toast.success('Supplier updated successfully', { containerId: 'D' });
            if (onUpdate) onUpdate();
            onClose();
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(`Error: ${error.response.data.message || 'Something went wrong'}`, { containerId: 'D' });
            } else {
                toast.error('An unexpected error occurred.', { containerId: 'D' });
            }
            console.error("Failed to update supplier:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedSupplier(prev => ({ ...prev, [name]: value }));
    };

    if (!supplier) {
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
                            {isEditing ? 'Edit Supplier' : 'Supplier Details'}
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
                                            value={editedSupplier.name}
                                            onChange={handleInputChange}
                                            className="font-semibold text-orange-800"
                                        />
                                    ) : supplier.name}
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
                                        <Label className="text-sm text-gray-600">Email</Label>
                                        {isEditing ? (
                                            <Input
                                                name="email"
                                                type="email"
                                                value={editedSupplier.email}
                                                onChange={handleInputChange}
                                                className="font-semibold text-orange-800"
                                            />
                                        ) : (
                                            <p className="font-semibold text-orange-800">{supplier.email}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <div className="bg-orange-100 p-2 rounded-full">
                                        <FaMapMarkerAlt className="text-orange-600" />
                                    </div>
                                    <div>
                                        <Label className="text-sm text-gray-600">Address</Label>
                                        {isEditing ? (
                                            <Input
                                                name="address"
                                                value={editedSupplier.address}
                                                onChange={handleInputChange}
                                                className="font-semibold text-orange-800"
                                            />
                                        ) : (
                                            <p className="font-semibold text-orange-800">{supplier.address}</p>
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
                                                name="isActive"
                                                value={editedSupplier.isActive}
                                                onChange={handleInputChange}
                                                className="font-semibold text-orange-800 border rounded p-1"
                                            >
                                                <option value={true}>Active</option>
                                                <option value={false}>Inactive</option>
                                            </select>
                                        ) : (
                                            <p className="font-semibold text-orange-800">{supplier.isActive ? 'Active' : 'Inactive'}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <div className="bg-orange-100 p-2 rounded-full">
                                        <FaClock className="text-orange-600" />
                                    </div>
                                    <div>
                                        <Label className="text-sm text-gray-600">Last Updated</Label>
                                        <p className="font-semibold text-orange-800">{formatDate(supplier.updatedAt)}</p>
                                    </div>
                                </div>
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
            <ToastContainer position="top-right" autoClose={3000} containerId="D" />
        </>
    );
}