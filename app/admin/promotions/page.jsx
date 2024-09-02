'use client'

import { useEffect, useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import HeaderAdmin from "@/components/header-admin";
import Navbar from "@/components/navbar";
import { FaSearch, FaUnlock, FaEdit, FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { calculateTotalPages } from "@/lib/paginationUtils";
import API, { endpoints } from "@/app/configs/API";
import Pagination from "@/components/CustomPagination";

export default function Promotions() {
    const labels = ["Home", "Promotions"];
    const links = ["/admin/dashboard", "/admin/promotions"];
    const [promotions, setPromotions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const token = useSelector((state) => state.auth.token);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

    // Use useEffect to debounce the search query
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 300); // Delay in milliseconds (e.g., 300ms)

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);

    useEffect(() => {
        const fetchVoucher = async () => {
            try {
                const response = await API.get(endpoints.getAllVouchers, {
                    params: {
                        page: currentPage,
                        search: debouncedSearchQuery,
                    }
                });
                console.log("GET voucher SUCCESS");
                setPromotions(response.data.data.data); 

                const total = response.data.data.total;
                const itemsPerPage = response.data.data.itemsPerPage;
                const calculatedTotalPages = calculateTotalPages(total, itemsPerPage);

                setTotalPages(calculatedTotalPages);
            } catch (error) {
                console.error("Failed to fetch voucher:", error);
            }
        };

        fetchVoucher();
    }, [currentPage, token, debouncedSearchQuery]);

    const getStatusClass = (status) => {
        switch (status) {
            case "ACTIVE":
                return "text-green-500";
            case "PAUSED":
                return "text-yellow-500";
            case "EXPIRED":
                return "text-red-500";
            case "USED_UP":
                return "text-gray-500";
            default:
                return "";
        }
    };

    const handleEdit = (id) => {
        console.log(`Edit voucher with id: ${id}`);
        // Logic chỉnh sửa voucher
    };

    const handleDelete = (id) => {
        console.log(`Delete voucher with id: ${id}`);
        // Logic xóa voucher
    };

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
                                        <td className={`p-4 border-b border-gray-300 ${getStatusClass(promotion.status)}`}>
                                            {promotion.status}
                                        </td>
                                        <td className="p-4 border-b border-gray-300 flex space-x-2">
                                            <button
                                                className="text-blue-500 hover:text-blue-700"
                                                onClick={() => handleEdit(promotion.id)}
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                className="text-red-500 hover:text-red-700"
                                                onClick={() => handleDelete(promotion.id)}
                                            >
                                                <FaTrash />
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
