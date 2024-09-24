'use client'
import { authApi, endpoints } from "@/app/configs/API";
import Breadcrumbs from "@/components/Breadcrumbs";
import Pagination from "@/components/CustomPagination";
import HeaderAdmin from "@/components/header-admin";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { calculateTotalPages } from "@/lib/paginationUtils";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import CreatePermissionDrawer from './CreatePermissionDrawer'
import { checkPermission } from '@/utils/permissionUtils';
import Image from "next/image";

function Permission() {
    const permission = useSelector(state => state.auth.permissions);
    const canView = checkPermission(permission, 'Permission', 'GET');

    const labels = ["Home", "Permissions"];
    const links = ["/admin/dashboard", "/admin/permissions"];
    const router = useRouter();
    const [permissions, setPermissions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const user = useSelector((state) => state.auth.user);
    const token = useSelector((state) => state.auth.token);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    // if (!user) {
    //     router.push('/admin/login');
    //     return null; 
    // }
    const fetchPermission = useCallback(async () => {
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
    }, [token, currentPage]);
    useEffect(() => {


        fetchPermission();
    }, [currentPage, token, fetchPermission]);
    const handleOpenDrawer = () => {
        setIsDrawerOpen(true);
    };
    const handleCreatePermission = () => {
        fetchPermission();
    }

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
    };
    return (
        <div className="flex">
            <Navbar />
            <div className="flex-1 flex flex-col">
                <HeaderAdmin />
                {canView ? (
                    <main className="ml-64 flex-1 p-6 bg-gray-100">
                        <Breadcrumbs labels={labels} links={links} />
                        <div className="flex flex-row justify-between">
                            <h1 className="mt-4 text-3xl font-bold mb-6">Manage Permissions</h1>
                            <Button className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1"
                                onClick={handleOpenDrawer}
                            >
                                +  Add New Permission
                            </Button>
                        </div>
                        <CreatePermissionDrawer
                            isOpen={isDrawerOpen}
                            onClose={handleCloseDrawer}
                            onCreatePermission={handleCreatePermission}
                        />
                        <section className=" bg-white p-6 rounded-lg shadow-lg">
                            <table className="w-full text-left border-separate border-spacing-0">
                                <thead className="bg-gray-200 text-gray-700">
                                    <tr>
                                        <th className="p-4 border-b border-gray-300">API Path</th>
                                        <th className="p-4 border-b border-gray-300">Method</th>
                                        <th className="p-4 border-b border-gray-300">Module</th>
                                        <th className="p-4 border-b border-gray-300">Description</th>
                                        <th className="p-4 border-b border-gray-300">Created At</th>
                                        <th className="p-4 border-b border-gray-300">Updated At</th>
                                        {/* <th className="p-4 border-b border-gray-300">Actions</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {permissions.map((permission) => (
                                        <tr key={permission.id} className="hover:bg-gray-50 transition duration-150">
                                            <td className="p-4 border-b border-gray-300">{permission.apiPath}</td>
                                            <td className="p-4 border-b border-gray-300">
                                                <span className={`font-medium px-2 py-1 rounded ${permission.method === 'GET' ? 'text-green-600 bg-green-100' :
                                                    permission.method === 'POST' ? 'text-yellow-600 bg-yellow-100' :
                                                        permission.method === 'PATCH' ? 'text-purple-600 bg-purple-100' :
                                                            permission.method === 'DELETE' ? 'text-red-600 bg-red-100' :
                                                                'text-gray-600 bg-gray-100'
                                                    }`}>
                                                    {permission.method}
                                                </span>
                                            </td>                                        <td className="p-4 border-b border-gray-300">{permission.module}</td>
                                            <td className="p-4 border-b border-gray-300">{permission.description}</td>
                                            <td className="p-4 border-b border-gray-300">{new Date(permission.createdAt).toLocaleDateString()}</td>
                                            <td className="p-4 border-b border-gray-300">{new Date(permission.updatedAt).toLocaleDateString()}</td>
                                            {/* <td className="p-4 border-b border-gray-300">
                                            <Switch />
                                        </td> */}
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
                    </main>) :
                    (
                        <div className="flex flex-col items-center justify-center h-full bg-white rounded-xl shadow-lg p-8">
                            <Image src="/images/permission-deny.avif" alt="Permission Denied" width={200} height={200} className="mb-6" />
                            <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
                            <p className="text-gray-600 text-lg text-center">You do not have permission to view the user management page.</p>
                        </div>
                    )}
            </div>
        </div>
    );
}
export default dynamic(() => Promise.resolve(Permission), { ssr: false })