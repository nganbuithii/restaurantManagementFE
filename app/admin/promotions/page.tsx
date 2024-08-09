'use client'

import { useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import HeaderAdmin from "@/components/header-admin";
import Navbar from "@/components/navbar";
import { FaSearch, FaUnlock } from "react-icons/fa";


export default function Promotions() {
    const labels = ["Trang chủ", "Khuyến mãi"];
    const links = ["/admin/dashboard", "/admin/promotions"];

    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="flex">
            <Navbar />
            <div className="flex-1 flex flex-col">
                <HeaderAdmin />
                <main className="ml-64 flex-1 p-6 bg-gray-100">
                    <Breadcrumbs labels={labels} links={links} />
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-4xl font-extrabold text-gray-900">Quản lý khuyến mãi</h1>
                    </div>
                    <div className="relative w-1/3 mb-7">
                            <input
                                type="text"
                                placeholder="Tìm kiếm món ăn..."
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
                                    <th className="p-4 border-b border-gray-300">Mã khuyến mãi</th>
                                    <th className="p-4 border-b border-gray-300">Giảm giá</th>
                                    <th className="p-4 border-b border-gray-300">Số lượng</th>
                                    <th className="p-4 border-b border-gray-300">Ngày bắt đầu</th>
                                    <th className="p-4 border-b border-gray-300">Ngày hết hạn</th>
                                    <th className="p-4 border-b border-gray-300">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="hover:bg-gray-50 transition duration-150">
                                    <td className="p-4 border-b border-gray-300">fwefwefwgeew</td>
                                    <td className="p-4 border-b border-gray-300">50%</td>
                                    <td className="p-4 border-b border-gray-300">1</td>
                                    <td className="p-4 border-b border-gray-300">13-11-2024</td>
                                    <td className="p-4 border-b border-gray-300">13-11-2024</td>
                                    <td className="p-4 border-b border-gray-300">
                                        <div className="p-2 bg-orange-500 rounded-lg flex items-center space-x-2 text-white">
                                            <FaUnlock className="text-white" />
                                            <p>Unlock</p>
                                        </div>
                                    </td>

                                </tr>

                            </tbody>
                        </table>
                    </div>

                </main>
            </div>
        </div>
    );
}
