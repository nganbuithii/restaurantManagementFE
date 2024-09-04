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
import DishesDrawer from '@/components/DishesDrawer';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";

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

    const handleOpenDrawer = () => {
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
    };

    const handleCreated = () => {
        fetchDishes(); 
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
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-4xl font-extrabold text-gray-900">
                            Management Dishes
                        </h1>
                    </div>
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md" onClick={handleOpenDrawer}>
                        Add New Dishes
                    </Button>
                  
                    <DishesDrawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} onCreated={handleCreated} /> 
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden mt-4">
                        <table className="w-full text-left border-separate border-spacing-0">
                            <thead className="bg-gray-200 text-gray-700">
                                <tr>
                                    <th className="p-4 border-b border-gray-300">Dish Name</th>
                                    <th className="p-4 border-b border-gray-300">Price</th>
                                    <th className="p-4 border-b border-gray-300">Status</th>
                                    <th className="p-4 border-b border-gray-300">Image</th>
                                    <th className="p-4 border-b border-gray-300">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dishes.map((dish) => (
                                    <tr key={dish.id} className="hover:bg-gray-50 transition duration-150">
                                        <td className="p-4 border-b border-gray-300">{dish.name}</td>
                                        <td className="p-4 border-b border-gray-300">{dish.price}</td>
                                        <td className="p-4 border-b border-gray-300">
                                            <div className={`p-2 rounded-lg flex items-center space-x-2 ${dish.isActive ? 'text-green-600' : 'text-red-600'}`}>
                                                {dish.isActive ? <FaUnlock /> : <FaLock />}
                                                <span>{dish.isActive ? 'Active' : 'Inactive'}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 border-b border-gray-300">
                                            <div className="flex space-x-2">
                                                {dish.images.map(image => (
                                                    <Image
                                                        key={image.id}
                                                        src={image.url}
                                                        alt="Dish Image"
                                                        width={64}
                                                        height={64}
                                                        className="object-cover"
                                                    />
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-4 border-b border-gray-300 flex space-x-3">
                                            <button className="text-blue-600 hover:bg-blue-100 rounded px-4 py-2 transition duration-150">
                                                <FaEye className="text-blue-400 text-lg" />
                                            </button>
                                            <button className="text-blue-600 hover:bg-blue-100 rounded px-4 py-2 transition duration-150">
                                                <FaEdit />
                                            </button>
                                            <button
                                                className="text-blue-600 hover:bg-blue-100 rounded px-4 py-2 transition duration-150"
                                                onClick={() => handleOpenDeleteDialog(dish.id)}
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
export default dynamic (() => Promise.resolve(Dishes), {ssr: false})
