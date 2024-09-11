'use client';
import { useCallback, useEffect, useState } from "react";
import API, { authApi, endpoints } from "@/app/configs/API";
import Breadcrumbs from "@/components/Breadcrumbs";
import HeaderAdmin from "@/components/header-admin";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { calculateTotalPages } from "@/lib/paginationUtils";
import Image from "next/image";
import Pagination from "@/components/CustomPagination";
import { FaEdit, FaEye, FaLock, FaUnlock } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import DishesDrawer from './DishesDrawer';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import DetailDishesDrawer from "./DetailDishesDrawer"

function Dishes() {
    const labels = ["Home", "Management Dishes"];
    const links = ["/admin/dashboard", "/admin/dishes"];
    const [dishes, setDishes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const token = useSelector((state) => state.auth.token);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [IdToDelete, setIdToDelete] = useState(null);

    const [isDrawerDetailOpen, setIsDrawerDetailOpen] = useState(false);
    const [selectedId, setSelectedId] = useState();

    const handleOpenDrawer = () => {
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
    };

    const handleCreated = () => {
        fetchDishes();
    };
    const handleOpenDetail = (id) => {
        console.log("VÀO ĐÂY")
        console.log("id", id)
        setSelectedId(id);
        setIsDrawerDetailOpen(true)
        console.log("detail", isDrawerDetailOpen   )
    };
    const handleCloseDetail = () => {
        setIsDrawerDetailOpen(false);
    };
    const fetchDishes = useCallback(async () => {
        console.log("fetch dishes");
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
        }
    }, [currentPage]);

    useEffect(() => {
        console.log("Calll");
        console.log("Current Page:", currentPage);
        fetchDishes();
    }, [token, currentPage, fetchDishes]);

    const handleOpenDeleteDialog = (id) => {
        setIdToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setIdToDelete(null);
    };

    const handleDeleteConfirmed = async () => {
        const apiEndpoint = endpoints.getDisheById(IdToDelete);
        console.log("Deleting  with endpoint:", apiEndpoint);
        try {
            await authApi(token).delete(apiEndpoint);
            toast.success("Dish deleted successfully!", { containerId: 'A' });
            fetchDishes();
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

    return (
        <div className="flex">
            <Navbar />
            <div className="flex-1 flex flex-col">
                <HeaderAdmin />
                <main suppressHydrationWarning className="ml-64 flex-1 p-6 bg-gray-100">
                    <Breadcrumbs labels={labels} links={links} />
                    <div className="flex flex-row justify-between items-center mb-6">
                        <h1 className="text-4xl font-extrabold text-gray-900">
                            Management Dishes
                        </h1>
                        <Button className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1" onClick={handleOpenDrawer}>
                        Add New Dishes
                    </Button>

                    </div>
                    <DishesDrawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} onCreated={handleCreated} />
                    <DetailDishesDrawer
                        isOpen={isDrawerDetailOpen}
                        onClose={handleCloseDetail}
                        dishId={selectedId}
                        onUpdate={fetchDishes}
                    />
                    

                    <div className="bg-white rounded-lg shadow-lg overflow-hidden mt-6">
                        <table className="w-full text-left">
                            <thead className="bg-gray-200 text-gray-700">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider">Dish Name</th>
                                    <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider">Status</th>
                                    {/* <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider">Image</th> */}
                                    <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {dishes.map((dish) => (
                                    <tr key={dish.id} className="hover:bg-gray-50 transition duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap">{dish.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">${dish.price.toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${dish.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {dish.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        {/* <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex -space-x-2 overflow-hidden">
                                                {dish.images.map((image, index) => (
                                                    <Image
                                                        key={image.id}
                                                        src={image.url}
                                                        alt={`Dish Image ${index + 1}`}
                                                        width={48}
                                                        height={48}
                                                        className="inline-block h-12 w-12 rounded-full ring-2 ring-white object-cover"
                                                    />
                                                ))}
                                            </div>
                                        </td> */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleOpenDetail(dish.id)}
                                                className="text-blue-600 hover:bg-blue-100 rounded px-4 py-2 transition duration-150"
                                            >
                                                <FaEye className="text-blue-400 text-lg" />
                                            </button>
                                            <button
                                                // onClick={() => handleOpenDetail(dish.id)}
                                                className="text-blue-600 hover:bg-blue-100 rounded px-4 py-2 transition duration-150"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleOpenDeleteDialog(dish.id)}
                                                className="text-blue-600 hover:bg-blue-100 rounded px-4 py-2 transition duration-150"
                                            >
                                                <MdDelete className="text-orange-500 text-lg" />
                                            </button>
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

export default dynamic(() => Promise.resolve(Dishes), { ssr: false })