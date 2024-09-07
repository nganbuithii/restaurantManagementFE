'use client'

import { useCallback, useEffect, useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import HeaderAdmin from "@/components/header-admin";
import Navbar from "@/components/navbar";
import { FaEdit, FaEye, FaLock, FaPlus, FaSearch, FaUnlock } from "react-icons/fa";
import { MdDelete } from "react-icons/md"; import { useSelector } from "react-redux";
import { calculateTotalPages } from "@/lib/paginationUtils";
import API, { authApi, endpoints } from "@/app/configs/API";
import Pagination from "@/components/CustomPagination";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import VoucherDrawer from './VoucherDrawer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";
import DetailVoucherDrawer from './DetailVoucherDrawer'

function Promotions() {
    const labels = ["Home", "Promotions"];
    const links = ["/admin/dashboard", "/admin/promotions"];
    const [promotions, setPromotions] = useState([]);
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

    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [selectedVoucherId, setSelectedVoucherId] = useState(null);
    const [newVoucherStatus, setNewVoucherStatus] = useState("");


    const handleOpenDrawer = () => {
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
    };

    const handleCreated = () => {
        fetchVoucher();
    };


    const fetchVoucher = useCallback(async () => {
        try {
            const response = await API.get(endpoints.getAllVouchers, {
                params: {
                    page: currentPage,
                    search: debouncedSearchQuery,
                }
            });
            setPromotions(response.data.data.data);

            const total = response.data.data.total;
            const itemsPerPage = response.data.data.itemsPerPage;
            const calculatedTotalPages = calculateTotalPages(total, itemsPerPage);

            setTotalPages(calculatedTotalPages);
        } catch (error) {
            console.error("Failed to fetch voucher:", error);
        }
    }, [currentPage, debouncedSearchQuery]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);
    useEffect(() => {
        fetchVoucher();
    }, [currentPage, token, debouncedSearchQuery, fetchVoucher]);


    const handleOpenDeleteDialog = (id) => {
        setIdToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setIdToDelete(null);
    };
    const handleOpenDetail = (id) => {
        console.log("VÀO ĐÂY MỞ RA")
        setSelectedId(id);
        setIsDrawerDetailOpen(true)
    };
    const handleCloseDetail = () => {
        setIsDrawerDetailOpen(false);
    };

    const handleDeleteConfirmed = async () => {
        const apiEndpoint = endpoints.getVoucherById(IdToDelete);
        try {
            await authApi(token).delete(apiEndpoint);
            console.log("DELETE")
            toast.success("Voucher deleted successfully!", { containerId: 'A' });
            fetchVoucher();
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(`Error: ${error.response.data.message || 'Something went wrong'}`, { containerId: 'B' });
            } else {
                toast.error('An unexpected error occurred.', { containerId: 'A' });
            }
        } finally {
            handleCloseDeleteDialog();
        }
    };
    const handleChangeStatus = (id, newStatus) => {
        setSelectedVoucherId(id);
        setNewVoucherStatus(newStatus);
        setStatusDialogOpen(true); 
    };

    const handleStatusChangeConfirmed = async () => {
        try {
            await authApi(token).patch(endpoints.changeStatusVoucher(selectedVoucherId), { status: newVoucherStatus });
            toast.success("Status updated successfully!", { containerId: 'A' });
            fetchVoucher(); 
        } catch (error) {
            toast.error("Failed to update status", { containerId: 'A' });
        } finally {
            setStatusDialogOpen(false); // Close the confirmation dialog
            setSelectedVoucherId(null);
            setNewVoucherStatus("");
        }
    };


    // const getStatusClass = (status) => {
    //     switch (status) {
    //         case "ACTIVE":
    //             return "bg-green-100 text-green-800";
    //         case "PAUSED":
    //             return "bg-yellow-100 text-yellow-800";
    //         case "EXPIRED":
    //             return "bg-red-100 text-red-800";
    //         case "USED_UP":
    //             return "bg-gray-100 text-gray-800";
    //         default:
    //             return "";
    //     }
    // };


    return (
        <div className="flex">
            <Navbar />
            <div className="flex-1 flex flex-col">
                <HeaderAdmin />
                <main className="ml-64 flex-1 p-6 bg-gray-100">
                    <Breadcrumbs labels={labels} links={links} />
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-4xl font-extrabold text-gray-900"> Management Promotion</h1>
                    </div>
                    <div className="relative w-1/3 mb-7">
                        <input
                            type="text"
                            placeholder="Search promotions..."
                            className="border p-2 pl-10 w-full rounded-lg"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
                    </div>
                    <Button
                        onClick={handleOpenDrawer}
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center"
                    >
                        <FaPlus className="mr-2" /> Add voucher
                    </Button>

                    <VoucherDrawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} onCreated={handleCreated} />
                    <DetailVoucherDrawer
                        isOpen={isDrawerDetailOpen}
                        onClose={handleCloseDetail}
                        onCreated={handleCreated}
                        idDetail={selectedId}
                        onUpdate={fetchVoucher}
                    />


                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <table className="w-full text-left border-separate border-spacing-0">
                            <thead className="bg-gray-200 text-gray-700">
                                <tr>
                                    <th className="p-4 border-b border-gray-300">Promotion Code</th>
                                    <th className="p-4 border-b border-gray-300">Discount</th>
                                    <th className="p-4 border-b border-gray-300">Quantity</th>
                                    <th className="p-4 border-b border-gray-300">Start Date</th>
                                    <th className="p-4 border-b border-gray-300">End Date</th>
                                    <th className="p-4 border-b border-gray-300">Status</th>
                                    <th className="p-4 border-b border-gray-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {promotions.map((promotion) => (
                                    <tr key={promotion.id} className="hover:bg-gray-50 transition duration-150">
                                        <td className="p-4 border-b border-gray-300">{promotion.code}</td>
                                        <td className="p-4 border-b border-gray-300">{promotion.percent}%</td>
                                        <td className="p-4 border-b border-gray-300">{promotion.quantity}</td>
                                        <td className="p-4 border-b border-gray-300">
                                            {new Date(promotion.startDate).toLocaleDateString("vi-VN")}
                                        </td>
                                        <td className="p-4 border-b border-gray-300">
                                            {new Date(promotion.endDate).toLocaleDateString("vi-VN")}
                                        </td>
                                        {/* <td className="p-4 border-b border-gray-300">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(promotion.status)}`}>
                                                {promotion.status}
                                            </span>
                                        </td> */}
                                        <td className="p-4 border-b border-gray-300">
                                            <select
                                                value={promotion.status}
                                                onChange={(e) => handleChangeStatus(promotion.id, e.target.value)}
                                                className="px-2 py-1 border rounded"
                                            >
                                                <option value="ACTIVE">Active</option>
                                                <option value="PAUSED">Paused</option>
                                                <option value="EXPIRED">Expired</option>
                                                <option value="USED_UP">Used Up</option>
                                            </select>
                                        </td>

                                        <td className="p-4 border-b border-gray-300 flex space-x-2">
                                            <button onClick={() => handleOpenDetail(promotion.id)} className="text-blue-600 hover:bg-blue-100 rounded px-4 py-2 transition duration-150">
                                                <FaEye className="text-blue-400 text-lg" />
                                            </button>
                                            <button onClick={() => handleOpenDetail(promotion.id)} className="text-blue-600 hover:bg-blue-100 rounded px-4 py-2 transition duration-150">
                                                <FaEdit />
                                            </button>
                                            <button
                                                className="text-blue-600 hover:bg-blue-100 rounded px-4 py-2 transition duration-150"
                                                onClick={() => handleOpenDeleteDialog(promotion.id)}
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
                        description="Are you sure you want to delete this voucher? This action cannot be undone."
                    />
                    <DeleteConfirmationDialog
                        isOpen={statusDialogOpen}
                        onClose={() => setStatusDialogOpen(false)}
                        onConfirm={handleStatusChangeConfirmed}
                        title="Confirm Status Change"
                        description={`Are you sure you want to change the status to "${newVoucherStatus}"? This action cannot be undone.`}
                    />

                </main>
            </div>
            <ToastContainer containerId="A" position="top-right" autoClose={3000} />
        </div>
    );
}
export default dynamic(() => Promise.resolve(Promotions), { ssr: false })
