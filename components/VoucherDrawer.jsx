'use client';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import { FaTimes } from 'react-icons/fa';
import { authApi, endpoints } from '@/app/configs/API';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function VoucherDrawer({ isOpen, onClose, onCreated }) {
    const [percent, setPercent] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [isActive, setIsActive] = useState(true);
    const [status, setStatus] = useState('ACTIVE');
    const [quantity, setQuantity] = useState('');
    const [pointCost, setPointCost] = useState('');

    const token = useSelector((state) => state.auth.token);

    const handleSubmit = async () => {
        try {
            const response = await authApi(token).post(endpoints.getAllVouchers, {
                percent: Number(percent),
                description,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                isActive,
                status,
                quantity: Number(quantity),
                pointCost: Number(pointCost),
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
            console.error("Failed to create user:", error);
        }
    };

    return (
        <>
            <Drawer open={isOpen} onClose={onClose}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Create New Voucher</DrawerTitle>
                        <Button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300">
                            <FaTimes />
                        </Button>
                    </DrawerHeader>
                    <div className="p-6 mb-4">
                        <Input
                            placeholder="Discount Percent"
                            type="number"
                            value={percent}
                            onChange={(e) => setPercent(e.target.value)}
                            className="mb-2"
                        />
                        
                        <Input
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mb-2"
                        />

                        <div className="mb-4">
                            <label className="block text-gray-700">Start Date and Time:</label>
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                showTimeSelect
                                dateFormat="Pp"
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200 transition"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700">End Date and Time:</label>
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                showTimeSelect
                                dateFormat="Pp"
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200 transition"
                            />
                        </div>

                        <div className="mb-2">
                            <label className="block">Active:</label>
                            <input
                                type="checkbox"
                                checked={isActive}
                                onChange={() => setIsActive(prev => !prev)}
                                className="mr-2"
                            />
                        </div>

                        <div className="mb-2">
                            <label className="block">Status:</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="block w-full border-gray-300 rounded-md shadow-sm"
                            >
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="INACTIVE">INACTIVE</option>
                            </select>
                        </div>

                        <Input
                            placeholder="Quantity"
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="mb-2"
                        />

                        <Input
                            placeholder="Point Cost"
                            type="number"
                            value={pointCost}
                            onChange={(e) => setPointCost(e.target.value)}
                            className="mb-2"
                        />
                    </div>
                    <DrawerFooter>
                        <Button onClick={handleSubmit} className="bg-blue-500 text-white">
                            Submit
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
            <ToastContainer containerId="B" position="top-right" autoClose={3000} />
        </>
    );
}
