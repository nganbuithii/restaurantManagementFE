'use client';
import { useEffect, useState } from "react";
import API, { authApi, endpoints } from "@/app/configs/API";
import Breadcrumbs from "@/components/Breadcrumbs";
import HeaderAdmin from "@/components/header-admin";
import Navbar from "@/components/navbar";
import Pagination from "@/components/CustomPagination";
import { calculateTotalPages } from "@/lib/paginationUtils";
import { useSelector } from "react-redux";

export default function Supplier() {
    const labels = ["Home", "Management Supplier"];
    const links = ["/admin/dashboard", "/admin/suppliers"];
    const [suppliers, setSuppliers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const response = await authApi(token).get(endpoints.getAllSupliers, {
                    params: {
                        page: currentPage,
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
        };

        fetchSuppliers();
    }, [currentPage, token]);

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
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-4xl font-extrabold text-gray-900">
                            Management Suppliers
                        </h1>
                    </div>

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
                                            <div className={`p-2 rounded-lg ${getStatusTextColor(supplier.isActive)}`}>
                                                <p>{supplier.isActive ? 'Active' : 'Inactive'}</p>
                                            </div>
                                        </td>
                                    
                                        <td className="p-4 border-b border-gray-300">
                                            <button
                                                onClick={() => alert(`Details for supplier ${supplier.id}`)}
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
