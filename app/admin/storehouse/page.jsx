'use client'
import { useCallback, useEffect, useState } from "react";
import API, { authApi, endpoints } from "@/app/configs/API";
import Breadcrumbs from "@/components/Breadcrumbs";
import HeaderAdmin from "@/components/header-admin";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/CustomPagination";
import { calculateTotalPages } from "@/lib/paginationUtils";
import { formatDate } from "@/utils/dateUtils"; 
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import { FaEdit, FaEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import StoreHouseDrawer from '@/components/StoreHouseDrawer';

function StoreHouse() {
    const labels = ["Home", "Management Store House"];
    const links = ["/admin/dashboard", "/admin/store-house"];
    const [inventory, setInventory] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const token = useSelector((state) => state.auth.token);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [IdToDelete, setIdToDelete] = useState(null);

    const handleOpenDrawer = () => {
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
    };

    const handleCreated = () => {
        fetchInventory();
    };
    const fetchInventory = useCallback(async () => {
        try {
            const response = await authApi(token).get(endpoints.getAllInventory, {
                params: {
                    page: currentPage,
                }
            });
            console.log("GET Inventory SUCCESS");
            console.log(response.data.data);
            setInventory(response.data.data.data);

            const total = response.data.data.total;
            const itemsPerPage = response.data.data.itemsPerPage;
            const calculatedTotalPages = calculateTotalPages(total, itemsPerPage);

            setTotalPages(calculatedTotalPages);
            
        } catch (error) {
            console.error("Failed to fetch inventory:", error);
        }
    }, [currentPage]);

    useEffect(() => {
        fetchInventory();
    }, [token, currentPage, fetchInventory]);

    return (
        <div className="flex">
            <Navbar />
            <div className="flex-1 flex flex-col">
                <HeaderAdmin />
                <main className="ml-64 flex-1 p-6 bg-gray-100">
                    <Breadcrumbs labels={labels} links={links} />
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-4xl font-extrabold text-gray-900">
                            Management Store House
                        </h1>
                    </div>
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md" onClick={handleOpenDrawer}>
                        Add New Slip
                    </Button>

                    <StoreHouseDrawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} onCreated={handleCreated} />

                    <div className="bg-white rounded-lg shadow-lg overflow-hidden mt-4">
                        <table className="w-full text-left border-separate border-spacing-0">
                            <thead className="bg-gray-200 text-gray-700">
                                <tr>
                                    <th className="p-4 border-b border-gray-300">ID</th>
                                    <th className="p-4 border-b border-gray-300">Name</th> {/* Thêm cột Name */}
                                    <th className="p-4 border-b border-gray-300">Quantity</th>
                                    <th className="p-4 border-b border-gray-300">Last Checked</th>
                                    {/* <th className="p-4 border-b border-gray-300">Ingredient ID</th> */}
                                    <th className="p-4 border-b border-gray-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inventory.map((inven) => (
                                    <tr key={inven.id} className="hover:bg-gray-50 transition duration-150">
                                        <td className="p-4 border-b border-gray-300">{inven.id}</td>
                                        <td className="p-4 border-b border-gray-300">{inven.ingredient.name}</td> {/* Hiển thị Name */}
                                        <td className="p-4 border-b border-gray-300">{inven.quantity}</td>
                                        <td className="p-4 border-b border-gray-300">{formatDate(inven.lastChecked)}</td>
                                        {/* <td className="p-4 border-b border-gray-300">{inven.ingredientId}</td> */}
                                        <td className="p-4 border-b border-gray-300 flex space-x-3">
                                        <button className="text-blue-600 hover:bg-blue-100 rounded px-4 py-2 transition duration-150">
                                                <FaEye className="text-blue-400 text-lg" />
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
export default dynamic (() => Promise.resolve(StoreHouse), {ssr: false})
