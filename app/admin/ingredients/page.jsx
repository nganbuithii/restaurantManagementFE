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
import IngredientDrawer from './IngredientDrawer';
import DetailDrawerIngres from './detailDrawerIngres';
import dynamic from "next/dynamic";
import { checkPermission } from '../../../utils/permissionUtils';
import Image from "next/image";

function Ingredients() {
    const permissions = useSelector(state => state.auth.permissions);
    const canView = checkPermission(permissions, 'Ingredient', 'GET');
    const canCreate = checkPermission(permissions, 'Ingredient', 'POST');
    const canUpdate = checkPermission(permissions, 'Ingredient', 'PATCH');
    const canDelete = checkPermission(permissions, 'Ingredient', 'DELETE');

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
    }, [currentPage, token, debouncedSearchQuery, sortOrder, totalPages]);


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
                {canView ? (
                    <main className="ml-64 flex-1 p-6 bg-gray-100">
                        <Breadcrumbs labels={labels} links={links} />
                        <div className=" rounded-xl ">
                            <div className="flex flex-wrap justify-between items-center ">
                                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                                    Ingredients Management
                                </h1>
                                <div className="flex flex-col md:flex-row justify-between items-stretch space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
                                    <div className="relative flex-grow md:w-[300px]">
                                        <input
                                            type="text"
                                            placeholder="Search ingredients..."
                                            className="border border-gray-300 py-2 pl-12 pr-4 w-full rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition duration-300 ease-in-out"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                        <FaSearch className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
                                    </div>
                                    {canView &&
                                        <Button
                                            onClick={handleOpenDrawer}
                                            className="bg-gradient-to-r  from-yellow-500 to-orange-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:from-green-500 hover:to-green-600 transition transform hover:scale-105 duration-300 ease-in-out"
                                        >
                                            + Add New Ingredient
                                        </Button>}
                                </div>
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
                                <thead className="bg-gray-200 bg-gradient-to-r from-yellow-500 to-orange-600 text-white">
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
                                                {canUpdate &&
                                                    <button
                                                        onClick={() => handleOpenDetail(ingredient.id)}
                                                        className="text-blue-600 hover:bg-blue-100 rounded px-4 py-2 transition duration-150"
                                                    >
                                                        <FaEdit />
                                                    </button>}
                                                {canDelete &&
                                                    <button
                                                        onClick={() => handleOpenDeleteDialog(ingredient.id)}
                                                        className="text-blue-600 hover:bg-blue-100 rounded px-4 py-2 transition duration-150"
                                                    >
                                                        <MdDelete className="text-orange-500 text-lg" />
                                                    </button>}
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
                    </main>) :
                    (<div className="flex flex-col items-center justify-center h-full bg-white rounded-xl shadow-lg p-8">
                        <Image src="/images/permission-deny.avif" alt="Permission Denied" width={200} height={200} className="mb-6" />
                        <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
                        <p className="text-gray-600 text-lg text-center">You do not have permission to view the user management page.</p>
                    </div>)}
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
}
export default dynamic(() => Promise.resolve(Ingredients), { ssr: false })
