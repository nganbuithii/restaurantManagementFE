'use client'
import { useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import HeaderAdmin from "@/components/header-admin";
import Navbar from "@/components/navbar";
import { FaRegMoneyBillAlt, FaSearch, FaUnlock, FaUsers } from "react-icons/fa";
import { TbPigMoney } from "react-icons/tb";
import { ChartContainer } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { type ChartConfig } from "@/components/ui/chart";

// Sample data for the chart
const chartData = [
    { name: "Tuần 1", desktop: 4000, mobile: 2400 },
    { name: "Tuần 2", desktop: 3000, mobile: 1398 },
    { name: "Tuần 3", desktop: 2000, mobile: 9800 },
    { name: "Tuần 4", desktop: 2780, mobile: 3908 },
    { name: "Tuần 5", desktop: 1890, mobile: 4800 },
    { name: "Tuần 6", desktop: 2390, mobile: 3800 },
    { name: "Tuần 7", desktop: 3490, mobile: 4300 },
];

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "#2563eb",
    },
    mobile: {
        label: "Mobile",
        color: "#60a5fa",
    },
} satisfies ChartConfig;

export default function Statistic() {
    const labels = ["Trang chủ", "Thống kê & Báo cáo"];
    const links = ["/admin/dashboard", "/admin/statistic"];

    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="flex">
            <Navbar />
            <div className="flex-1 flex flex-col">
                <HeaderAdmin />
                <main className="ml-64 flex-1 p-6 bg-gray-100">
                    <Breadcrumbs labels={labels} links={links} />
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-4xl font-extrabold text-gray-900">Thống kê số liệu</h1>
                    </div>
                    <section className="flex space-x-4 p-6">
                        <div className="bg-pink-600 text-white rounded-lg p-4 flex-1 flex flex-col space-y-4 shadow-md">
                            <p className="text-lg font-bold">Người dùng</p>
                            <div className="flex flex-row items-center space-x-4">
                                <div className="flex flex-col text-center">
                                    <p className="text-2xl font-semibold">8</p>
                                    <p className="text-sm">Tháng 8 - 2024</p>
                                </div>
                                <div className="text-3xl">
                                    <FaUsers />
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-400 text-white rounded-lg p-4 flex-1 flex flex-col space-y-4 shadow-md">
                            <p className="text-lg font-bold">Hóa đơn</p>
                            <div className="flex flex-row items-center space-x-4">
                                <div className="flex flex-col text-center">
                                    <p className="text-2xl font-semibold">50</p>
                                    <p className="text-sm">Tháng 8 - 2024</p>
                                </div>
                                <div className="text-3xl">
                                    <TbPigMoney />
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-600 text-white rounded-lg p-4 flex-1 flex flex-col space-y-4 shadow-md">
                            <p className="text-lg font-bold">Doanh thu</p>
                            <div className="flex flex-row items-center space-x-4">
                                <div className="flex flex-col text-center">
                                    <p className="text-2xl font-semibold">50.000.000 VND</p>
                                    <p className="text-sm">Tháng 8 - 2024</p>
                                </div>
                                <div className="text-3xl">
                                    <FaRegMoneyBillAlt />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Biểu đồ */}
                    <ChartContainer config={chartConfig} className="min-h-[200px] w-full p-4 bg-white rounded-lg shadow-md">
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="desktop" fill={chartConfig.desktop.color} radius={4} />
                            <Bar dataKey="mobile" fill={chartConfig.mobile.color} radius={4} />
                        </BarChart>
                    </ChartContainer>

                </main>
            </div>
        </div>
    );
}
