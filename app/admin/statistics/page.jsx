'use client'
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/navbar";
import HeaderAdmin from "@/components/header-admin";
import dynamic from "next/dynamic";
import { authApi, endpoints } from '@/app/configs/API';
import { useSelector } from 'react-redux';

const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};

const RevenueStatisticsDashboard = () => {
    const [revenueData, setRevenueData] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalDiscount, setTotalDiscount] = useState(0);
    const [totalNetRevenue, setTotalNetRevenue] = useState(0);
    const token = useSelector((state) => state.auth.token);
    useEffect(() => {
        const fetchRevenueData = async () => {
            try {
                const response = await authApi(token).post(endpoints.statisticRevenue);
                if (response.data && response.data.data && response.data.data.data) {
                    const data = response.data.data.data;
                    setRevenueData(data);
                    
                    // Calculate totals
                    const totals = data.reduce((acc, item) => ({
                        totalRevenue: acc.totalRevenue + item.totalRevenue,
                        totalDiscount: acc.totalDiscount + item.discountAmount,
                        totalNetRevenue: acc.totalNetRevenue + item.netRevenue
                    }), { totalRevenue: 0, totalDiscount: 0, totalNetRevenue: 0 });

                    setTotalRevenue(totals.totalRevenue);
                    setTotalDiscount(totals.totalDiscount);
                    setTotalNetRevenue(totals.totalNetRevenue);
                }
            } catch (error) {
                console.error("Failed to fetch revenue data:", error);
            }
        };

        fetchRevenueData();
    }, []);

    return (
        <div className="flex h-screen bg-gray-100">
            <Navbar />
            <div className="flex-1 flex flex-col ">
                <HeaderAdmin />
                <main className="ml-64 flex-1 p-6 bg-gray-100">
                    <div className="container mx-auto px-6 py-8">
                        <h3 className="text-gray-700 text-3xl font-medium">Revenue Statistics</h3>
                        <div className="mt-4">
                            <div className="flex flex-wrap -mx-6">
                                <div className="w-full px-6 sm:w-1/2 xl:w-1/3">
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
                                        </CardContent>
                                    </Card>
                                </div>
                                <div className="w-full px-6 sm:w-1/2 xl:w-1/3 mt-4 sm:mt-0">
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">Total Discount</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">{formatCurrency(totalDiscount)}</div>
                                        </CardContent>
                                    </Card>
                                </div>
                                <div className="w-full px-6 sm:w-1/2 xl:w-1/3 mt-4 xl:mt-0">
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">Net Revenue</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">{formatCurrency(totalNetRevenue)}</div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Monthly Revenue Chart</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={400}>
                                        <BarChart data={revenueData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="monthYear" />
                                            <YAxis />
                                            <Tooltip formatter={(value) => formatCurrency(value)} />
                                            <Legend />
                                            <Bar dataKey="totalRevenue" name="Total Revenue" fill="#8884d8" />
                                            <Bar dataKey="netRevenue" name="Net Revenue" fill="#82ca9d" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default dynamic(() => Promise.resolve(RevenueStatisticsDashboard), { ssr: false });