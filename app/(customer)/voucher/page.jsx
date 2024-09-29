'use client'
import React, { useCallback, useEffect, useState } from 'react';
import { FaTag, FaClock, FaPercent, FaGift } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import API, { authApi, endpoints } from '@/app/configs/API';
import Footer from '@/components/footer';
import Header from '@/components/header';
import dynamic from 'next/dynamic';
import { saveVoucherForCustomer } from '@/app/store/voucherSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VoucherList = () => {
    const [vouchers, setVouchers] = useState([]);
    const [savedVouchers, setSavedVouchers] = useState([]); // Lưu danh sách voucher đã được lưu
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(4);
    const token = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();

    const fetchSavedVouchers = useCallback(async () => {
        try {
            const response = await authApi(token).post(endpoints.getSavedVoucher); 
            return response.data.data.map(voucher => voucher.id);
        } catch (error) {
            console.error("Unable to fetch saved vouchers:", error);
            return [];
        }
    }, [token]);

    const fetchVouchers = useCallback(async (page) => {
        setIsLoading(true);
        try {
            const response = await API.get(endpoints.getAllVouchers, {
                params: { page, limit: itemsPerPage }
            });
            const { data, total, itemsPerPage: responseItemsPerPage } = response.data.data;
            if (page === 1) {
                setVouchers(data);
            } else {
                setVouchers(prevVouchers => [...prevVouchers, ...data]);
            }
            setItemsPerPage(responseItemsPerPage);
            setTotalPages(Math.ceil(total / responseItemsPerPage));
        } catch (error) {
            console.error("Unable to fetch voucher list:", error);
        } finally {
            setIsLoading(false);
        }
    }, [itemsPerPage]);

    useEffect(() => {
        const fetchInitialData = async () => {
            const savedVoucherIds = await fetchSavedVouchers(); 
            setSavedVouchers(savedVoucherIds);
            fetchVouchers(1); 
        };
        fetchInitialData();
    }, [fetchVouchers, fetchSavedVouchers]);

    const handleLoadMore = () => {
        const nextPage = currentPage + 1;
        if (nextPage <= totalPages) {
            setCurrentPage(nextPage);
            fetchVouchers(nextPage);
        }
    };

    const hasMore = currentPage < totalPages;

    const isVoucherSaved = (voucherId) => {
        return savedVouchers.includes(voucherId);
    };

    const handleApplyVoucher = (voucherId) => {
        dispatch(saveVoucherForCustomer(voucherId)).unwrap().then(() => {
            toast.success("Voucher saved successfully!", { containerId: 'A' });
            setSavedVouchers([...savedVouchers, voucherId]);
        }).catch((error) => {
            toast.error("Failed to save voucher", { containerId: 'A' });
        });
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
                    {vouchers.map((voucher) => (
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
                                    disabled={voucher.status !== 'ACTIVE' || isVoucherSaved(voucher.id)}
                                    className={`w-full ${voucher.status === 'ACTIVE' && !isVoucherSaved(voucher.id) ? 'bg-orange-500 hover:bg-orange-600 active:bg-orange-700' : 'bg-gray-300'} text-white transition duration-300 py-3 text-lg font-bold rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-1`}
                                >
                                    {isVoucherSaved(voucher.id) ? 'Saved' : 'Save'}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
                {hasMore && (
                    <div className="mt-12 text-center">
                        <Button
                            onClick={handleLoadMore}
                            disabled={isLoading}
                            className="bg-gradient-to-r from-yellow-500 to-orange-600 active:bg-orange-700 text-white px-8 py-4 rounded-full font-bold text-xl shadow-lg transition duration-300 flex items-center justify-center transform hover:-translate-y-1"
                        >
                            {isLoading ? 'Loading...' : 'See more'}
                        </Button>
                    </div>
                )}
            </div>
            <Footer />
            <ToastContainer containerId="A" position="top-right" autoClose={3000} />
        </div>
    );
};

export default dynamic(() => Promise.resolve(VoucherList), { ssr: false });
