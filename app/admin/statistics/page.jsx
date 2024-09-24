'use client'
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/navbar";
import HeaderAdmin from "@/components/header-admin";
import { authApi, endpoints } from '@/app/configs/API';
import { useSelector } from 'react-redux';
import { CalendarIcon, FileSpreadsheet, FileText } from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

const RevenueStatisticsDashboard = () => {
    const [revenueData, setRevenueData] = useState([]);
    const [allMonthsData, setAllMonthsData] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalDiscount, setTotalDiscount] = useState(0);
    const [totalNetRevenue, setTotalNetRevenue] = useState(0);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        const fetchRevenueData = async () => {
            const year = selectedDate.getFullYear();
            const month = selectedDate.getMonth() + 1;
            try {
                const response = await authApi(token).post(endpoints.statisticRevenue, { year, month });
                if (response.data && response.data.data && response.data.data.data) {
                    const data = response.data.data.data;
                    setRevenueData(data);

                    const totals = data.reduce((acc, item) => ({
                        totalRevenue: acc.totalRevenue + item.totalRevenue,
                        totalDiscount: acc.totalDiscount + item.discountAmount,
                        totalNetRevenue: acc.totalNetRevenue + item.netRevenue,
                    }), { totalRevenue: 0, totalDiscount: 0, totalNetRevenue: 0 });

                    setTotalRevenue(totals.totalRevenue);
                    setTotalDiscount(totals.totalDiscount);
                    setTotalNetRevenue(totals.totalNetRevenue);
                }
            } catch (error) {
                console.error("Failed to fetch revenue data:", error);
            }
        };

        const fetchAllMonthsData = async () => {
            try {
                const response = await authApi(token).post(endpoints.statisticRevenue, { year: selectedDate.getFullYear() });
                if (response.data && response.data.data && response.data.data.data) {
                    setAllMonthsData(response.data.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch all months data:", error);
            }
        };

        fetchRevenueData();
        fetchAllMonthsData();
    }, [token, selectedDate]);
    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text(`Revenue Report - ${selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}`, 14, 15);

        const tableColumn = ["Date", "Total Revenue", "Discount", "Net Revenue"];
        const tableRows = revenueData.map(item => [
            item.monthYear,
            formatCurrency(item.totalRevenue),
            formatCurrency(item.discountAmount),
            formatCurrency(item.netRevenue)
        ]);

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20
        });

        doc.save(`revenue_report_${selectedDate.getFullYear()}_${selectedDate.getMonth() + 1}.pdf`);
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(revenueData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Revenue Data");
        XLSX.writeFile(workbook, `revenue_report_${selectedDate.getFullYear()}_${selectedDate.getMonth() + 1}.xlsx`);
    };

    return (
        <div className="flex">
            <Navbar />
            <div className="flex-1 flex flex-col">
                <HeaderAdmin />
                <main className="ml-64 flex-1 p-6 bg-gray-100">
                    <div className="container mx-auto px-4 py-8">
                        <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
                            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                                <h1 className="text-3xl font-bold text-gray-800">Revenue Statistics</h1>

                                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                                    <div className="relative">
                                        <DatePicker
                                            selected={selectedDate}
                                            onChange={date => setSelectedDate(date)}
                                            dateFormat="MMMM yyyy"
                                            showMonthYearPicker
                                            className="border border-gray-300 p-2 pl-10 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 w-full sm:w-auto"
                                        />
                                        <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    </div>

                                    <div className="flex space-x-2">
                                        <button
                                            onClick={exportToPDF}
                                            className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-300 shadow-md hover:shadow-lg"
                                        >
                                            <FileText className="mr-2" size={20} />
                                            <span className="hidden sm:inline">Export PDF</span>
                                        </button>
                                        <button
                                            onClick={exportToExcel}
                                            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-300 shadow-md hover:shadow-lg"
                                        >
                                            <FileSpreadsheet className="mr-2" size={20} />
                                            <span className="hidden sm:inline">Export Excel</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <Card className="bg-white shadow-sm rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md">
                                <CardHeader className="bg-blue-100 p-4">
                                    <CardTitle className="text-lg font-medium text-blue-800">Total Revenue</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <div className="text-2xl font-bold text-gray-700">{formatCurrency(totalRevenue)}</div>
                                </CardContent>
                            </Card>
                            <Card className="bg-white shadow-sm rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md">
                                <CardHeader className="bg-red-100 p-4">
                                    <CardTitle className="text-lg font-medium text-red-800">Total Discount</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <div className="text-2xl font-bold text-gray-700">{formatCurrency(totalDiscount)}</div>
                                </CardContent>
                            </Card>
                            <Card className="bg-white shadow-sm rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md">
                                <CardHeader className="bg-green-100 p-4">
                                    <CardTitle className="text-lg font-medium text-green-800">Net Revenue</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <div className="text-2xl font-bold text-gray-700">{formatCurrency(totalNetRevenue)}</div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <Card className="bg-white shadow-sm rounded-lg overflow-hidden">
                                <CardHeader className="bg-gray-100 p-4 border-b border-gray-200">
                                    <CardTitle className="text-xl font-semibold text-gray-700">Monthly Revenue Chart</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <ResponsiveContainer width="100%" height={400}>
                                        <BarChart data={revenueData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                            <XAxis dataKey="monthYear" stroke="#718096" />
                                            <YAxis stroke="#718096" />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '4px' }}
                                                formatter={(value) => formatCurrency(value)}
                                            />
                                            <Legend />
                                            <Bar dataKey="totalRevenue" name="Total Revenue" fill="#63b3ed" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="netRevenue" name="Net Revenue" fill="#9ae6b4" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card className="bg-white shadow-sm rounded-lg overflow-hidden">
                                <CardHeader className="bg-gray-100 p-4 border-b border-gray-200">
                                    <CardTitle className="text-xl font-semibold text-gray-700">All Months Revenue Trend</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <ResponsiveContainer width="100%" height={400}>
                                        <LineChart data={allMonthsData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                            <XAxis dataKey="monthYear" stroke="#718096" />
                                            <YAxis stroke="#718096" />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '4px' }}
                                                formatter={(value) => formatCurrency(value)}
                                            />
                                            <Legend />
                                            <Line type="monotone" dataKey="totalRevenue" name="Total Revenue" stroke="#63b3ed" strokeWidth={2} dot={{ r: 4 }} />
                                            <Line type="monotone" dataKey="netRevenue" name="Net Revenue" stroke="#9ae6b4" strokeWidth={2} dot={{ r: 4 }} />
                                        </LineChart>
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