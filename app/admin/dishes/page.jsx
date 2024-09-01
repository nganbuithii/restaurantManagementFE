'use client'
import { useEffect, useState } from "react";
import API, { endpoints } from "@/app/configs/API";
import Breadcrumbs from "@/components/Breadcrumbs";
import HeaderAdmin from "@/components/header-admin";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { calculateTotalPages } from "@/lib/paginationUtils";
import Image from "next/image";
import Pagination from "@/components/CustomPagination";

export default function Dishes() {
    const labels = ["Home", "Management Dishes"];
    const links = ["/admin/dashboard", "/admin/dishes"];
    const [dishes, setDishes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchDishes = async () => {
            try {
                const response = await API.get(endpoints.getAllDishes, {
                    params: {
                        page: currentPage,
                    }
                });
                console.log("GET Dishes SUCCESS");
                setDishes(response.data.data.data);

                const total = response.data.data.total;
                const itemsPerPage = response.data.data.itemsPerPage;
                const calculatedTotalPages = calculateTotalPages(total, itemsPerPage);

                setTotalPages(calculatedTotalPages);
            } catch (error) {
                console.error("Failed to fetch dishes:", error);
            }
        };

        fetchDishes();
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
                            Management Dishes
                        </h1>
                    </div>
                    <Button className="p-5 bg-orange-300">Add new dish</Button>

                    <div className="bg-white rounded-lg shadow-lg overflow-hidden mt-4">
                        <table className="w-full text-left border-separate border-spacing-0">
                            <thead className="bg-gray-200 text-gray-700">
                                <tr>
                                    <th className="p-4 border-b border-gray-300">Tên món ăn</th>
                                    <th className="p-4 border-b border-gray-300">Giá</th>
                                    <th className="p-4 border-b border-gray-300">Trạng thái</th>
                                    <th className="p-4 border-b border-gray-300">Hình ảnh</th>
                                    <th className="p-4 border-b border-gray-300">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dishes.map((dish) => (
                                    <tr key={dish.id} className="hover:bg-gray-50 transition duration-150">
                                        <td className="p-4 border-b border-gray-300">{dish.name}</td>
                                        <td className="p-4 border-b border-gray-300">{dish.price}</td>
                                        <td className="p-4 border-b border-gray-300">
                                            <div className={`p-2 rounded-lg flex items-center space-x-2 text-white ${dish.isActive ? 'bg-green-500' : 'bg-gray-500'}`}>
                                                <p>{dish.isActive ? 'Active' : 'Inactive'}</p>
                                            </div>
                                        </td>
                                        <td className="p-4 border-b border-gray-300">
                                            <div className="flex space-x-2">
                                                {dish.images.map(image => (
                                                    <Image
                                                        key={image.id}
                                                        src={image.url}
                                                        alt="Dish Image"
                                                        width={64}  
                                                        height={64} 
                                                        className="object-cover"
                                                    />
                                                ))}
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
