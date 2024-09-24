'use client';

import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import Image from "next/image";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit, FaEye, FaStar } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import API, { authApi, endpoints } from "@/app/configs/API";
import { checkPermission } from '@/utils/permissionUtils';
import { calculateTotalPages } from "@/lib/paginationUtils";

import Breadcrumbs from "@/components/Breadcrumbs";
import HeaderAdmin from "@/components/header-admin";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/CustomPagination";
import DishesDrawer from './DishesDrawer';
import DetailDishesDrawer from "./DetailDishesDrawer";
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';

const Dishes = () => {
    const permissions = useSelector(state => state.auth.permissions);
    const token = useSelector((state) => state.auth.token);

    const canView = checkPermission(permissions, 'Dishes', 'GET');
    const canCreate = checkPermission(permissions, 'Dishes', 'POST');
    const canUpdate = checkPermission(permissions, 'Dishes', 'PATCH');
    const canDelete = checkPermission(permissions, 'Dishes', 'DELETE');

    const [dishes, setDishes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isDrawerDetailOpen, setIsDrawerDetailOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const fetchDishes = useCallback(async () => {
        try {
            const response = await API.get(endpoints.getAllDishes, {
                params: { page: currentPage }
            });
            setDishes(response.data.data.data);
            const total = response.data.data.total;
            const itemsPerPage = response.data.data.itemsPerPage;
            setTotalPages(calculateTotalPages(total, itemsPerPage));
        } catch (error) {
            console.error("Failed to fetch dishes:", error);
            toast.error('Failed to fetch dishes', { containerId: 'A' });
        }
    }, [currentPage]);

    useEffect(() => {
        fetchDishes();
    }, [fetchDishes]);

    const handleOpenDrawer = () => setIsDrawerOpen(true);
    const handleCloseDrawer = () => setIsDrawerOpen(false);
    const handleOpenDetail = (id) => {
        setSelectedId(id);
        setIsDrawerDetailOpen(true);
    };
    const handleCloseDetail = () => setIsDrawerDetailOpen(false);
    const handleOpenDeleteDialog = (id) => {
        setSelectedId(id);
        setDeleteDialogOpen(true);
    };
    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setSelectedId(null);
    };

    const handleDeleteConfirmed = async () => {
        try {
            await authApi(token).delete(endpoints.getDisheById(selectedId));
            toast.success("Dish deleted successfully!", { containerId: 'A' });
            fetchDishes();
        } catch (error) {
            toast.error(error.response?.data?.message || 'An unexpected error occurred.', { containerId: 'A' });
            console.error("Failed to delete:", error);
        } finally {
            handleCloseDeleteDialog();
        }
    };

    if (!canView) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-white rounded-xl shadow-lg p-8">
                <Image src="/images/permission-deny.avif" alt="Permission Denied" width={200} height={200} className="mb-6" />
                <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
                <p className="text-gray-600 text-lg text-center">You do not have permission to view the dish management page.</p>
            </div>
        );
    }

    return (
        <div className="flex">
            <Navbar />
            <div className="flex-1 flex flex-col">
                <HeaderAdmin />
                <main className="ml-64 flex-1 p-6 bg-gray-100">
                    <Breadcrumbs labels={["Home", "Management Dishes"]} links={["/admin/dashboard", "/admin/dishes"]} />
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-4xl font-extrabold text-gray-900">Management Dishes</h1>
                        {canCreate && (
                            <Button
                                onClick={handleOpenDrawer}
                                className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1"
                            >
                                + Add New Dish
                            </Button>
                        )}
                    </div>
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-200 bg-gradient-to-r from-yellow-500 to-orange-600 text-white">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-semibold uppercase">Image</th>
                                    <th className="px-6 py-4 text-sm font-semibold uppercase">Dish Name</th>
                                    <th className="px-6 py-4 text-sm font-semibold uppercase">Price</th>
                                    <th className="px-6 py-4 text-sm font-semibold uppercase">Status</th>
                                    <th className="px-6 py-4 text-sm font-semibold uppercase">Best Seller</th>
                                    <th className="px-6 py-4 text-sm font-semibold uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {dishes.map((dish) => (
                                    <tr key={dish.id} className="hover:bg-gray-50 transition duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {dish.images && dish.images.length > 0 ? (
                                                <Image
                                                    src={dish.images[0].url}
                                                    alt={dish.name}
                                                    width={50}
                                                    height={50}
                                                    className="rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                                    <span className="text-gray-500 text-xs">No image</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{dish.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">${dish.price.toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${dish.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {dish.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {dish.isBestSeller ? (
                                                <FaStar className="text-yellow-400 text-xl" />
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button onClick={() => handleOpenDetail(dish.id)} className="text-blue-400 hover:text-blue-800 transition duration-150">
                                                    <FaEye className="text-lg" />
                                                </button>
                                                {canUpdate && (
                                                    <button onClick={() => handleOpenDetail(dish.id)} className="text-yellow-400 hover:text-yellow-800 transition duration-150">
                                                        <FaEdit className="text-lg" />
                                                    </button>
                                                )}
                                                {canDelete && (
                                                    <button onClick={() => handleOpenDeleteDialog(dish.id)} className="text-red-600 hover:text-red-800 transition duration-150">
                                                        <MdDelete className="text-lg" />
                                                    </button>
                                                )}
                                            </div>
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
                </main>
            </div>
            <DishesDrawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} onCreated={fetchDishes} />
            <DetailDishesDrawer isOpen={isDrawerDetailOpen} onClose={handleCloseDetail} dishId={selectedId} onUpdate={fetchDishes} />
            <DeleteConfirmationDialog
                isOpen={deleteDialogOpen}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleDeleteConfirmed}
                title="Confirm Delete"
                description="Are you sure you want to delete this dish? This action cannot be undone."
            />
            <ToastContainer containerId="A" position="top-right" autoClose={3000} />
        </div>
    );
};

const ActionButton = ({ icon: Icon, onClick, tooltip, className = "" }) => (
    <button
        onClick={onClick}
        className={`text-blue-600 hover:bg-blue-100 rounded px-4 py-2 transition duration-150 ${className}`}
        title={tooltip}
    >
        <Icon className={`text-lg ${className}`} />
    </button>
);

export default dynamic(() => Promise.resolve(Dishes), { ssr: false });