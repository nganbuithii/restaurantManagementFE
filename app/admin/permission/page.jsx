'use client'
import { authApi, endpoints } from "@/app/configs/API";
import Breadcrumbs from "@/components/Breadcrumbs";
import Pagination from "@/components/CustomPagination";
import HeaderAdmin from "@/components/header-admin";
import Navbar from "@/components/navbar";
import { Switch } from "@/components/ui/switch";
import { calculateTotalPages } from "@/lib/paginationUtils";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function Permission() {
    const labels = ["Home", "Permissions"];
    const links = ["/admin/dashboard", "/admin/permissions"]; 

    const [permissions, setPermissions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        const fetchPermission = async () => {
            try {
                const response = await authApi(token).get(endpoints.getAllPermission, {
                    params: {
                        page: currentPage,
                    }
                });
                console.log("GET SUCCESS");
                setPermissions(response.data.data.data);

                const total = response.data.data.total;
                const itemsPerPage = response.data.data.itemsPerPage;
                const calculatedTotalPages = calculateTotalPages(total, itemsPerPage);

                setTotalPages(calculatedTotalPages);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };

        fetchPermission();
    }, [currentPage, token]);

    return (
        <div className="flex">
            <Navbar />
            <div className="flex-1 flex flex-col">
                <HeaderAdmin />
                <main className="ml-64 flex-1 p-6 bg-gray-100">
                    <Breadcrumbs labels={labels} links={links} />
                    <h1 className="mt-4 text-3xl font-bold mb-6">Quản lý quyền truy cập</h1>

                    <section className="mt-6 bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold mb-4">Danh sách quyền</h3>
                        <table className="w-full text-left border-separate border-spacing-0">
                            <thead className="bg-gray-200 text-gray-700">
                                <tr>
                                    <th className="p-4 border-b border-gray-300">Action</th>
                                    <th className="p-4 border-b border-gray-300">Resource</th>
                                    <th className="p-4 border-b border-gray-300">Description</th>
                                    <th className="p-4 border-b border-gray-300">Created At</th>
                                    <th className="p-4 border-b border-gray-300">Updated At</th>
                                    <th className="p-4 border-b border-gray-300">Enable</th>
                                </tr>
                            </thead>
                            <tbody>
                                {permissions.map((permission) => (
                                    <tr key={permission.id} className="hover:bg-gray-50 transition duration-150">
                                        <td className="p-4 border-b border-gray-300">{permission.action}</td>
                                        <td className="p-4 border-b border-gray-300">{permission.resource}</td>
                                        <td className="p-4 border-b border-gray-300">{permission.description}</td>
                                        <td className="p-4 border-b border-gray-300">{new Date(permission.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4 border-b border-gray-300">{new Date(permission.updatedAt).toLocaleDateString()}</td>
                                        <td className="p-4 border-b border-gray-300">
                                            <Switch />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>

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
