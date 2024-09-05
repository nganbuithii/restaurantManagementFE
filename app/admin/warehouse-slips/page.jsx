'use client'
import { useCallback, useEffect, useState } from "react";
import API, { authApi, endpoints } from "@/app/configs/API";
import Breadcrumbs from "@/components/Breadcrumbs";
import HeaderAdmin from "@/components/header-admin";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { calculateTotalPages } from "@/lib/paginationUtils";
import { useSelector } from "react-redux";
import Pagination from "@/components/CustomPagination";
import { FaEdit, FaEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import StoreHouseDrawer from "@/components/StoreHouseDrawer";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Chart, ArcElement, registerables } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";
Chart.register(ArcElement, ...registerables);
function WarehouseSlips() {
    const labels = ["Home", "Management Warehouse Slips"];
    const links = ["/admin/dashboard", "/admin/warehouse-slips"];
    const [slips, setSlips] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const token = useSelector((state) => state.auth.token);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [IdToDelete, setIdToDelete] = useState(null);
    const [statistics, setStatistics] = useState(null);
    

    const handleOpenDrawer = () => {
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
    };

    const handleCreated = () => {
        fetchDishes();
    };

    const fetchSlips  = useCallback(async () => {
        try {
            const response = await authApi(token).get(endpoints.getAllSlips, {
                params: {
                    page: currentPage,
                }
            });
            console.log("GET slips SUCCESS");
            setSlips(response.data.data.data);

            const total = response.data.data.total;
            const itemsPerPage = response.data.data.itemsPerPage;
            const calculatedTotalPages = calculateTotalPages(total, itemsPerPage);

            setTotalPages(calculatedTotalPages);
        } catch (error) {
            console.error("Failed to fetch slips:", error);
        }
    }, [currentPage]);

    useEffect(() => {
        fetchSlips();
    }, [currentPage, token, fetchSlips]);

    const handleOpenDeleteDialog = (id) => {
        setIdToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setIdToDelete(null);
    };

    const handleDeleteConfirmed = async () => {
        const apiEndpoint = endpoints.getSlipById(IdToDelete);
        console.log("Deleting  with endpoint:", apiEndpoint);
        try {
            await authApi(token).delete(apiEndpoint);
            toast.success("Slip deleted successfully!", { containerId: 'A' });
            fetchSlips();
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error('ERROR');
            } else {
                toast.error('An unexpected error occurred.', { containerId: 'A' });
            }
            console.error("Failed to delete:", error);
        } finally {
            handleCloseDeleteDialog();
        }
    };
    const fetchStatistics = async () => {
        try {
            const response = await authApi(token).post(endpoints.statisticInventory);
            setStatistics(response.data.data);
        } catch (error) {
            console.error("Failed to fetch statistics:", error);
        }
    };
    const handleStatisticsClick = () => {
        fetchStatistics(); // Gọi hàm để lấy dữ liệu thống kê khi nhấn nút
    };
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
                        'rgba(255, 99, 132, 0.7)',  // Red
                        'rgba(54, 162, 235, 0.7)',  // Blue
                        'rgba(75, 192, 192, 0.7)',  // Green
                        'rgba(255, 205, 86, 0.7)'   // Yellow
                    ],
                    borderColor: [
                        '#ff6384', '#36a2eb', '#4bc0c0', '#ffcd56'
                    ],
                    borderWidth: 2,
                    hoverOffset: 4, // Hiệu ứng khi hover
                }],
            },
        };
    };
    
    const { warehouseData, ingredientData } = getStatisticsData() || {};
    return (
        <div className="flex">
            <Navbar />
            <div className="flex-1 flex flex-col">
                <HeaderAdmin />
                <main className="ml-64 flex-1 p-6 bg-gray-100">
                    <Breadcrumbs labels={labels} links={links} />
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-4xl font-extrabold text-gray-900">
                            Management Warehouse Slips
                        </h1>
                        <Button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md" onClick={handleOpenDrawer}>
                            Add New Slip
                        </Button>
                        <Button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md" onClick={handleStatisticsClick}>
                            Thống kê
                        </Button>
                    </div>
                    <StoreHouseDrawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} onCreated={handleCreated} />


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

                    <div className="bg-white rounded-lg shadow-lg overflow-hidden mt-4">
                        <table className="w-full text-left border-separate border-spacing-0">
                            <thead className="bg-gray-200 text-gray-700">
                                <tr>
                                    <th className="p-4 border-b border-gray-300">ID</th>
                                    <th className="p-4 border-b border-gray-300">Type</th>
                                    <th className="p-4 border-b border-gray-300">Status</th>
                                    <th className="p-4 border-b border-gray-300">Created At</th>
                                    <th className="p-4 border-b border-gray-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {slips.map((slip) => (
                                    <tr key={slip.id} className="hover:bg-gray-50 transition duration-150">
                                        <td className="p-4 border-b border-gray-300">{slip.id}</td>
                                        <td className="p-4 border-b border-gray-300">{slip.type}</td>
                                        <td className="p-4 border-b border-gray-300">
                                            <div className={`p-2 rounded-lg text-white `}>
                                                <p className={`${slip.isActive ? 'text-green-500' : 'text-red-500'}`}>{slip.isActive ? 'Active' : 'Inactive'}</p>
                                            </div>
                                        </td>
                                        <td className="p-4 border-b border-gray-300">{new Date(slip.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4 border-b border-gray-300 flex space-x-3">
                                            <button className="text-blue-600 hover:bg-blue-100 rounded px-4 py-2 transition duration-150">
                                                <FaEye className="text-blue-400 text-lg" />
                                            </button>
                                            <button className="text-blue-600 hover:bg-blue-100 rounded px-4 py-2 transition duration-150">
                                                <FaEdit />
                                            </button>
                                            <button
                                                className="text-blue-600 hover:bg-blue-100 rounded px-4 py-2 transition duration-150"
                                                onClick={() => handleOpenDeleteDialog(slip.id)}
                                            >
                                                <MdDelete className="text-orange-500 text-lg" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                    <DeleteConfirmationDialog
                        isOpen={deleteDialogOpen}
                        onClose={handleCloseDeleteDialog}
                        onConfirm={handleDeleteConfirmed}
                        title="Confirm Delete"
                        description="Are you sure you want to delete this dish? This action cannot be undone."
                    />
                </main>
            </div>
            <ToastContainer containerId="A" position="top-right" autoClose={3000} />
        </div>
    );
}
export default dynamic(() => Promise.resolve(WarehouseSlips), { ssr: false })
