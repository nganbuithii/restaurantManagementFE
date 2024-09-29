import React, { useState, useEffect } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Tag, Calendar, CheckCircle } from 'lucide-react';

import Loading from '@/components/Loading';
import API, { authApi, endpoints } from '@/app/configs/API';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedVoucher } from '@/app/store/bookingSlice';

const VoucherDrawer = ({ isOpen, onClose, onApply }) => {
    const dispatch = useDispatch();
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = useSelector((state) => state.auth.token);
    const selectedVoucher = useSelector((state) => state.booking.selectedVoucher);

    useEffect(() => {
        const fetchVouchers = async () => {
            try {
                setLoading(true);
                const response = await authApi(token).post(endpoints.getSavedVoucher);
                setVouchers(response.data.data);
            } catch (err) {
                setError('Failed to fetch vouchers. Please try again.');
                console.error('Error fetching vouchers:', err);
            } finally {
                setLoading(false);
            }
        };

        if (isOpen) {
            fetchVouchers();
        }
    }, [isOpen, token]);

    const handleSelectVoucher = (voucher) => {
        dispatch(setSelectedVoucher(voucher));
        console.log('Selected voucher from Redux:', selectedVoucher);

    };

    const handleApplyVoucher = () => {
        if (selectedVoucher) {
            onApply(selectedVoucher);
            onClose();
        }
    };

    return (
        <Drawer open={isOpen} onClose={onClose}>
            <DrawerContent className="bg-gray-50">
                <DrawerHeader className="border-b border-gray-200 bg-white">
                    <DrawerTitle className="text-2xl font-bold text-gray-800">Select a Voucher</DrawerTitle>
                    <DrawerClose onClick={onClose} className="absolute right-4 top-4">
                        <Button size="icon" variant="ghost" className="hover:bg-gray-100">
                            <X className="h-6 w-6 text-gray-500" />
                        </Button>
                    </DrawerClose>
                </DrawerHeader>
                <div className="p-6 overflow-y-auto max-h-[70vh]">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loading />
                        </div>
                    ) : error ? (
                        <p className="text-red-500 text-center">{error}</p>
                    ) : (
                        vouchers.map((voucher) => (
                            <Card
                                key={voucher.id}
                                className={`mb-4 cursor-pointer transition-all duration-300 hover:shadow-md ${
                                    selectedVoucher?.id === voucher.id 
                                        ? 'border-2 border-orange-500 bg-orange-50' 
                                        : 'border border-gray-200 hover:border-orange-300'
                                }`}
                                onClick={() => handleSelectVoucher(voucher)}
                            >
                                <CardContent className="p-4 flex items-start">
                                    <div className="flex-grow">
                                        <h3 className="font-bold text-lg text-gray-800 mb-2 flex items-center">
                                            <Tag className="h-5 w-5 mr-2 text-orange-500" />
                                            {voucher.code}
                                        </h3>
                                        <p className="text-gray-600 mb-2">{voucher.description}</p>
                                        <p className="text-sm text-gray-500 flex items-center">
                                            <Calendar className="h-4 w-4 mr-1" />
                                            Valid until: {new Date(voucher.endDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    {selectedVoucher?.id === voucher.id && (
                                        <CheckCircle className="h-6 w-6 text-orange-500 ml-2" />
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
                <div className="p-6 border-t border-gray-200 bg-white">
                    <Button
                        onClick={handleApplyVoucher}
                        disabled={!selectedVoucher}
                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Apply Selected Voucher
                    </Button>
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default VoucherDrawer;