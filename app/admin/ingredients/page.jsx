'use client';
import { useEffect, useState } from "react";
import API, { authApi, endpoints } from "@/app/configs/API";
import Breadcrumbs from "@/components/Breadcrumbs";
import HeaderAdmin from "@/components/header-admin";
import Navbar from "@/components/navbar";
import Pagination from "@/components/CustomPagination";
import { calculateTotalPages } from "@/lib/paginationUtils";
import { useSelector } from "react-redux";
import { FaEdit, FaEye, FaLock, FaSearch, FaUnlock } from "react-icons/fa";
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

export default function Ingredients() {
    const labels = ["Home", "Management Ingredients"];
    const links = ["/admin/dashboard", "/admin/ingredients"];
    const [ingredients, setIngredients] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const token = useSelector((state) => state.auth.token);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState(''); 

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
                    page: currentPage, search: debouncedSearchQuery, sort: sortOrder,
                }
            });
            console.log("GET Ingredients SUCCESS");
            setIngredients(response.data.data.data);

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
    }, [fetchIngredients]);


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
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-4xl font-extrabold text-gray-900">
                            Management Ingredients
                        </h1>
                    </div>
                    <div className="relative w-1/3 mb-7">
                        <input
                            type="text"
                            placeholder="Search ingredients..."
                            className="border p-2 pl-10 w-full rounded-lg"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
                    </div>

                    <Button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md" onClick={handleOpenDrawer}>
                            Add New Ingredient
                        </Button>
                        <IngredientDrawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} onCreated={handleCreated} />

                    <div className="flex justify-between items-center mb-4">
                    <Select onValueChange={(value) => setSortOrder(value)}>
                            <SelectTrigger className="w-[180px] bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <SelectValue placeholder="Filter ingredients" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="All">All</SelectItem>
                                    <SelectItem value="price_asc">Price Ascending</SelectItem>
                                    <SelectItem value="price_desc">Price Descending</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

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
                                            <div className={`p-2 rounded-lg flex items-center space-x-2 ${ingredient.isActive ? 'text-green-600' : 'text-red-600'}`}>
                                                {ingredient.isActive ? <FaUnlock /> : <FaLock />}
                                                <span>{ingredient.isActive ? 'Active' : 'Inactive'}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 border-b border-gray-300">{new Date(ingredient.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4 border-b border-gray-300">
                                            <button
                                                onClick={() => alert(`Details for ingredient ${ingredient.id}`)}
                                                className="text-blue-600 hover:bg-blue-100 rounded px-4 py-2 transition duration-150"
                                            >
                                                <FaEye className="text-blue-400 text-lg" />
                                            </button>
                                            <button
                                                onClick={() => alert(`Details for ingredient ${ingredient.id}`)}
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
                            onPageChange={setCurrentPage}
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
