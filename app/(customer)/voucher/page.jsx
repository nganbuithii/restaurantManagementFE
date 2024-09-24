'use client'
import React, { useCallback, useEffect, useState } from 'react';
import { FaTag, FaClock, FaPercent, FaGift, FaInfoCircle, FaChevronDown } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import API, { endpoints } from '@/app/configs/API';
import Footer from '@/components/footer';
import Header from '@/components/header';
import dynamic from 'next/dynamic';

const VoucherList = () => {
    const [allVouchers, setAllVouchers] = useState([]);
    const [displayedVouchers, setDisplayedVouchers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const token = useSelector((state) => state.auth.token);

    const fetchVouchers = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await API.get(endpoints.getAllVouchers);
            setAllVouchers(response.data.data.data);
            setDisplayedVouchers(response.data.data.data.slice(0, 4));
        } catch (error) {
            console.error("Unable to fetch voucher list:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchVouchers();
    }, [fetchVouchers]);

    const handleLoadMore = () => {
        const currentLength = displayedVouchers.length;
        const nextVouchers = allVouchers.slice(currentLength, currentLength + 4);
        setDisplayedVouchers([...displayedVouchers, ...nextVouchers]);
    };

    const handleApplyVoucher = (voucherId) => {
        console.log(`Applying voucher with ID: ${voucherId}`);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'ACTIVE': return 'bg-green-500';
            case 'INACTIVE': return 'bg-yellow-500';
            case 'EXPIRED': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    const calculateTimeLeft = (endDate) => {
        const difference = new Date(endDate) - new Date();
        if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((difference / 1000 / 60) % 60);
            return `${days}d ${hours}h ${minutes}m`;
        }
        return 'Expired';
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 to-red-50">
            <Header />
            <div className="container mx-auto px-4 py-12 mt-24">
                <h1 className="text-4xl font-bold mb-8 text-orange-600 text-center">Massive Discount Codes</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {displayedVouchers.map((voucher) => (
                        <div key={voucher.id} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-orange-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                            <div className="p-6 bg-gradient-to-r from-orange-400 to-red-500 text-white relative">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-2xl font-extrabold">{voucher.code}</span>
                                </div>
                                <div className="flex items-center text-sm font-medium">
                                    <FaGift className="mr-2 text-xl" />
                                    <span>{voucher.description}</span>
                                </div>
                                <div className="absolute -bottom-8 -right-8 bg-white text-orange-500 rounded-full w-28 h-28 flex items-center justify-center text-3xl font-black border-8 border-orange-500 shadow-lg transform rotate-12">
                                    {voucher.percent}%
                                </div>
                            </div>
                            <div className="p-6 pt-12">
                                <div className="text-sm text-gray-600 mb-3 flex items-center">
                                    <FaTag className="mr-3 text-orange-500 text-lg" />
                                    <span>Remaining: <strong className="text-orange-600">{voucher.quantity - voucher.usedCount}</strong>/{voucher.quantity}</span>
                                </div>
                                <div className="text-sm text-gray-600 mb-3 flex items-center">
                                    <FaClock className="mr-3 text-orange-500 text-lg" />
                                    <span>Time left: <strong className="text-orange-600">{calculateTimeLeft(voucher.endDate)}</strong></span>
                                </div>
                                <div className="text-sm text-gray-600 mb-4 flex items-center">
                                    <FaPercent className="mr-3 text-orange-500 text-lg" />
                                    <span>Required Points: <strong className="text-orange-600">{voucher.pointCost}</strong></span>
                                </div>
                                <Button
                                    onClick={() => handleApplyVoucher(voucher.id)}
                                    disabled={voucher.status !== 'ACTIVE'}
                                    className={`w-full ${voucher.status === 'ACTIVE' ? 'bg-orange-500 hover:bg-orange-600 active:bg-orange-700' : 'bg-gray-300'} text-white transition duration-300 py-3 text-lg font-bold rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-1`}
                                >
                                    {voucher.status === 'ACTIVE' ? 'Apply Now' : 'Unavailable'}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
                {displayedVouchers.length < allVouchers.length && (
                    <div className="mt-12 text-center">
                        <Button
                            onClick={handleLoadMore}
                            disabled={isLoading}
                            className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white px-8 py-4 rounded-full font-bold text-xl shadow-lg transition duration-300 flex items-center justify-center transform hover:-translate-y-1"
                        >
                            {isLoading ? (
                                <span className="animate-spin mr-3">⏳</span>
                            ) : (
                                <FaChevronDown className="mr-3" />
                            )}
                            {isLoading ? 'Loading...' : 'Load More Vouchers'}
                        </Button>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default dynamic(() => Promise.resolve(VoucherList), { ssr: false });
