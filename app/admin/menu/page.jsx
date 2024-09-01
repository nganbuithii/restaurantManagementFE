'use client'
import { useEffect, useState } from "react";
import API, { endpoints } from "@/app/configs/API";
import Breadcrumbs from "@/components/Breadcrumbs";
import HeaderAdmin from "@/components/header-admin";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/Pagination";
import { calculateTotalPages } from "@/lib/paginationUtils";

export default function Menus() {
    const labels = ["Home", "Menu"];
    const links = ["/admin/dashboard", "/admin/menu"];
    const [menus, setMenu] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const response = await API.get(endpoints.getAllMenus, {
                    params: {
                        page: currentPage,
                    }
                });
                console.log("GET menus SUCCESS");
                setMenu(response.data.data.data);

                const total = response.data.data.total;
                const itemsPerPage = response.data.data.itemsPerPage;
                const calculatedTotalPages = calculateTotalPages(total, itemsPerPage);

                setTotalPages(calculatedTotalPages);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };

        fetchMenus();
    }, [currentPage]);

    return (
        <div className="flex">
            <Navbar />
            <div className="flex-1 flex flex-col">
                <HeaderAdmin />
                <main className="ml-64 flex-1 p-6 bg-gray-100">
                    <Breadcrumbs labels={labels} links={links} />
                    <Button className="p-5 bg-orange-300">Add new menu</Button>

                    <div className="bg-white rounded-lg shadow-lg overflow-hidden mt-4">
                        <table className="w-full text-left border-separate border-spacing-0">
                            <thead className="bg-gray-200 text-gray-700">
                                <tr>
                                    <th className="p-4 border-b border-gray-300">Menu name</th>
                                    <th className="p-4 border-b border-gray-300">Status</th>
                                    <th className="p-4 border-b border-gray-300">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {menus.map((menu) => (
                                    <tr key={menu.id} className="hover:bg-gray-50 transition duration-150">
                                        <td className="p-4 border-b border-gray-300">{menu.name}</td>
                                        <td className="p-4 border-b border-gray-300">
                                            <div className={`p-2 rounded-lg flex items-center space-x-2 text-white ${menu.isActive ? 'bg-green-500' : 'bg-gray-500'}`}>
                                                <p>{menu.isActive ? 'Active' : 'Inactive'}</p>
                                            </div>
                                        </td>
                                        <td className="p-4 border-b border-gray-300 flex space-x-3">
                                            <button className="text-blue-600 hover:bg-blue-100 rounded px-4 py-2 transition duration-150">See detail</button>
                                            <button className="text-red-600 hover:bg-red-100 rounded px-4 py-2 transition duration-150">Delete</button>
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
