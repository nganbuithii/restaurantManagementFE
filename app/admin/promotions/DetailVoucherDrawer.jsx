import React, { useState, useEffect } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import { FaTimes, FaCalendar, FaPercent, FaToggleOn, FaClock, FaEdit, FaSave, FaBarcode, FaUsers, FaCoins } from 'react-icons/fa';
import { authApi, endpoints } from '@/app/configs/API';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Label } from '@/components/ui/label';

export default function DetailVoucherDrawer({ isOpen, onClose, idDetail, onUpdate }) {
    const [voucher, setVoucher] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedVoucher, setEditedVoucher] = useState(null);
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        const fetchVoucherDetails = async () => {
            try {
                const response = await authApi(token).get(endpoints.getVoucherById(idDetail));
                setVoucher(response.data.data);
                setEditedVoucher(response.data.data);
            } catch (error) {
                console.error("Failed to fetch voucher details:", error);
                toast.error('Failed to fetch voucher details.', { containerId: 'C' });
            }
        };

        if (isOpen && idDetail) {
            fetchVoucherDetails();
            setIsEditing(false);
        }
    }, [isOpen, idDetail, token]);

    const handleEdit = () => setIsEditing(true);

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedVoucher(voucher);
    };

    const handleSave = async () => {
        try {
            const response = await authApi(token).patch(endpoints.getVoucherById(idDetail), editedVoucher);
            setVoucher(response.data.data);
            setIsEditing(false);
            toast.success('Voucher updated successfully', { containerId: 'C' });
            if (onUpdate) onUpdate();
            onClose();
        } catch (error) {
            console.error("Failed to update voucher:", error);
            toast.error('Failed to update voucher. Please try again.', { containerId: 'C' });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedVoucher(prev => ({ ...prev, [name]: value }));
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!voucher) {
        return null;
    }

    return (
        <>
            <Drawer open={isOpen} onClose={onClose}>
                <DrawerContent aria-labelledby="drawer-title" 
                aria-describedby="drawer-description" className="bg-gradient-to-br from-orange-50 to-orange-100">
                    <DrawerHeader className="border-b border-orange-200">
                        <DrawerTitle className="text-2xl font-bold text-orange-800">
                            {isEditing ? 'Edit Voucher' : 'Voucher Details'}
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
                                            name="description"
                                            value={editedVoucher.description}
                                            onChange={handleInputChange}
                                            className="font-semibold text-orange-800"
                                        />
                                    ) : voucher.description}
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
                                        <FaBarcode className="text-orange-600" />
                                    </div>
                                    <div>
                                        <Label className="text-sm text-gray-600">Code</Label>
                                        <p className="font-semibold text-orange-800">{voucher.code}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <div className="bg-orange-100 p-2 rounded-full">
                                        <FaPercent className="text-orange-600" />
                                    </div>
                                    <div>
                                        <Label className="text-sm text-gray-600">Discount Percent</Label>
                                        {isEditing ? (
                                            <Input
                                                name="percent"
                                                type="number"
                                                value={editedVoucher.percent}
                                                onChange={handleInputChange}
                                                className="font-semibold text-orange-800"
                                            />
                                        ) : (
                                            <p className="font-semibold text-orange-800">{voucher.percent}%</p>
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
                                                value={editedVoucher.status}
                                                onChange={handleInputChange}
                                                className="font-semibold text-orange-800 border rounded p-1"
                                            >
                                                <option value="ACTIVE">ACTIVE</option>
                                                <option value="PAUSED">PAUSED</option>
                                                <option value="EXPIRED">EXPIRED</option>
                                            </select>
                                        ) : (
                                            <p className="font-semibold text-orange-800">{voucher.status}</p>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-3">
                                    <div className="bg-orange-100 p-2 rounded-full">
                                        <FaCalendar className="text-orange-600" />
                                    </div>
                                    <div>
                                        <Label className="text-sm text-gray-600">Start Date</Label>
                                        {isEditing ? (
                                            <Input
                                                name="startDate"
                                                type="datetime-local"
                                                value={editedVoucher.startDate.split('.')[0]}
                                                onChange={handleInputChange}
                                                className="font-semibold text-orange-800"
                                            />
                                        ) : (
                                            <p className="font-semibold text-orange-800">{formatDate(voucher.startDate)}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <div className="bg-orange-100 p-2 rounded-full">
                                        <FaCalendar className="text-orange-600" />
                                    </div>
                                    <div>
                                        <Label className="text-sm text-gray-600">End Date</Label>
                                        {isEditing ? (
                                            <Input
                                                name="endDate"
                                                type="datetime-local"
                                                value={editedVoucher.endDate.split('.')[0]}
                                                onChange={handleInputChange}
                                                className="font-semibold text-orange-800"
                                            />
                                        ) : (
                                            <p className="font-semibold text-orange-800">{formatDate(voucher.endDate)}</p>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-3">
                                    <div className="bg-orange-100 p-2 rounded-full">
                                        <FaUsers className="text-orange-600" />
                                    </div>
                                    <div>
                                        <Label className="text-sm text-gray-600">Quantity</Label>
                                        {isEditing ? (
                                            <Input
                                                name="quantity"
                                                type="number"
                                                value={editedVoucher.quantity}
                                                onChange={handleInputChange}
                                                className="font-semibold text-orange-800"
                                            />
                                        ) : (
                                            <p className="font-semibold text-orange-800">{voucher.quantity}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <div className="bg-orange-100 p-2 rounded-full">
                                        <FaUsers className="text-orange-600" />
                                    </div>
                                    <div>
                                        <Label className="text-sm text-gray-600">Used Count</Label>
                                        <p className="font-semibold text-orange-800">{voucher.usedCount}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <div className="bg-orange-100 p-2 rounded-full">
                                        <FaCoins className="text-orange-600" />
                                    </div>
                                    <div>
                                        <Label className="text-sm text-gray-600">Point Cost</Label>
                                        {isEditing ? (
                                            <Input
                                                name="pointCost"
                                                type="number"
                                                value={editedVoucher.pointCost}
                                                onChange={handleInputChange}
                                                className="font-semibold text-orange-800"
                                            />
                                        ) : (
                                            <p className="font-semibold text-orange-800">{voucher.pointCost}</p>
                                        )}
                                    </div>
                                </div>

                          
                            </div>
                        </div>
                    </div>
                    <DrawerFooter className="border-t border-orange-200">
                        {isEditing ? (
                            <div className='flex flex-row space-x-5 justify-end'>
                                <Button onClick={handleCancelEdit} className="bg-gray-500 text-white hover:bg-gray-600 transition duration-300">
                                    Cancel
                                </Button>
                                <Button onClick={handleSave} className="bg-orange-500 text-white hover:bg-green-700 transition duration-300">
                                    <FaSave className="mr-2" /> Save Changes
                                </Button>
                                
                            </div>
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