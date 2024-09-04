'use client'
import { useEffect, useState , useCallback} from "react";
import API, { authApi, endpoints } from "@/app/configs/API";
import Breadcrumbs from "@/components/Breadcrumbs";
import HeaderAdmin from "@/components/header-admin";
import Navbar from "@/components/navbar";
import { FaLock, FaUnlock } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import UserDrawer from '@/components/UserDrawer';
import { calculateTotalPages } from "@/lib/paginationUtils";
import Pagination from "@/components/CustomPagination";
import { TbDentalBroken } from "react-icons/tb";
import { useSelector } from "react-redux";

export default function Users() {
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
    const handleOpenDrawer = () => {
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
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
            toast.error('Không thể lấy danh sách người dùng.');
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
                        <Button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md" onClick={handleOpenDrawer}>
                            Add New User
                        </Button>

                        <UserDrawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} onUserCreated={handleUserCreated} />
                    </div>

                    <div className="flex justify-between items-center mb-4">
                        <Select onValueChange={(value) => setSelectedRole(value)}>
                            <SelectTrigger className="w-[180px] bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
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

                    <div className="bg-white rounded-lg shadow-lg overflow-hidden mt-4">
                        <table className="w-full text-left border-separate border-spacing-0">
                            <thead className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
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
                                            <div className={`p-2 rounded-lg flex items-center space-x-2 ${user.isActive ? 'text-green-600' : 'text-red-600'}`}>
                                                {user.isActive ? <FaUnlock /> : <FaLock />}
                                                <span>{user.isActive ? 'Active' : 'Inactive'}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 border-b border-gray-300 flex space-x-4">
                                            <button className="text-blue-500 hover:text-blue-700 transition duration-150">View Details</button>
                                            <button
                                                className="text-red-500 hover:text-red-700 transition duration-150"
                                                onClick={() => handleOpenDeleteDialog(user.id)}
                                            >
                                                Delete
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
