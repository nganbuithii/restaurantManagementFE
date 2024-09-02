'use client'
import { useEffect, useState } from "react";
import API, { authApi, endpoints } from "@/app/configs/API";
import Breadcrumbs from "@/components/Breadcrumbs";
import HeaderAdmin from "@/components/header-admin";
import Navbar from "@/components/navbar";
import Pagination from "@/components/CustomPagination";
import { calculateTotalPages } from "@/lib/paginationUtils";
import { useSelector } from "react-redux";

export default function Orders() {
    const labels = ["Home", "Management Orders"];
    const links = ["/admin/dashboard", "/admin/orders"];
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const token = useSelector((state) => state.auth.token);
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await authApi(token).get(endpoints.getAllOrders, {
                    params: {
                        page: currentPage,
                    }
                });
                console.log("GET Orders SUCCESS");
                setOrders(response.data.data.data);

                const total = response.data.data.total;
                const itemsPerPage = response.data.data.itemsPerPage;
                const calculatedTotalPages = calculateTotalPages(total, itemsPerPage);

                setTotalPages(calculatedTotalPages);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            }
        };

        fetchOrders();
    }, [currentPage, token]);

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
                    </div>

                    <div className="bg-white rounded-lg shadow-lg overflow-hidden mt-4">
                        <table className="w-full text-left border-separate border-spacing-0">
                            <thead className="bg-gray-200 text-gray-700">
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
                                            <div className={`p-2 rounded-lg text-white ${order.status === 'COMPLETED' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                                                <p>{order.status}</p>
                                            </div>
                                        </td>
                                        <td className="p-4 border-b border-gray-300">{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4 border-b border-gray-300">
                                            <button
                                                onClick={() => alert(`Details for order ${order.id}`)}
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
