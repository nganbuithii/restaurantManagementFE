'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { authApi, endpoints } from "@/app/configs/API";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import Navbar from "@/components/navbar";
import HeaderAdmin from "@/components/header-admin";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit } from 'react-icons/fa';
import EditRoleDrawer from './EditRoleDrawer';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import CreateRoleDrawer from './CreateRoleDrawer'

function Roles() {
    const labels = ["Home", "Roles"];
    const links = ["/admin/dashboard", "/admin/roles"];
    const [roles, setRoles] = useState([]);
    const [selectedRoleId, setSelectedRoleId] = useState(null);
    const token = useSelector((state) => state.auth.token);
    const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
    const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [roleToToggle, setRoleToToggle] = useState(null);

    const fetchRoles = useCallback(async () => {
        try {
            const response = await authApi(token).get(endpoints.getAllRoles);
            console.log("GET roles SUCCESS");
            setRoles(response.data.data);
        } catch (error) {
            console.error("Failed to fetch data:", error);
            toast.error("Failed to fetch roles");
        }
    }, [token]);

    useEffect(() => {
        fetchRoles();
    }, [fetchRoles]);

    const handleOpenEditDrawer = (roleId) => {
        setSelectedRoleId(roleId);
        setIsEditDrawerOpen(true);
    };

    const handleCloseEditDrawer = () => {
        setIsEditDrawerOpen(false);
        setSelectedRoleId(null);
    };

    const handleOpenCreateDrawer = () => {
        setIsCreateDrawerOpen(true);
    };

    const handleCloseCreateDrawer = () => {
        setIsCreateDrawerOpen(false);
    };

    const handleToggleActive = (id, currentStatus, roleName) => {
        if (isProtectedRole(roleName)) {
            toast.warn("Cannot modify the status of ADMIN or CUSTOMER roles");
            return;
        }
        setRoleToToggle({ id, currentStatus, roleName });
        setStatusDialogOpen(true);
    };

    const handleStatusChangeConfirmed = async () => {
        if (!roleToToggle) return;

        const { id, currentStatus, roleName } = roleToToggle;
        try {
            await authApi(token).post(endpoints.changeStatusRole(id));
            fetchRoles();
            toast.success(`Role ${currentStatus ? 'deactivated' : 'activated'} successfully`, { containerId: "B" });
        } catch (error) {
            console.error("Failed to toggle role status:", error);
            toast.error("Failed to update role status", { containerId: "B" });
        } finally {
            setStatusDialogOpen(false);
            setRoleToToggle(null);
        }
    };

    const isProtectedRole = (roleName) => roleName === 'ADMIN' || roleName === 'CUSTOMER';

    return (
        <div className="flex">
            <Navbar />
            <div className="flex-1 flex flex-col">
                <HeaderAdmin />
                <main className="ml-64 flex-1 p-6 bg-gray-100">
                    <Breadcrumbs labels={labels} links={links} />
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold">Manage Roles</h1>
                        <Button onClick={handleOpenCreateDrawer} className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white">
                            + Add New Role
                        </Button>
                    </div>
                    <EditRoleDrawer
                        isOpen={isEditDrawerOpen}
                        onClose={handleCloseEditDrawer}
                        roleId={selectedRoleId}
                        onUpdate={fetchRoles}
                    />
                    <CreateRoleDrawer
                        isOpen={isCreateDrawerOpen}
                        onClose={handleCloseCreateDrawer}
                        onUpdate={fetchRoles}
                    />
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-200 bg-gradient-to-r from-yellow-500 to-orange-600 text-white">
                                <tr>
                                    <th className="p-4 font-semibold ">ID</th>
                                    <th className="p-4 font-semibold ">Name</th>
                                    <th className="p-4 font-semibold ">Created At</th>
                                    <th className="p-4 font-semibold ">Updated At</th>
                                    <th className="p-4 font-semibold ">Status</th>
                                    <th className="p-4 font-semibold ">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {roles.map((role) => (
                                    <tr key={role.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{role.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{role.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{new Date(role.createdAt).toLocaleString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{new Date(role.updatedAt).toLocaleString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Switch
                                                checked={role.isActive}
                                                onCheckedChange={() => handleToggleActive(role.id, role.isActive, role.name)}
                                                disabled={isProtectedRole(role.name)}
                                                className="data-[state=checked]:bg-orange-500 data-[state=unchecked]:bg-gray-200"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-2">
                                            {!isProtectedRole(role.name) && (
                                                <FaEdit
                                                    className="text-yellow-500 cursor-pointer hover:text-yellow-600"
                                                    onClick={() => handleOpenEditDrawer(role.id)}
                                                />
                                            )}
                                            {isProtectedRole(role.name) && (
                                                <span className="text-gray-500 italic">Protected Role</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
            <ToastContainer position="top-right" autoClose={3000} containerId={"B"} />
            <DeleteConfirmationDialog
                isOpen={statusDialogOpen}
                onClose={() => setStatusDialogOpen(false)}
                onConfirm={handleStatusChangeConfirmed}
                title={`Confirm ${roleToToggle?.currentStatus ? 'Deactivate' : 'Activate'} Role`}
                description={`Are you sure you want to ${roleToToggle?.currentStatus ? 'deactivate' : 'activate'} this role? This action can be undone later.`}
            />
        </div>
    );
}

export default dynamic(() => Promise.resolve(Roles), { ssr: false });