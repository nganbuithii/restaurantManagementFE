'use client'
import { useEffect, useState } from "react";
import API, { endpoints } from "@/app/configs/API";
import Breadcrumbs from "@/components/Breadcrumbs";
import HeaderAdmin from "@/components/header-admin";
import Navbar from "@/components/navbar";
import { FaLock, FaUnlock } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/Pagination";
import { calculateTotalPages } from "@/lib/paginationUtils";


export default function Users() {
    const labels = ["Trang chủ", "Quản lý người dùng"];
    const links = ["/admin/dashboard", "/admin/users"];
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await API.get(endpoints.getAllUser, {
                    params: {
                        page: currentPage,
                    }
                });
                console.log("GET USER THÀNH CÔNG");
                setUsers(response.data.data.data);

                const total = response.data.data.total;
                const itemsPerPage = response.data.data.itemsPerPage;
                const calculatedTotalPages = calculateTotalPages(total, itemsPerPage);
                
                setTotalPages(calculatedTotalPages);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            }
        };

        fetchUsers();
    }, [currentPage]);

    return (
        <div className="flex">
            <Navbar />
            <div className="flex-1 flex flex-col">
                <HeaderAdmin />
                <main className="ml-64 flex-1 p-6 bg-gray-100">
                    <Breadcrumbs labels={labels} links={links} />
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-4xl font-extrabold text-gray-900">
                            Quản lý người dùng
                        </h1>
                    </div>
                    <Button className="p-5 bg-orange-300">Add new user </Button>

                    <div className="bg-white rounded-lg shadow-lg overflow-hidden mt-4">
                        <table className="w-full text-left border-separate border-spacing-0">
                            <thead className="bg-gray-200 text-gray-700">
                                <tr>
                                    <th className="p-4 border-b border-gray-300">Tên</th>
                                    <th className="p-4 border-b border-gray-300">Email</th>
                                    <th className="p-4 border-b border-gray-300">Vai trò</th>
                                    <th className="p-4 border-b border-gray-300">Tình trạng</th>
                                    <th className="p-4 border-b border-gray-300">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition duration-150">
                                        <td className="p-4 border-b border-gray-300">{user.fullName}</td>
                                        <td className="p-4 border-b border-gray-300">{user.email}</td>
                                        <td className="p-4 border-b border-gray-300">{user.roleId}</td>
                                        <td className="p-4 border-b border-gray-300">
                                            <div className={`p-2 rounded-lg flex items-center space-x-2 text-white ${user.status === 'active' ? 'bg-green-500' : 'bg-orange-500'}`}>
                                                {user.status === 'active' ? <FaUnlock className="text-white" /> : <FaLock className="text-white" />}
                                                <p>{user.status === 'active' ? 'Unlock' : 'Locked'}</p>
                                            </div>
                                        </td>
                                        <td className="p-4 border-b border-gray-300 flex space-x-3">
                                            <button className="text-blue-600 hover:bg-blue-100 rounded px-4 py-2 transition duration-150">Xem chi tiết</button>
                                            <button className="text-red-600 hover:bg-red-100 rounded px-4 py-2 transition duration-150">Xóa</button>
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