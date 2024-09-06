'use client';
import { useEffect, useState } from "react";
import { authApi, endpoints } from "@/app/configs/API";
import Breadcrumbs from "@/components/Breadcrumbs";
import HeaderAdmin from "@/components/header-admin";
import Navbar from "@/components/navbar";
import Pagination from "@/components/CustomPagination";
import { calculateTotalPages } from "@/lib/paginationUtils";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog"; 
import dynamic from "next/dynamic";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FaEye } from "react-icons/fa";

function Reservations() {
    const labels = ["Home", "Management Reservations"];
    const links = ["/admin/dashboard", "/admin/reservations"];
    const [reservations, setReservations] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [newStatus, setNewStatus] = useState(""); 
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false); 
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await authApi(token).get(endpoints.getAllReservations, {
                    params: {
                        page: currentPage,
                    }
                });
                setReservations(response.data.data.data);
                const total = response.data.data.total;
                const itemsPerPage = response.data.data.itemsPerPage;
                setTotalPages(calculateTotalPages(total, itemsPerPage));
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };

        fetchReservations();
    }, [currentPage, token]);

    const handleOpenChangeStatusDialog = (reservation, status) => {
        setSelectedReservation(reservation);
        setNewStatus(status);
        setConfirmDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setConfirmDialogOpen(false);
    };

    const handleConfirmChangeStatus = async () => {
        const apiEndpoint = endpoints.changeStatusReser(selectedReservation.id);
        try {
            const response = await authApi(token).patch(apiEndpoint, {
                status: newStatus,
            });
            toast.success("Status updated successfully!");
            setConfirmDialogOpen(false);
            // Update the reservation list with new status
            setReservations((prevReservations) =>
                prevReservations.map((reservation) =>
                    reservation.id === selectedReservation.id
                        ? { ...reservation, status: newStatus }
                        : reservation
                )
            );
        } catch (error) {
            toast.error("Failed to update status.");
            console.error("Error updating status:", error);
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
                            Management Reservations
                        </h1>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg overflow-hidden mt-4">
                        <table className="w-full text-left border-separate border-spacing-0">
                            <thead className="bg-gray-200 text-gray-700">
                                <tr>
                                    <th className="p-4 border-b border-gray-300">Reservation ID</th>
                                    <th className="p-4 border-b border-gray-300">Start Time</th>
                                    <th className="p-4 border-b border-gray-300">End Time</th>
                                    <th className="p-4 border-b border-gray-300">Status</th>
                                    <th className="p-4 border-b border-gray-300">Table ID</th>
                                    <th className="p-4 border-b border-gray-300">Customer ID</th>
                                    <th className="p-4 border-b border-gray-300">Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservations.map((reservation) => (
                                    <tr key={reservation.id} className="hover:bg-gray-50 transition duration-150">
                                        <td className="p-4 border-b border-gray-300">{reservation.id}</td>
                                        <td className="p-4 border-b border-gray-300">
                                            {new Date(reservation.startTime).toLocaleString()}
                                        </td>
                                        <td className="p-4 border-b border-gray-300">
                                            {new Date(reservation.endTime).toLocaleString()}
                                        </td>
                                        <td className="p-4 border-b border-gray-300">
                                            <Select
                                                onValueChange={(value) => handleOpenChangeStatusDialog(reservation, value)}
                                                value={reservation.status}
                                            >
                                                <SelectTrigger className="w-[160px] bg-white border border-gray-300 rounded-lg shadow-sm">
                                                    <SelectValue placeholder={reservation.status} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem value="PENDING">PENDING</SelectItem>
                                                        <SelectItem value="CONFIRMED">CONFIRMED</SelectItem>
                                                        <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                                                        <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                                                        <SelectItem value="FAILED">FAILED</SelectItem>
                                                        <SelectItem value="RESCHEDULED">RESCHEDULED</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </td>
                                        <td className="p-4 border-b border-gray-300">{reservation.tableId}</td>
                                        <td className="p-4 border-b border-gray-300">{reservation.customerId}</td>
                                        <td className="p-4 border-b border-gray-300">
                                        <button className="text-blue-600 hover:bg-blue-100 rounded px-4 py-2 transition duration-150">
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
            </div>

            <DeleteConfirmationDialog
                isOpen={confirmDialogOpen}
                onClose={handleCloseDialog}
                onConfirm={handleConfirmChangeStatus}
                title="Confirm Status Change"
                description={`Are you sure you want to change the status of this reservation to ${newStatus}?`}
            />
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
}
export default dynamic(() => Promise.resolve(Reservations), { ssr: false })
