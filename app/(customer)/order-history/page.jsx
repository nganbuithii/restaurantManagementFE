'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { authApi, endpoints } from '@/app/configs/API';
import { useSelector } from 'react-redux';
import Footer from '@/components/footer';
import Header from '@/components/header';
import Loading from '@/components/Loading';
import { motion } from 'framer-motion';
import { ShoppingBag, Calendar, DollarSign, ChevronRight } from 'lucide-react';
import OrderDrawer from './OrderDraw'; 
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = useSelector((state) => state.auth.token);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [filter, setFilter] = useState({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
    });

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await authApi(token).post(endpoints['order-history'], {
                    year: filter.year,
                    month: filter.month
                });
                setOrders(response.data.data.orders);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [token, filter.year, filter.month]);

    const handleMonthChange = (month) => {
        setFilter((prevFilter) => ({ ...prevFilter, month }));
    };

    const handleYearChange = (year) => {
        setFilter((prevFilter) => ({ ...prevFilter, year }));
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

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'COMPLETED':
                return 'bg-green-100 text-green-800 border-green-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const handleViewDetails = (orderId) => {
        setSelectedOrderId(orderId);
        setIsDrawerOpen(true);
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
            <Loading />
        </div>
    );

    if (error) return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
            <Card className="p-6 max-w-md shadow-lg">
                <CardTitle className="text-red-500 mb-4">Error</CardTitle>
                <CardContent>{error}</CardContent>
            </Card>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
            <Header bgColor="bg-orange-500" />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
                <h1 className="text-4xl font-bold mb-8 text-orange-800 text-center">Your Order History</h1>
                <div className="flex items-center space-x-4 mb-8">
                    <select
                        value={filter.month}
                        onChange={(e) => handleMonthChange(parseInt(e.target.value))}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-md"
                    >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => (
                            <option key={month} value={month}>
                                {format(new Date(2023, month - 1, 1), 'MMMM', { locale: enUS })}
                            </option>
                        ))}
                    </select>
                    <select
                        value={filter.year}
                        onChange={(e) => handleYearChange(parseInt(e.target.value))}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-md"
                    >
                        {[2023, 2024, 2025].map(year => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>
                {orders.length === 0 ? (
                    <Card className="p-6 shadow-md bg-white">
                        <CardContent className="text-center text-gray-600">
                            <ShoppingBag className="mx-auto mb-4 text-orange-400" size={48} />
                            <p className="text-lg">You haven't placed any orders yet.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {orders.map((order, index) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                                <Card className="overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white">
                                    <CardHeader className="bg-orange-50 border-b border-orange-100">
                                        <CardTitle className="flex justify-between items-center">
                                            <span className="text-lg font-semibold text-orange-800">Order #{order.id}</span>
                                            <Badge className={`${getStatusColor(order.status)} px-3 py-1 rounded-full text-xs font-medium border`}>
                                                {order.status}
                                            </Badge>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <div className="flex items-center mb-2 text-gray-600">
                                            <Calendar className="mr-2" size={16} />
                                            <p className="text-sm">
                                                <span className="font-medium">Ordered on:</span> {formatDate(order.createdAt)}
                                            </p>
                                        </div>
                                        <div className="flex items-center mb-2 text-orange-600">
                                            <p className="text-lg font-bold">
                                                ${order.totalPrice.toLocaleString()}
                                            </p>
                                        </div>
                                        {order.discountPrice > 0 && (
                                            <p className="text-sm text-green-600 ml-6">
                                                <span className="font-medium">Discount:</span> ${order.discountPrice.toLocaleString()}
                                            </p>
                                        )}
                                        <button
                                            onClick={() => handleViewDetails(order.id)}
                                            className="mt-4 inline-flex items-center text-blue-500 hover:text-blue-600 transition-colors duration-200"
                                        >
                                            View details
                                            <ChevronRight className="ml-1" size={16} />
                                        </button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
            <OrderDrawer 
                isOpen={isDrawerOpen} 
                onClose={() => setIsDrawerOpen(false)} 
                orderId={selectedOrderId} 
            />
            <Footer />
        </div>
    );
};

export default OrderHistory;