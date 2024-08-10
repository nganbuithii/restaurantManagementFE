'use client'
import { useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import HeaderAdmin from "@/components/header-admin";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Table } from "@/components/ui/table";

export default function CustomerInfo() {
    const labels = ["Trang chủ", "Thông tin khách hàng"];
    const links = ["/admin/dashboard", "/admin/customer-info"];

    const [customers, setCustomers] = useState([
        { id: 1, name: "Nguyễn Văn A", email: "a@example.com", status: "Active", points: 120, contact: "0123456789", avatar: "https://via.placeholder.com/50" },
        { id: 2, name: "Trần Thị B", email: "b@example.com", status: "Inactive", points: 80, contact: "0987654321", avatar: "https://via.placeholder.com/50" },
        // Thêm dữ liệu giả lập ở đây
    ]);

    return (
        <div className="flex">
            <Navbar />
            <div className="flex-1 flex flex-col">
                <HeaderAdmin />
                <main className="ml-64 flex-1 p-6 bg-gray-50">
                    <Breadcrumbs labels={labels} links={links} />
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-4xl font-extrabold text-gray-900">Thông tin khách hàng</h1>
                        <Button className="bg-blue-600 text-white hover:bg-blue-700 rounded-lg shadow-md transition-colors">
                            Thêm khách hàng
                        </Button>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Danh sách khách hàng</h2>
                        <div className="overflow-x-auto">
                            <Table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100 text-gray-600">
                                    <tr>
                                        <th className="py-3 px-4 text-left">Avatar</th>
                                        <th className="py-3 px-4 text-left">ID</th>
                                        <th className="py-3 px-4 text-left">Tên</th>
                                        <th className="py-3 px-4 text-left">Email</th>
                                        <th className="py-3 px-4 text-left">Trạng thái</th>
                                        <th className="py-3 px-4 text-left">Điểm tích lũy</th>
                                        <th className="py-3 px-4 text-left">Liên lạc</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {customers.map((customer) => (
                                        <tr key={customer.id}>
                                            <td className="py-3 px-4">
                                                <img src={customer.avatar} alt={`${customer.name}'s avatar`} className="w-12 h-12 rounded-full object-cover" />
                                            </td>
                                            <td className="py-3 px-4 text-gray-700">{customer.id}</td>
                                            <td className="py-3 px-4 text-gray-700">{customer.name}</td>
                                            <td className="py-3 px-4 text-gray-700">{customer.email}</td>
                                            <td className={`py-3 px-4 text-gray-700 ${customer.status === "Active" ? 'text-green-600' : 'text-red-600'}`}>
                                                {customer.status}
                                            </td>
                                            <td className="py-3 px-4 text-gray-700">{customer.points}</td>
                                            <td className="py-3 px-4 text-gray-700">{customer.contact}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
