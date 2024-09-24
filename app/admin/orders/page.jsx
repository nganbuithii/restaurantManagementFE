'use client'
import { useEffect, useState } from "react";
import API, { authApi, endpoints } from "@/app/configs/API";
import Breadcrumbs from "@/components/Breadcrumbs";
import HeaderAdmin from "@/components/header-admin";
import Navbar from "@/components/navbar";
import Pagination from "@/components/CustomPagination";
import { calculateTotalPages } from "@/lib/paginationUtils";
import { useSelector } from "react-redux";
import { FaEye } from "react-icons/fa";
import dynamic from "next/dynamic";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog"; // Import confirmation dialog
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import DetailOrderDrawer from './DetailOrderDrawer'

function Orders() {
    const labels = ["Home", "Management Orders"];
    const links = ["/admin/dashboard", "/admin/orders"];
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [orderToChange, setOrderToChange] = useState(null);
    const [newStatus, setNewStatus] = useState(""); 
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const token = useSelector((state) => state.auth.token);

    const [isDrawerDetailOpen, setIsDrawerDetailOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const handleOpenDetail = (id) => {
        console.log("VÀO ĐÂY MỞ RA")
        setSelectedId(id);
        setIsDrawerDetailOpen(true)
    };
    const handleCloseDetail = () => {
        setIsDrawerDetailOpen(false);
    };


    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await authApi(token).get(endpoints.getAllOrders, {
                    params: {
                        page: currentPage,
                        search: selectedStatus === "All" ? undefined : selectedStatus
                    }
                });
                setOrders(response.data.data.data);
                const total = response.data.data.total;
                const itemsPerPage = response.data.data.itemsPerPage;
                setTotalPages(calculateTotalPages(total, itemsPerPage));
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            }
        };
        fetchOrders();
    }, [currentPage, selectedStatus, token]);

    const handleOpenChangeStatusDialog = (order, status) => {
        console.log("ORDER", order)
        setOrderToChange(order);
        setNewStatus(status);
        setConfirmDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setConfirmDialogOpen(false);
    };

    const handleConfirmChangeStatus = async () => {
        const apiEndpoint = endpoints.changeStatusOrder( orderToChange.id);
        try {
            const response = await authApi(token).patch(apiEndpoint, {
                status: newStatus,
            });
            toast.success("Change status order successfully!", { containerId: 'A' });
            console.log("Status updated successfully:", response.data);
            setConfirmDialogOpen(false);
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.id === orderToChange.id ? { ...order, status: newStatus } : order
                )
            );
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error('ERROR');
            } else {
                toast.error('An unexpected error occurred.', { containerId: 'A' });
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
                            Management Orders
                        </h1>
                        <div className="flex justify-between items-center mb-4">
                        <Select onValueChange={(value) => setSelectedStatus(value)}>
                            <SelectTrigger className="w-[180px] bg-white border border-gray-300 rounded-lg shadow-sm">
                                <SelectValue placeholder="Filter by Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="All">All</SelectItem>
                                    <SelectItem value="pending">PENDING</SelectItem>
                                    <SelectItem value="processing">PROCESSING</SelectItem>
                                    <SelectItem value="completed">COMPLETED</SelectItem>
                                    <SelectItem value="cancelled">CANCELLED</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    </div>
                    <DetailOrderDrawer
                        isOpen={isDrawerDetailOpen}
                        onClose={handleCloseDetail}
                        orderId={selectedId}
                    />

                    <div className="bg-white rounded-lg shadow-lg overflow-hidden mt-4">
                        <table className="w-full text-left border-separate border-spacing-0">
                            <thead className="bg-gray-200 bg-gradient-to-r from-yellow-500 to-orange-600 text-white">
                                <tr>
                                    <th className="p-4 border-b border-gray-300">Order ID</th>
                                    <th className="p-4 border-b border-gray-300">Total Price</th>
                                    <th className="p-4 border-b border-gray-300">Discount</th>
                                    <th className="p-4 border-b border-gray-300">Status</th>
                                    <th className="p-4 border-b border-gray-300">Created At</th>
                                    <th className="p-4 border-b border-gray-300">Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition duration-150">
                                        <td className="p-4 border-b border-gray-300">{order.id}</td>
                                        <td className="p-4 border-b border-gray-300">{order.totalPrice.toFixed(2)}</td>
                                        <td className="p-4 border-b border-gray-300">{order.discountPrice.toFixed(2)}</td>
                                        <td className="p-4 border-b border-gray-300">
                                            <Select onValueChange={(value) => handleOpenChangeStatusDialog(order, value)}>
                                                <SelectTrigger className="w-[160px] bg-white border border-gray-300 rounded-lg shadow-sm">
                                                    <SelectValue placeholder={order.status} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem value="PENDING">PENDING</SelectItem>
                                                        <SelectItem value="PROCESSING">PROCESSING</SelectItem>
                                                        <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                                                        <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </td>
                                        <td className="p-4 border-b border-gray-300">{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4 border-b border-gray-300">
                                            <button onClick={() => handleOpenDetail(order.id)} className="text-blue-600 hover:bg-blue-100 rounded px-4 py-2">
                                                <FaEye className="text-blue-400 text-lg" />
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
                    
                </main>
                <ToastContainer containerId="A" position="top-right" autoClose={3000} />
            </div>

            <DeleteConfirmationDialog
                isOpen={confirmDialogOpen}
                onClose={handleCloseDialog}
                onConfirm={handleConfirmChangeStatus}
                title="Confirm Status Change"
                description={`Are you sure you want to change the status of this order to ${newStatus}?`}
            />
            
        </div>
    );
}
export default dynamic(() => Promise.resolve(Orders), { ssr: false });
