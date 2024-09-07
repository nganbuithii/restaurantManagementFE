import React, { useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useSelector } from 'react-redux';
import { FaTimes, FaCalendar, FaPercent, FaToggleOn, FaClock, FaPlus, FaCoins } from 'react-icons/fa';
import { authApi, endpoints } from '@/app/configs/API';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Label } from '@/components/ui/label';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function VoucherDrawer({ isOpen, onClose, onCreated }) {
    const [voucher, setVoucher] = useState({
        percent: '',
        description: '',
        startDate: new Date(),
        endDate: new Date(),
        isActive: true,
        status: 'ACTIVE',
        quantity: '',
        pointCost: ''
    });

    const token = useSelector((state) => state.auth.token);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVoucher(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (name, date) => {
        setVoucher(prev => ({ ...prev, [name]: date }));
    };

    const handleSubmit = async () => {
        try {
            await authApi(token).post(endpoints.getAllVouchers, {
                percent: Number(voucher.percent),
                description: voucher.description,
                startDate: voucher.startDate.toISOString(),
                endDate: voucher.endDate.toISOString(),
                isActive: voucher.isActive,
                status: voucher.status,
                quantity: Number(voucher.quantity),
                pointCost: Number(voucher.pointCost),
            });

            toast.success('Voucher created successfully!', { containerId: 'B' });
            onCreated();
            onClose();
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(`Error: ${error.response.data.message || 'Something went wrong'}`, { containerId: 'B' });
            } else {
                toast.error('An unexpected error occurred.', { containerId: 'B' });
            }
            console.error("Failed to create voucher:", error);
        }
    };

    return (
        <>
            <Drawer open={isOpen} onClose={onClose}>
                <DrawerContent className="bg-gradient-to-br from-orange-50 to-orange-100">
                    <DrawerHeader className="border-b border-orange-200">
                        <DrawerTitle className="text-2xl font-bold text-orange-800">Create New Voucher</DrawerTitle>
                        <Button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-orange-200 text-orange-800 hover:bg-orange-300 transition duration-300">
                            <FaTimes />
                        </Button>
                    </DrawerHeader>
                    <div className="p-6 space-y-6">
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <div className="mb-4">
                                <Label htmlFor="description" className="text-sm text-gray-600">Description</Label>
                                <Input
                                    id="description"
                                    name="description"
                                    value={voucher.description}
                                    onChange={handleChange}
                                    className="font-semibold text-orange-800"
                                    placeholder="Voucher Description"
                                />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-orange-100 p-2 rounded-full">
                                        <FaPercent className="text-orange-600" />
                                    </div>
                                    <div className="flex-1">
                                        <Label htmlFor="percent" className="text-sm text-gray-600">Discount Percent</Label>
                                        <Input
                                            id="percent"
                                            name="percent"
                                            type="number"
                                            value={voucher.percent}
                                            onChange={handleChange}
                                            className="font-semibold text-orange-800"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-3">
                                    <div className="bg-orange-100 p-2 rounded-full">
                                        <FaToggleOn className="text-orange-600" />
                                    </div>
                                    <div className="flex-1">
                                        <Label htmlFor="status" className="text-sm text-gray-600">Status</Label>
                                        <Select 
                                            onValueChange={(value) => setVoucher(prev => ({ ...prev, status: value }))}
                                            value={voucher.status}
                                        >
                                            <SelectTrigger id="status" className="font-semibold text-orange-800">
                                                <SelectValue placeholder="Select Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                                                <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                                                <SelectItem value="EXPIRED">EXPIRED</SelectItem>
                                                <SelectItem value="USED_UP">USED_UP</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-3">
                                    <div className="bg-orange-100 p-2 rounded-full">
                                        <FaCalendar className="text-orange-600" />
                                    </div>
                                    <div className="flex-1">
                                        <Label htmlFor="startDate" className="text-sm text-gray-600">Start Date</Label>
                                        <DatePicker
                                            id="startDate"
                                            selected={voucher.startDate}
                                            onChange={(date) => handleDateChange('startDate', date)}
                                            showTimeSelect
                                            dateFormat="Pp"
                                            className=" ml-4 w-full p-2 border border-orange-300 rounded-md shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-200 transition font-semibold text-orange-800"
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-3">
                                    <div className="bg-orange-100 p-2 rounded-full">
                                        <FaCalendar className="text-orange-600" />
                                    </div>
                                    <div className="flex-1">
                                        <Label htmlFor="endDate" className="text-sm text-gray-600">End Date</Label>
                                        <DatePicker
                                            id="endDate"
                                            selected={voucher.endDate}
                                            onChange={(date) => handleDateChange('endDate', date)}
                                            showTimeSelect
                                            dateFormat="Pp"
                                            className="ml-4 w-full p-2 border border-orange-300 rounded-md shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-200 transition font-semibold text-orange-800"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <div className="bg-orange-100 p-2 rounded-full">
                                        <FaClock className="text-orange-600" />
                                    </div>
                                    <div className="flex-1">
                                        <Label htmlFor="quantity" className="text-sm text-gray-600">Quantity</Label>
                                        <Input
                                            id="quantity"
                                            name="quantity"
                                            type="number"
                                            value={voucher.quantity}
                                            onChange={handleChange}
                                            className="font-semibold text-orange-800"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <div className="bg-orange-100 p-2 rounded-full">
                                        <FaCoins className="text-orange-600" />
                                    </div>
                                    <div className="flex-1">
                                        <Label htmlFor="pointCost" className="text-sm text-gray-600">Point Cost</Label>
                                        <Input
                                            id="pointCost"
                                            name="pointCost"
                                            type="number"
                                            value={voucher.pointCost}
                                            onChange={handleChange}
                                            className="font-semibold text-orange-800"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DrawerFooter className="border-t border-orange-200">
                        <Button onClick={handleSubmit} className="bg-orange-600 text-white hover:bg-orange-700 transition duration-300">
                            <FaPlus className="mr-2" /> Create Voucher
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
            <ToastContainer position="top-right" autoClose={3000} containerId="B" />
        </>
    );
}