'use client'
import { useCallback, useEffect, useState } from "react";
import API, { authApi, endpoints } from "@/app/configs/API";
import Breadcrumbs from "@/components/Breadcrumbs";
import HeaderAdmin from "@/components/header-admin";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import MenuDrawer from './MenuDrawer';
import Pagination from "@/components/CustomPagination";
import { calculateTotalPages } from "@/lib/paginationUtils";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import { FaEdit, FaEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";
import DetailMenuDrawer from "./DetailMenuDrawer"
import { checkPermission } from '@/utils/permissionUtils';;
import Image from "next/image";
import { Suspense } from 'react'

function Menus() {
    const permissions = useSelector(state => state.auth.permissions);
    const canViewMenu = checkPermission(permissions, 'Menus', 'GET');
    const canCreateMenu = checkPermission(permissions, 'Menus', 'POST');
    const canUpdateMenu = checkPermission(permissions, 'Menus', 'PATCH');
    const canDeleteMenu = checkPermission(permissions, 'Menus', 'DELETE');

    const labels = ["Home", "Menu"];
    const links = ["/admin/dashboard", "/admin/menu"];
    const [menus, setMenu] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isDrawerDetailOpen, setIsDrawerDetailOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

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
        fetchMenus();
    };

    const fetchMenus = useCallback(async () => {
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
    }, [currentPage]);
    const handleOpenDetail = (id) => {
        console.log("VÀO ĐÂY MỞ RA")
        setSelectedId(id);
        setIsDrawerDetailOpen(true)
    };
    const handleCloseDetail = () => {
        setIsDrawerDetailOpen(false);
    };

    useEffect(() => {
        fetchMenus();
    }, [token, currentPage, fetchMenus]);

    const handleOpenDeleteDialog = (id) => {
        setIdToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setIdToDelete(null);
    };

    const handleDeleteConfirmed = async () => {
        const apiEndpoint = endpoints.getMenuById(IdToDelete);
        console.log("Deleting  with endpoint:", apiEndpoint);
        try {
            await authApi(token).delete(apiEndpoint);
            toast.success("Menu deleted successfully!", { containerId: 'A' });
            fetchMenus();
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error('ERROR');
            } else {
                toast.error('An unexpected error occurred.', { containerId: 'A' });
            }
            console.error("Failed to delete:", error);
        } finally {
            handleCloseDeleteDialog();
        }
    };

    return (
       
        <div className="flex">
            <Navbar />
            <div className="flex-1 flex flex-col">
                <HeaderAdmin />
                {canViewMenu ? (
                    <main className="ml-64 flex-1 p-6 bg-gray-100">
                        <Breadcrumbs labels={labels} links={links} />
                        <div className="flex justify-between my-6">
                            <h1 className="text-3xl font-bold text-gray-800">
                                Menus Management
                            </h1>
                            {canCreateMenu &&
                                <Button className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md" onClick={handleOpenDrawer}>
                                    Add New Menus
                                </Button>}
                        </div>
                        <MenuDrawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} onCreated={handleCreated} />
                        <DetailMenuDrawer
                            isOpen={isDrawerDetailOpen}
                            onClose={handleCloseDetail}
                            onCreated={handleCreated}
                            idDetail={selectedId}
                            onUpdate={fetchMenus}
                        />
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
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${menu.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {menu.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="p-4 border-b border-gray-300 flex space-x-3">
                                                <button onClick={() => handleOpenDetail(menu.id)} className="text-blue-600 hover:bg-blue-100 rounded px-4 py-2 transition duration-150">
                                                    <FaEye className="text-blue-400 text-lg" />
                                                </button>
                                                {canUpdateMenu &&
                                                    <button className="text-blue-600 hover:bg-blue-100 rounded px-4 py-2 transition duration-150">
                                                        <FaEdit />
                                                    </button>}
                                                {canDeleteMenu &&
                                                    <button
                                                        className="text-blue-600 hover:bg-blue-100 rounded px-4 py-2 transition duration-150"
                                                        onClick={() => handleOpenDeleteDialog(menu.id)}
                                                    >
                                                        <MdDelete className="text-orange-500 text-lg" />
                                                    </button>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* <div className="mt-6">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div> */}
                        <DeleteConfirmationDialog
                            isOpen={deleteDialogOpen}
                            onClose={handleCloseDeleteDialog}
                            onConfirm={handleDeleteConfirmed}
                            title="Confirm Delete"
                            description="Are you sure you want to delete this menu? This action cannot be undone."
                        />
                    </main>) :
                    (<div className="flex flex-col items-center justify-center h-full bg-white rounded-xl shadow-lg p-8">
                        <Image src="/images/permission-deny.avif" alt="Permission Denied" width={200} height={200} className="mb-6" />
                        <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
                        <p className="text-gray-600 text-lg text-center">You do not have permission to view the user management page.</p>
                    </div>)}
            </div>
            <ToastContainer containerId="A" position="top-right" autoClose={3000} />
        </div>
      
    );
}
export default dynamic(() => Promise.resolve(Menus), { ssr: false })
