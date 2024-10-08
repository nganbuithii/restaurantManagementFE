import React, { useState, useEffect, useCallback } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useSelector } from 'react-redux';
import { FaTimes, FaUser, FaEnvelope, FaPhone, FaLock, FaUserTag, FaSave, FaPlus } from 'react-icons/fa';
import { authApi, endpoints } from '@/app/configs/API';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { checkPermission } from '@/utils/permissionUtils';

export default function UserDrawer({ isOpen, onClose, userId, onUpdate }) {
    const permissions = useSelector(state => state.auth.permissions);
    const canUpdateUsers = checkPermission(permissions, 'User', 'PATCH');
    const [user, setUser] = useState({
        id: '', email: '', fullName: '', phone: '', username: '', avatar: '', roleId: '', isActive: true, password: ''
    });
    const [roles, setRoles] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const token = useSelector((state) => state.auth.token);
    const isNewUser = !userId;


    const resetUserForm = () => {
        setUser({
            id: '', email: '', fullName: '', phone: '', username: '', avatar: '', roleId: '', isActive: true, password: ''
        });
        setIsEditing(true);
    };

    const fetchUserDetails = useCallback(async () => {
        try {
            const response = await authApi(token).get(endpoints.getUserById(userId));
            setUser({...response.data.data, password: ''});
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to fetch user details:", error);
            toast.error('Failed to load user details', { containerId: 'A' });
        }
    },[token, userId]);

    const fetchRoles =useCallback( async () => {
        try {
            const response = await authApi(token).get(endpoints.getAllRoles);
            setRoles(response.data.data);
        } catch (error) {
            console.error("Failed to fetch roles:", error);
        }
    },[token]);
    useEffect(() => {
        if (isOpen) {
            fetchRoles();
            if (userId) {
                fetchUserDetails();
            } else {
                resetUserForm();
            }
        }
    }, [isOpen, userId, token, fetchRoles,fetchUserDetails]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
    };

    const handleSwitchChange = (checked) => {
        setUser(prev => ({ ...prev, isActive: checked }));
    };

    const handleSubmit = async () => {
        try {
            if (isNewUser) {
                await authApi(token).post(endpoints.getAllUser, user);
                toast.success('User created successfully!', { containerId: 'E' });
            } else {
                await authApi(token).patch(endpoints.getUserById(userId), user);
                toast.success('User updated successfully!', { containerId: 'E' });
            }
            onUpdate();
            onClose();
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(`Error: ${error.response.data.message || 'Something went wrong'}`, { containerId: 'A' });
            } else {
                toast.error('An unexpected error occurred.', { containerId: 'A' });
            }
            console.error("Failed to save user:", error);
        }
    };

    return (
        <>
            <Drawer open={isOpen} onClose={onClose}>
                <DrawerContent className="bg-gradient-to-br from-orange-50 to-indigo-100">
                    <DrawerHeader className="border-b border-orange-200">
                        <DrawerTitle className="text-2xl font-bold text-orange-800">
                            {isNewUser ? 'Create New User' : 'User Details'}
                        </DrawerTitle>
                        <Button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-orange-200 text-orange-800 hover:bg-orange-300 transition duration-300">
                            <FaTimes />
                        </Button>
                    </DrawerHeader>
                    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]">
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <div className="mb-4">
                                <Label htmlFor="fullName" className="text-sm text-gray-600">Full Name</Label>
                                <div className="flex items-center space-x-3">
                                    <div className="bg-orange-100 p-2 rounded-full">
                                        <FaUser className="text-orange-600" />
                                    </div>
                                    <Input
                                        id="fullName"
                                        name="fullName"
                                        value={user.fullName}
                                        onChange={handleChange}
                                        className="flex-1 font-semibold text-orange-800"
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>
                            
                            <div className="mb-4">
                                <Label htmlFor="username" className="text-sm text-gray-600">Username</Label>
                                <div className="flex items-center space-x-3">
                                    <div className="bg-orange-100 p-2 rounded-full">
                                        <FaUser className="text-orange-600" />
                                    </div>
                                    <Input
                                        id="username"
                                        name="username"
                                        value={user.username}
                                        onChange={handleChange}
                                        className="flex-1 font-semibold text-orange-800"
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="email" className="text-sm text-gray-600">Email</Label>
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-orange-100 p-2 rounded-full">
                                            <FaEnvelope className="text-orange-600" />
                                        </div>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={user.email}
                                            onChange={handleChange}
                                            className="flex-1 font-semibold text-orange-800"
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <Label htmlFor="phone" className="text-sm text-gray-600">Phone</Label>
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-orange-100 p-2 rounded-full">
                                            <FaPhone className="text-orange-600" />
                                        </div>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            value={user.phone}
                                            onChange={handleChange}
                                            className="flex-1 font-semibold text-orange-800"
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <Label htmlFor="roleId" className="text-sm text-gray-600">Role</Label>
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-orange-100 p-2 rounded-full">
                                            <FaUserTag className="text-orange-600" />
                                        </div>
                                        <Select 
                                            onValueChange={(value) => setUser(prev => ({ ...prev, roleId: value }))}
                                            value={user.roleId?.toString()}
                                            disabled={!isEditing}
                                        >
                                            <SelectTrigger id="roleId" className="flex-1 font-semibold text-orange-800">
                                                <SelectValue placeholder="Select Role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {roles.map((role) => (
                                                    <SelectItem key={role.id} value={role.id.toString()}>{role.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                
                                <div>
                                    <Label htmlFor="isActive" className="text-sm text-gray-600">Active Status</Label>
                                    <div className="flex items-center space-x-3">
                                        <Switch
                                            id="isActive"
                                            checked={user.isActive}
                                            onCheckedChange={handleSwitchChange}
                                            disabled={!isEditing}
                                        />
                                        <span className="font-semibold text-orange-800">
                                            {user.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {(isNewUser || isEditing) && (
                                <div className="mt-4">
                                    <Label htmlFor="password" className="text-sm text-gray-600">Password</Label>
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-orange-100 p-2 rounded-full">
                                            <FaLock className="text-orange-600" />
                                        </div>
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            value={user.password}
                                            onChange={handleChange}
                                            className="flex-1 font-semibold text-orange-800"
                                            placeholder={isNewUser ? "Enter password" : "Leave blank to keep current password"}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <DrawerFooter className="border-t border-orange-200">
                        {isNewUser || isEditing ? (
                            <Button onClick={handleSubmit} className="w-full bg-orange-600 text-white hover:bg-orange-700 transition duration-300">
                                {isNewUser ? (
                                    <>
                                        <FaPlus className="mr-2" /> Create User
                                    </>
                                ) : (
                                    <>
                                        <FaSave className="mr-2" /> Save Changes
                                    </>
                                )}
                            </Button>
                        ) : (
                            canUpdateUsers && (
                                <Button onClick={() => setIsEditing(true)} className="w-full bg-orange-600 text-white hover:bg-orange-700 transition duration-300">
                                    Edit User
                                </Button>
                            )
                        )}
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
            <ToastContainer position="top-right" autoClose={3000} containerId="E" />
        </>
    );
}