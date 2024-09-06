'use client';
import { useEffect, useState, useCallback } from "react";
import API, { authApi, endpoints } from "@/app/configs/API";
import Breadcrumbs from "@/components/Breadcrumbs";
import HeaderAdmin from "@/components/header-admin";
import Navbar from "@/components/navbar";
import Pagination from "@/components/CustomPagination";
import { calculateTotalPages } from "@/lib/paginationUtils";
import { useSelector } from "react-redux";
import { FaEdit, FaEye, FaLock, FaPlus, FaSearch, FaUnlock } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Button } from '@/components/ui/button';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import IngredientDrawer from '@/components/IngredientDrawer';
import DetailDrawerIngres from './detailDrawerIngres';
import dynamic from "next/dynamic";

function Ingredients() {
    const labels = ["Home", "Management Ingredients"];
    const links = ["/admin/dashboard", "/admin/ingredients"];
    const [ingredients, setIngredients] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const token = useSelector((state) => state.auth.token);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState('');
    const [selectedIngredientId, setSelectedIngredientId] = useState(null);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isDrawerDetailOpen, setIsDrawerDetailOpen] = useState(false);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [IngreToDelete, setIngreToDelete] = useState(null);

    const handleOpenDrawer = () => {
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
    };
    const handleCreated = () => {
        fetchIngredients();
    };
    const handleOpenDetail = (id) => {
        console.log("VÀO ĐÂY MỞ RA")
        setSelectedIngredientId(id);
        setIsDrawerDetailOpen(true)
    };
    const handleCloseDetail = () => {
        setIsDrawerDetailOpen(false);
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);
    const fetchIngredients = useCallback(async () => {
        try {
            const response = await authApi(token).get(endpoints.getAllIngredients, {
                params: {
                    page: currentPage,
                    search: debouncedSearchQuery,
                    sort: sortOrder,
                }
            });
            setIngredients(response.data.data.data);
            console.log("Current Page:", currentPage);
            console.log("Total Pages:", totalPages);


            const total = response.data.data.total;
            const itemsPerPage = response.data.data.itemsPerPage;
            const calculatedTotalPages = calculateTotalPages(total, itemsPerPage);

            setTotalPages(calculatedTotalPages);
        } catch (error) {
            console.error("Failed to fetch ingredients:", error);
        }
    }, [currentPage, token, debouncedSearchQuery, sortOrder]);


    useEffect(() => {
        fetchIngredients();
    }, [fetchIngredients, currentPage]);


    // delete 
    const handleOpenDeleteDialog = (Id) => {
        setIngreToDelete(Id);
        setDeleteDialogOpen(true);
    };


    const handleCloseDeleteDialog = (confirm) => {
        setDeleteDialogOpen(false);
        if (confirm && userToDelete) {
            deleteIngre(IngreToDelete);
        }
    };
    const deleteIngre = async (Id) => {
        const apiEndpoint = endpoints.getIngredientById(Id);
        console.log("Deleting  with endpoint:", apiEndpoint);
        try {
            await authApi(token).delete(apiEndpoint);
            console.log(" deleted successfully");
            toast.success('Delete successfully!');
            fetchIngredients();
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(`Error: ${error.response.data.message || 'Something went wrong'}`);
            } else {
                toast.error('An unexpected error occurred.');
            }
            console.error("Failed to delete:", error);
        }
    };
    return (
        <div className="flex">
            <Navbar />
            <div className="flex-1 flex flex-col">
                <HeaderAdmin />
                <main className="ml-64 flex-1 p-6 bg-gray-100">
                    <Breadcrumbs labels={labels} links={links} />
                    <div className=" rounded-lg p-6 mb-6">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold text-gray-800">
                                Ingredients Management
                            </h1>
                            <Button
                                onClick={handleOpenDrawer}
                                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center"
                            >
                                <FaPlus className="mr-2" /> Add New Ingredient
                            </Button>
                        </div>
                        <div className="flex flex-col md:flex-row justify-between items-stretch space-y-4 md:space-y-0 md:space-x-4">
                            <div className="relative flex-grow">
                                <input
                                    type="text"
                                    placeholder="Search ingredients..."
                                    className="border border-gray-300 p-2 pl-10 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                            </div>
                            <Select onValueChange={(value) => setSortOrder(value)}>
                                <SelectTrigger className="w-full md:w-[200px] bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out">
                                    <SelectValue placeholder="Sort ingredients" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="All">All</SelectItem>
                                        <SelectItem value="price_asc">Price: Low to High</SelectItem>
                                        <SelectItem value="price_desc">Price: High to Low</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <IngredientDrawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} onCreated={handleCreated} />
                    <DetailDrawerIngres
                        isOpen={isDrawerDetailOpen}
                        onClose={handleCloseDetail}
                        onCreated={handleCreated}
                        idDetail={selectedIngredientId}
                        onUpdate={fetchIngredients}
                    />



                    <div className="bg-white rounded-lg shadow-lg overflow-hidden mt-4">
                        <table className="w-full text-left border-separate border-spacing-0">
                            <thead className="bg-gray-200 text-gray-700">
                                <tr>
                                    <th className="p-4 border-b border-gray-300">ID</th>
                                    <th className="p-4 border-b border-gray-300">Name</th>
                                    <th className="p-4 border-b border-gray-300">Unit</th>
                                    <th className="p-4 border-b border-gray-300">Price</th>
                                    <th className="p-4 border-b border-gray-300">Status</th>
                                    <th className="p-4 border-b border-gray-300">Created At</th>
                                    <th className="p-4 border-b border-gray-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ingredients.map((ingredient) => (
                                    <tr key={ingredient.id} className="hover:bg-gray-50 transition duration-150">
                                        <td className="p-4 border-b border-gray-300">{ingredient.id}</td>
                                        <td className="p-4 border-b border-gray-300">{ingredient.name}</td>
                                        <td className="p-4 border-b border-gray-300">{ingredient.unit}</td>
                                        <td className="p-4 border-b border-gray-300">{ingredient.price.toFixed(2)}</td>
                                        <td className="p-4 border-b border-gray-300">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ingredient.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {ingredient.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="p-4 border-b border-gray-300">{new Date(ingredient.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4 border-b border-gray-300">
                                            <button
                                                onClick={() => handleOpenDetail(ingredient.id)}
                                                className="text-blue-600 hover:bg-blue-100 rounded px-4 py-2 transition duration-150"
                                            >
                                                <FaEye className="text-blue-400 text-lg" />
                                            </button>
                                            <button
                                                onClick={() => handleOpenDetail(ingredient.id)}
                                                className="text-blue-600 hover:bg-blue-100 rounded px-4 py-2 transition duration-150"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleOpenDeleteDialog(ingredient.id)}
                                                className="text-blue-600 hover:bg-blue-100 rounded px-4 py-2 transition duration-150"
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
                            onPageChange={(page) => setCurrentPage(page)}
                        />
                    </div>
                    <DeleteConfirmationDialog
                        isOpen={deleteDialogOpen}
                        onClose={handleCloseDeleteDialog}
                        onConfirm={() => IngreToDelete && deleteIngre(IngreToDelete)}
                        title="Confirm Delete"
                        description="Are you sure you want to delete this user? This action cannot be undone."
                    />
                </main>
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
}
export default dynamic(() => Promise.resolve(Ingredients), { ssr: false })
