'use client';
import { useCallback, useEffect, useState } from "react";
import API, { authApi, endpoints } from "@/app/configs/API";
import Breadcrumbs from "@/components/Breadcrumbs";
import HeaderAdmin from "@/components/header-admin";
import Navbar from "@/components/navbar";
import Pagination from "@/components/CustomPagination";
import { calculateTotalPages } from "@/lib/paginationUtils";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import SupplierDrawer from './SupplierDrawer';
import dynamic from "next/dynamic";
import { FaEdit, FaEye, FaPlus, FaSearch } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdDelete } from "react-icons/md";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";
import DetailDrawerSupplier from './DetailDrawerSupplier'

function Supplier() {
    const labels = ["Home", "Management Supplier"];
    const links = ["/admin/dashboard", "/admin/suppliers"];
    const [suppliers, setSuppliers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const token = useSelector((state) => state.auth.token);

    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [IdToDelete, setIdToDelete] = useState(null);

    const [isDrawerDetailOpen, setIsDrawerDetailOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);
    const handleOpenDrawer = () => {
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
    };

    const handleCreated = () => {
        fetchSuppliers();
    };
    const handleOpenDetail = (id) => {
        console.log("VÀO ĐÂY MỞ RA")
        setSelectedId(id);
        setIsDrawerDetailOpen(true)
    };
    const handleCloseDetail = () => {
        setIsDrawerDetailOpen(false);
    };
    const fetchSuppliers = useCallback(async () => {
        try {
            const response = await authApi(token).get(endpoints.getAllSupliers, {
                params: {
                    page: currentPage,search: debouncedSearchQuery,
                }
            });
            console.log("GET SUPPLIERS SUCCESS");
            setSuppliers(response.data.data.data);

            const total = response.data.data.total;
            const itemsPerPage = response.data.data.itemsPerPage;
            const calculatedTotalPages = calculateTotalPages(total, itemsPerPage);

            setTotalPages(calculatedTotalPages);
        } catch (error) {
            console.error("Failed to fetch suppliers:", error);
        }
    }, [currentPage,debouncedSearchQuery,token]);

    useEffect(() => {
        fetchSuppliers();
    }, [token, currentPage, fetchSuppliers]);

    const handleOpenDeleteDialog = (id) => {
        setIdToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setIdToDelete(null);
    };

    const handleDeleteConfirmed = async () => {
        const apiEndpoint = endpoints.getSupplierById(IdToDelete);
        console.log("Deleting  with endpoint:", apiEndpoint);
        try {
            await authApi(token).delete(apiEndpoint);
            toast.success("Supplier deleted successfully!", { containerId: 'A' });
            fetchSuppliers();
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

    const getStatusTextColor = (isActive) => {
        return isActive ? 'text-green-500' : 'text-red-500';
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
                            <Button
                                onClick={handleOpenDrawer}
                                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center"
                            >
                                <FaPlus className="mr-2" /> Add New Supplier
                            </Button>
                        </div>
                    </div>
            
                    <SupplierDrawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} onCreated={handleCreated} />
                    <DetailDrawerSupplier
                        isOpen={isDrawerDetailOpen}
                        onClose={handleCloseDetail}
                        onCreated={handleCreated}
                        idDetail={selectedId}
                        onUpdate={fetchSuppliers}
                    />

                    <div className="bg-white rounded-lg shadow-lg overflow-hidden mt-4">
                        <table className="w-full text-left border-separate border-spacing-0">
                            <thead className="bg-gray-200 text-gray-700">
                                <tr>
                                    <th className="p-4 border-b border-gray-300">Supplier ID</th>
                                    <th className="p-4 border-b border-gray-300">Name</th>
                                    <th className="p-4 border-b border-gray-300">Address</th>
                                    <th className="p-4 border-b border-gray-300">Email</th>
                                    <th className="p-4 border-b border-gray-300">Status</th>
                                    <th className="p-4 border-b border-gray-300">Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {suppliers.map((supplier) => (
                                    <tr key={supplier.id} className="hover:bg-gray-50 transition duration-150">
                                        <td className="p-4 border-b border-gray-300">{supplier.id}</td>
                                        <td className="p-4 border-b border-gray-300">{supplier.name}</td>
                                        <td className="p-4 border-b border-gray-300">{supplier.address}</td>
                                        <td className="p-4 border-b border-gray-300">{supplier.email}</td>
                                        <td className="p-4 border-b border-gray-300">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${supplier.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {supplier.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                    
                                        <td className="p-4 border-b border-gray-300">
                                            <button   onClick={() => handleOpenDetail(supplier.id)} className="text-blue-600 hover:bg-blue-100 rounded px-4 py-2 transition duration-150">
                                                <FaEye className="text-blue-400 text-lg" />
                                            </button>
                                            <button onClick={() => handleOpenDetail(supplier.id)}  className="text-blue-600 hover:bg-blue-100 rounded px-4 py-2 transition duration-150">
                                                <FaEdit />
                                            </button>
                                            <button
                                                className="text-blue-600 hover:bg-blue-100 rounded px-4 py-2 transition duration-150"
                                                onClick={() => handleOpenDeleteDialog(supplier.id)}
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
                        description="Are you sure you want to delete this supplier? This action cannot be undone."
                    />
                </main>
            </div>
            <ToastContainer containerId="A" position="top-right" autoClose={3000} />
        </div>
    );
}
export default dynamic(() => Promise.resolve(Supplier), { ssr: false })
