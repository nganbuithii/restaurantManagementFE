'use client'
import React, { useEffect, useState, useCallback } from "react";
import API, { authApi, endpoints } from "@/app/configs/API";
import Breadcrumbs from "@/components/Breadcrumbs";
import HeaderAdmin from "@/components/header-admin";
import Navbar from "@/components/navbar";
import { FaEdit, FaEye } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import dynamic from "next/dynamic";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import UserDrawer from './UserDrawer';
import { useSelector } from "react-redux";
import UserDetailDrawer from './DetailUserDrawer'
import Pagination from "@/components/CustomPagination";
import { MdDelete } from "react-icons/md";
import { checkPermission } from '@/utils/permissionUtils';
import Image from "next/image";

function Users() {
    const permissions = useSelector(state => state.auth.permissions);
    const canViewUsers = checkPermission(permissions, 'User', 'GET');
    const canCreateUsers = checkPermission(permissions, 'User', 'POST');
    const canUpdateUsers = checkPermission(permissions, 'User', 'PATCH');
    const canDeleteUsers = checkPermission(permissions, 'User', 'DELETE');


    const labels = ["Home", "User Management"];
    const links = ["/admin/dashboard", "/admin/users"];
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedRole, setSelectedRole] = useState("");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const token = useSelector((state) => state.auth.token);
    const [selectedId, setSelectedId] = useState(null);
    const [isDrawerDetailOpen, setIsDrawerDetailOpen] = useState(false);

    const handleOpenDrawer = () => setIsDrawerOpen(true);
    const handleCloseDrawer = () => setIsDrawerOpen(false);
    const handleOpenDetail = (id) => {
        setSelectedId(id);
        setIsDrawerDetailOpen(true);
    };
    const handleCloseDetail = () => setIsDrawerDetailOpen(false);

    const fetchUsers = useCallback(async () => {
        try {
            const params = {
                page: currentPage,
                ...(selectedRole && selectedRole !== "All" && { search: selectedRole }),
            };
            const response = await API.get(endpoints.getAllUser, { params });
            setUsers(response.data.data.data);
            const total = response.data.data.total;
            const itemsPerPage = response.data.data.itemsPerPage;
            setTotalPages(Math.ceil(total / itemsPerPage));
        } catch (error) {
            console.error("Failed to fetch users:", error);
            toast.error('Failed to fetch users. Please try again.');
        }
    }, [currentPage, selectedRole]);

    useEffect(() => {
        if (canViewUsers) {
            fetchUsers();
        }
    }, [fetchUsers, canViewUsers]);

    const handleUserCreated = () => fetchUsers();

    const handleOpenDeleteDialog = (userId) => {
        setUserToDelete(userId);
        setDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = (confirm) => {
        setDeleteDialogOpen(false);
        if (confirm && userToDelete) {
            deleteUser(userToDelete);
        }
    };

    const deleteUser = async (userId) => {
        try {
            await authApi(token).delete(endpoints.getUserById(userId));
            toast.success('User deleted successfully!');
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'An unexpected error occurred.');
            console.error("Failed to delete user:", error);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Navbar />
            <div className="flex-1 flex flex-col">
                <HeaderAdmin />
                <main className="ml-64 flex-1 p-8">
                    <Breadcrumbs labels={labels} links={links} />
                    {canViewUsers ? (
                        <div className="bg-white rounded-xl shadow-lg p-6 ">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
                                <div className="flex space-x-4">
                                    {canCreateUsers && (
                                        <Button
                                            onClick={handleOpenDrawer}
                                            className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                                        >
                                        + Add New User
                                        </Button>
                                    )}
                                    <Select onValueChange={setSelectedRole}>
                                        <SelectTrigger className="w-[180px] bg-white border border-gray-300 rounded-lg">
                                            <SelectValue placeholder="Filter by Role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Role</SelectLabel>
                                                <SelectItem value="All">All</SelectItem>
                                                <SelectItem value="customer">Customer</SelectItem>
                                                <SelectItem value="employee">Employee</SelectItem>
                                                <SelectItem value="admin">Administrator</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="p-4 font-semibold text-gray-600">Name</th>
                                            <th className="p-4 font-semibold text-gray-600">Email</th>
                                            <th className="p-4 font-semibold text-gray-600">Role</th>
                                            <th className="p-4 font-semibold text-gray-600">Status</th>
                                            <th className="p-4 font-semibold text-gray-600">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition duration-150">
                                                <td className="p-4">{user.fullName}</td>
                                                <td className="p-4">{user.email}</td>
                                                <td className="p-4">{user.roleName}</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {user.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex space-x-2">
                                                        {/* <button onClick={() => handleOpenDetail(user.id)} className="text-blue-600 hover:text-blue-800 transition duration-150">
                                                            <FaEye className="text-lg" />
                                                        </button> */}
                                                        {canUpdateUsers && (
                                                            <button onClick={() => handleOpenDetail(user.id)} className="text-yellow-600 hover:text-yellow-800 transition duration-150">
                                                                <FaEdit className="text-lg" />
                                                            </button>
                                                        )}
                                                        {canDeleteUsers && (
                                                            <button onClick={() => handleOpenDeleteDialog(user.id)} className="text-red-600 hover:text-red-800 transition duration-150">
                                                                <MdDelete className="text-lg" />
                                                            </button>
                                                        )}
                                                    </div>
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
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full bg-white rounded-xl shadow-lg p-8">
                            <Image src="/images/permission-deny.avif" alt="Permission Denied" width={200} height={200} className="mb-6" />
                            <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
                            <p className="text-gray-600 text-lg text-center">You do not have permission to view the user management page.</p>
                        </div>
                    )}
                </main>
            </div>
            <UserDrawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} onUserCreated={handleUserCreated} />
            <UserDetailDrawer
                isOpen={isDrawerDetailOpen}
                onClose={handleCloseDetail}
                userId={selectedId}
                onUpdate={fetchUsers}
            />
            <DeleteConfirmationDialog
                isOpen={deleteDialogOpen}
                onClose={handleCloseDeleteDialog}
                onConfirm={() => userToDelete && deleteUser(userToDelete)}
                title="Confirm Delete"
                description="Are you sure you want to delete this user? This action cannot be undone."
            />
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
}

export default dynamic(() => Promise.resolve(Users), { ssr: false });