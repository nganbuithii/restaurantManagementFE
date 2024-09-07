'use client'
import { useEffect, useState, useCallback } from "react";
import API, { authApi, endpoints } from "@/app/configs/API";
import Breadcrumbs from "@/components/Breadcrumbs";
import HeaderAdmin from "@/components/header-admin";
import Navbar from "@/components/navbar";
import { FaEdit, FaEye, FaLock, FaUnlock } from "react-icons/fa";
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

function Users() {
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

    const handleOpenDrawer = () => {
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
    };
    const handleOpenDetail = (id) => {
        console.log("VÀO ĐÂY MỞ RA")
        setSelectedId(id);
        setIsDrawerDetailOpen(true)
    };
    const handleCloseDetail = () => {
        setIsDrawerDetailOpen(false);
    };

    const fetchUsers = useCallback(async () => {
        try {
            const params = {
                page: currentPage,
            };

            if (selectedRole && selectedRole !== "All") {
                params.role = selectedRole;
            }

            const response = await API.get(endpoints.getAllUser, {
                params
            });
            console.log("Successfully fetched users");
            setUsers(response.data.data.data);

            const total = response.data.data.total;
            const itemsPerPage = response.data.data.itemsPerPage;
            const calculatedTotalPages = calculateTotalPages(total, itemsPerPage);

            setTotalPages(calculatedTotalPages);
        } catch (error) {
            console.error("Failed to fetch users:", error);
            // toast.error('Không thể lấy danh sách người dùng.');
        }
    }, [currentPage, selectedRole]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleUserCreated = () => {
        fetchUsers();
    };
    // delete user
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
        const apiEndpoint = endpoints.getUserById(userId); // Gọi hàm để tạo đường dẫn
        console.log("Deleting user with endpoint:", apiEndpoint);
        try {
            await authApi(token).delete(apiEndpoint);
            console.log("User deleted successfully");
            toast.success('Delete user successfully!');
            fetchUsers();
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(`Error: ${error.response.data.message || 'Something went wrong'}`);
            } else {
                toast.error('An unexpected error occurred.');
            }
            console.error("Failed to delete user:", error);
        }
    };


    return (
        <div className="flex min-h-screen bg-gray-100">
            <Navbar />
            <div className="flex-1 flex flex-col">
                <HeaderAdmin />
                <main className="ml-64 flex-1 p-6">
                    <Breadcrumbs labels={labels} links={links} />
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-4xl font-extrabold text-gray-800">
                            User Management
                        </h1>

                        <UserDrawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} onUserCreated={handleUserCreated} />
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-between mb-4 space-y-4 md:space-y-0 md:space-x-4">
                        <Button
                            className="bg-gradient-to-r from-yellow-500 to-orange-600  text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                            onClick={handleOpenDrawer}
                        >
                            Add New User
                        </Button>
                        <UserDetailDrawer
                        isOpen={isDrawerDetailOpen}
                        onClose={handleCloseDetail}
                        userId={selectedId}
                        onUpdate={fetchUsers}
                    />
                        <div className="flex items-center space-x-4">
                            <Select onValueChange={(value) => setSelectedRole(value)} className="w-full md:w-auto">
                                <SelectTrigger className="w-full md:w-[180px] bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out">
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


                    <div className="bg-white rounded-lg shadow-lg overflow-hidden mt-4">
                        <table className="w-full text-left border-separate border-spacing-0">
                            <thead className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white">
                                <tr>
                                    <th className="p-4 border-b border-gray-200">Name</th>
                                    <th className="p-4 border-b border-gray-200">Email</th>
                                    <th className="p-4 border-b border-gray-200">Role</th>
                                    <th className="p-4 border-b border-gray-200">Status</th>
                                    <th className="p-4 border-b border-gray-200">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-100 transition duration-150">
                                        <td className="p-4 border-b border-gray-300">{user.fullName}</td>
                                        <td className="p-4 border-b border-gray-300">{user.email}</td>
                                        <td className="p-4 border-b border-gray-300">{user.roleName}</td>
                                        <td className="p-4 border-b border-gray-300">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {user.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="p-4 border-b border-gray-300 flex space-x-4">
                                            <button
                                                onClick={() => handleOpenDetail(user.id)}
                                                className="text-blue-600 hover:bg-blue-100 rounded px-4 py-2 transition duration-150"
                                            >
                                                <FaEye className="text-blue-400 text-lg" />
                                            </button>
                                            <button
                                                // onClick={() => handleOpenDetail(ingredient.id)}
                                                className="text-blue-600 hover:bg-blue-100 rounded px-4 py-2 transition duration-150"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                // onClick={() => handleOpenDeleteDialog(ingredient.id)}
                                                className="text-blue-600 hover:bg-blue-100 rounded px-4 py-2 transition duration-150"
                                            >
                                                <MdDelete className="text-orange-500 text-lg" />
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
                    <DeleteConfirmationDialog
                        isOpen={deleteDialogOpen}
                        onClose={handleCloseDeleteDialog}
                        onConfirm={() => userToDelete && deleteUser(userToDelete)}
                        title="Confirm Delete"
                        description="Are you sure you want to delete this user? This action cannot be undone."
                    />
                </main>
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
}
export default dynamic(() => Promise.resolve(Users), { ssr: false })
