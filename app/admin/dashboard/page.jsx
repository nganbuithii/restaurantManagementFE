'use client'
import HeaderAdmin from "@/components/header-admin";
import Navbar from "@/components/navbar";
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import withAuth from '@/hoc/withAuth';
import dynamic from "next/dynamic";
import { Chart, ArcElement, registerables } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { useEffect, useState } from "react";
import { authApi, endpoints } from "@/app/configs/API";
Chart.register(ArcElement, ...registerables);
function AdminDashboard() {
    const user = useSelector((state) => state.auth.user);
    const token = useSelector((state) => state.auth.token);

    const router = useRouter();
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    if (!user) {
        router.push('/admin/login');
        return null;
    }
    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const response = await authApi(token).post(endpoints.statisticInventory);
                setStatistics(response.data.data);
            } catch (error) {
                console.error("Failed to fetch statistics:", error);
                setError("Failed to load statistics. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchStatistics();
    }, [token]);

    // const handleStatisticsClick = () => {
    //     fetchStatistics(); 
    // };
    const getStatisticsData = () => {
        if (!statistics) return;

        const { warehouseStatistics, ingredientStatistics } = statistics;

        return {
            warehouseData: {
                labels: ['Total In', 'Total Out', 'Active', 'Inactive', 'Details'],
                datasets: [{
                    label: 'Warehouse Statistics',
                    data: [
                        warehouseStatistics?.totalIn || 0,
                        warehouseStatistics?.totalOut || 0,
                        warehouseStatistics?.totalActive || 0,
                        warehouseStatistics?.totalInactive || 0,
                        warehouseStatistics?.totalDetails || 0,
                    ],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.7)',  // Blue
                        'rgba(255, 99, 132, 0.7)',  // Red
                        'rgba(75, 192, 192, 0.7)',  // Green
                        'rgba(255, 205, 86, 0.7)',  // Yellow
                        'rgba(153, 102, 255, 0.7)'  // Purple
                    ],
                    borderColor: [
                        '#36a2eb', '#ff6384', '#4bc0c0', '#ffcd56', '#9966ff'
                    ],
                    borderWidth: 2, // Độ dày viền
                    hoverOffset: 4, // Hiệu ứng hover
                }],
            },
            ingredientData: {
                labels: [
                    'Total Ingredients',
                    'Ingredients in Inventory',
                    'Ingredients without Inventory',
                    'Total Inventory Quantity'
                ],
                datasets: [{
                    label: 'Ingredient Statistics',
                    data: [
                        ingredientStatistics?.totalIngredients || 0,
                        ingredientStatistics?.ingredientsInInventory || 0,
                        ingredientStatistics?.ingredientsWithoutInventory || 0,
                        ingredientStatistics?.totalInventoryQuantity || 0,
                    ],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(75, 192, 192, 0.7)',
                        'rgba(255, 205, 86, 0.7)'
                    ],
                    borderColor: [
                        '#ff6384', '#36a2eb', '#4bc0c0', '#ffcd56'
                    ],
                    borderWidth: 2,
                    hoverOffset: 4,
                }],
            },
        };
    };
    const { warehouseData, ingredientData } = getStatisticsData() || {};


    return (
        <>
        {/* if (loading) return <p>Loading statistics...</p>;
        if (error) return <p>{error}</p>; */}
            <Navbar />
            <HeaderAdmin />

            <div className="flex bg-gray-100 min-h-screen">
                <div className="flex-1 flex flex-col ml-64">
                    <main className="flex-1 p-6">
                        <h1>{user.username}</h1>
                        {/* Nội dung chính của dashboard */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Các card thống kê */}
                            {['Tổng đơn hàng', 'Doanh thu', 'Khách hàng mới'].map((title, index) => (
                                <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
                                    <p className="text-3xl font-bold text-orange-500">
                                        {index === 0 ? '1,234' : index === 1 ? '$12,345' : '56'}
                                    </p>
                                </div>
                            ))}
                        </div>
                        {/* Thêm các phần khác của dashboard ở đây */}
                        {statistics && (
                            <div className="mt-6">
                                <h2 className="text-2xl font-bold mb-4">Statistics</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white rounded-lg shadow-lg p-6">
                                        <h3 className="text-xl font-semibold mb-4">Warehouse Statistics</h3>
                                        <Pie data={warehouseData} />
                                    </div>
                                    <div className="bg-white rounded-lg shadow-lg p-6">
                                        <h3 className="text-xl font-semibold mb-4">Ingredient Statistics</h3>
                                        <Bar data={ingredientData} />
                                    </div>
                                </div>
                            </div>
                        )}

                    </main>
                </div>
            </div>
        </>
    );
}
export default dynamic(() => Promise.resolve(withAuth(AdminDashboard)), { ssr: false })

