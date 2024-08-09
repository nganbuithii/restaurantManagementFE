'use client'

import { useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import HeaderAdmin from "@/components/header-admin";
import Navbar from "@/components/navbar";
import { CiCircleCheck, CiLock } from "react-icons/ci";
import { FaLock, FaSearch, FaUnlock, FaUserEdit } from "react-icons/fa";
import { IoMdInformationCircle } from "react-icons/io";

export default function MenuList() {
    const labels = ["Trang chủ", "Thực đơn"];
    const links = ["/admin/dashboard", "/admin/menu-list"];

    // State for search query
    const [searchQuery, setSearchQuery] = useState("");

    // Dummy data for menu items with image URLs
    const menuItems = [
        { id: 1, name: "Gà quay", price: "100000", status: "Active", imageUrl: "/images/food-home1.png" },
        { id: 2, name: "Bún bò", price: "80000", status: "Inactive", imageUrl: "/images/food-home2.png" },
        // Add more items with image URLs as needed
    ];

    // Filtered menu items based on search query
    const filteredMenuItems = menuItems.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex">
            <Navbar />
            <div className="flex-1 flex flex-col">
                <HeaderAdmin />
                <main className="ml-64 flex-1 p-6 bg-gray-100">
                    <Breadcrumbs labels={labels} links={links} />
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-4xl font-extrabold text-gray-900">Quản lý thực đơn</h1>
                        <div className="relative w-1/3">
                            <input
                                type="text"
                                placeholder="Tìm kiếm món ăn..."
                                className="border p-2 pl-10 w-full rounded-lg"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <table className="w-full text-left border-separate border-spacing-0">
                            <thead className="bg-gray-200 text-gray-700">
                                <tr>
                                    <th className="p-4 border-b border-gray-300">Image</th>
                                    <th className="p-4 border-b border-gray-300">Name Food</th>
                                    <th className="p-4 border-b border-gray-300">Price</th>
                                    <th className="p-4 border-b border-gray-300">Trạng thái</th>
                                    <th className="p-4 border-b border-gray-300">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMenuItems.map(item => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition duration-150">
                                        <td className="p-4 border-b border-gray-300">
                                            <img
                                                src={item.imageUrl}
                                                alt={item.name}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                        </td>
                                        <td className="p-4 border-b border-gray-300">{item.name}</td>
                                        <td className="p-4 border-b border-gray-300">{item.price}</td>
                                        <td className="p-4 border-b border-gray-300">
                                            <div className={`p-2 rounded-lg flex items-center space-x-2 text-white ${item.status === "Active" ? "bg-green-500" : "bg-red-500"}`}>
                                                <CiCircleCheck className="text-white" />
                                                <p>{item.status}</p>
                                            </div>
                                        </td>
                                        <td className="p-4 border-b border-gray-300 flex space-x-3">
                                            <button className="text-blue-600 hover:bg-blue-100 rounded px-4 py-2 transition duration-150 flex items-center space-x-1 bg-blue-200">
                                                <FaUserEdit />
                                                <span>Chỉnh sửa</span>
                                            </button>
                                            <button className="text-cyan-600 hover:bg-cyan-100 rounded px-4 py-2 transition duration-150 flex items-center space-x-1 bg-cyan-300">
                                                <IoMdInformationCircle />
                                                <span>Xem chi tiết</span>
                                            </button>
                                            <button className="text-red-600 hover:bg-red-100 rounded px-4 py-2 transition duration-150 flex items-center space-x-1 bg-red-300">
                                                <CiLock />
                                                <span>Xóa</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </main>
            </div>
        </div>
    );
}
