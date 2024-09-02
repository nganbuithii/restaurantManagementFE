'use client';
import { useEffect, useState } from "react";
import { authApi, endpoints } from "@/app/configs/API";
import Breadcrumbs from "@/components/Breadcrumbs";
import HeaderAdmin from "@/components/header-admin";
import Navbar from "@/components/navbar";
import Pagination from "@/components/CustomPagination";
import { calculateTotalPages } from "@/lib/paginationUtils";
import { useSelector } from "react-redux";

export default function Reservations() {
    const labels = ["Home", "Management Reservations"];
    const links = ["/admin/dashboard", "/admin/reservations"];
    const [reservations, setReservations] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
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
                const calculatedTotalPages = calculateTotalPages(total, itemsPerPage);

                setTotalPages(calculatedTotalPages);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };

        fetchReservations();
    }, [currentPage, token]);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'PENDING':
                return 'text-yellow-500';
            case 'CONFIRMED':
                return 'text-blue-500';
            case 'CANCELLED':
                return 'text-red-500';
            case 'COMPLETED':
                return 'text-green-500';
            case 'FAILED':
                return 'text-gray-500';
            case 'RESCHEDULED':
                return 'text-purple-500';
            default:
                return 'text-gray-500';
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
                                            <p className={`p-2 rounded-lg ${getStatusStyle(reservation.status)}`}>
                                                {reservation.status}
                                            </p>
                                        </td>
                                        <td className="p-4 border-b border-gray-300">{reservation.tableId}</td>
                                        <td className="p-4 border-b border-gray-300">{reservation.customerId}</td>
                                        <td className="p-4 border-b border-gray-300">
                                            <button
                                                onClick={() => alert(`Details for reservation ${reservation.id}`)}
                                                className="text-blue-600 hover:bg-blue-100 rounded px-4 py-2 transition duration-150"
                                            >
                                                View Details
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
        </div>
    );
}
