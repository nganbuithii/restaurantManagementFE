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
import { checkPermission } from '@/utils/permissionUtils';
import Image from "next/image";

function Promotions() {
    const permissions = useSelector(state => state.auth.permissions);
    const canViewVoucher = checkPermission(permissions, 'Voucher', 'GET');
    const canCreateVoucher = checkPermission(permissions, 'Voucher', 'POST');
    const canUpdateVoucher = checkPermission(permissions, 'Voucher', 'PATCH');
    const canDeleteVoucher = checkPermission(permissions, 'Voucher', 'DELETE');

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
                {canViewVoucher ? (
                    <main className="ml-64 flex-1 p-6 bg-gray-100">
                        <Breadcrumbs labels={labels} links={links} />
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800">
                                Promotion Management
                            </h1>

                            <div className="relative w-full sm:w-1/3 mb-5 sm:mb-0">
                                <input
                                    type="text"
                                    placeholder="Search promotions..."
                                    className="border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition duration-300 ease-in-out p-3 pl-12 w-full rounded-lg shadow-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <FaSearch className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 text-lg" />
                            </div>
                            {canCreateVoucher &&
                                <Button
                                    onClick={handleOpenDrawer}
                                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-2 px-5 rounded-lg shadow-lg transition-all duration-300 ease-in-out flex items-center"
                                >
                                    <FaPlus className="mr-2" /> Add Voucher
                                </Button>}
                        </div>



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
                                <thead className="bg-gray-200 bg-gradient-to-r from-yellow-500 to-orange-600 text-white">
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
                                                {canUpdateVoucher&&
                                                <button onClick={() => handleOpenDetail(promotion.id)} className="text-blue-600 hover:bg-blue-100 rounded px-4 py-2 transition duration-150">
                                                    <FaEdit />
                                                </button>}
                                                {canDeleteVoucher &&
                                                <button
                                                    className="text-blue-600 hover:bg-blue-100 rounded px-4 py-2 transition duration-150"
                                                    onClick={() => handleOpenDeleteDialog(promotion.id)}
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

                    </main>) : (
                    <div className="flex flex-col items-center justify-center h-full bg-white rounded-xl shadow-lg p-8">
                        <Image src="/images/permission-deny.avif" alt="Permission Denied" width={200} height={200} className="mb-6" />
                        <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
                        <p className="text-gray-600 text-lg text-center">You do not have permission to view the user management page.</p>
                    </div>
                )}
            </div>
            <ToastContainer containerId="A" position="top-right" autoClose={3000} />
        </div>
    );
}
export default dynamic(() => Promise.resolve(Promotions), { ssr: false })
