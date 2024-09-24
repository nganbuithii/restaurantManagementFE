import React, { useState, useEffect, useCallback } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { authApi, endpoints } from '@/app/configs/API';
import { useDispatch, useSelector } from 'react-redux';
import { X } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { updateRolePermissions } from '@/app/store/authSlice';

const EditRoleDrawer = ({ isOpen, onClose, roleId, onUpdate }) => {
    const [roleName, setRoleName] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [permissions, setPermissions] = useState({});
    const [groupedPermissions, setGroupedPermissions] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const token = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();

    const fetchRoleDetails = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await authApi(token).get(endpoints.getRoleById(roleId));
            const roleData = response.data.data;

            setRoleName(roleData.name);
            setIsActive(roleData.isActive);

            // Lưu trữ permissions của role
            const rolePermissions = roleData.permissions.reduce((acc, permission) => {
                acc[permission.id] = true;
                return acc;
            }, {});

            setPermissions(rolePermissions);
        } catch (error) {
            console.error("Lỗi khi lấy thông tin vai trò:", error);
            toast.error('Failed to fetch role details', { containerId: 'C' });
        } finally {
            setIsLoading(false);
        }
    }, [roleId, token]);

    const fetchAllPermissions = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await authApi(token).post(endpoints.getAllPer);
            const allPermissions = response.data.data;
            console.log("ALL quyền", response.data.data)
            const groupedData = allPermissions.reduce((acc, permission) => {
                if (!acc[permission.module]) {
                    acc[permission.module] = [];
                }
                acc[permission.module].push(permission);
                return acc;
            }, {});

            setGroupedPermissions(groupedData);

            // Cập nhật trạng thái của tất cả permissions
            setPermissions(prevPermissions => {
                const updatedPermissions = { ...prevPermissions };
                allPermissions.forEach(permission => {
                    if (updatedPermissions[permission.id] === undefined) {
                        updatedPermissions[permission.id] = false;
                    }
                });
                return updatedPermissions;
            });

        } catch (error) {
            console.error("Lỗi khi lấy quyền hạn:", error);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (isOpen) {
            fetchRoleDetails();
            fetchAllPermissions();
        }
    }, [isOpen, fetchRoleDetails, fetchAllPermissions]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const selectedPermissions = Object.entries(permissions)
                .filter(([_, isSelected]) => isSelected)
                .map(([id]) => parseInt(id));

            const data = {
                name: roleName,
                permissionIds: selectedPermissions,
                isActive: isActive
            };

            const response = await authApi(token).patch(endpoints.getRoleById(roleId), data);
            const updatedRole = response.data.data;

            dispatch(updateRolePermissions({ permissions: updatedRole.permissions }));
            toast.success('Role updated successfully!', { containerId: 'C' });
            onUpdate();
            onClose();
        } catch (error) {
            console.error("Lỗi khi cập nhật vai trò:", error);
            toast.error('Role update failed. Please try again!', { containerId: 'C' });
        }
    };

    const togglePermission = (id) => {
        setPermissions(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const getMethodColor = (method) => {
        const colors = {
            GET: 'text-blue-600',
            POST: 'text-green-600',
            PUT: 'text-yellow-600',
            PATCH: 'text-orange-600',
            DELETE: 'text-red-600'
        };
        return colors[method] || 'text-gray-600';
    };

    return (
        <Drawer open={isOpen} onClose={onClose}>
            <DrawerContent className="h-[100vh] max-h-[100vh] flex flex-col">
                <DrawerHeader className="flex justify-between items-center">
                    <DrawerTitle>Edit Role</DrawerTitle>
                    <DrawerClose asChild>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="h-4 w-4" />
                        </Button>
                    </DrawerClose>
                </DrawerHeader>

                <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-hidden">
                    {isLoading ? (
                        <div className="p-4 space-y-4 overflow-y-auto flex-grow">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="roleName">Role Name</Label>
                                <Skeleton className="w-10 h-6" />
                            </div>
                            <Skeleton className="w-full h-10" />
                            <Skeleton className="w-full h-32" />
                        </div>
                    ) : (
                        <div className="p-4 space-y-4 overflow-y-auto flex-grow">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="roleName">Role Name</Label>
                                <div className="flex items-center space-x-2">
                                    <span>Status</span>
                                    <Switch
                                        checked={isActive}
                                        onCheckedChange={setIsActive}
                                    />
                                </div>
                            </div>
                            <Input
                                id="roleName"
                                value={roleName}
                                onChange={(e) => setRoleName(e.target.value)}
                            />
                            <div>
                                <p className="text-sm text-gray-500">Choose permissions for this role</p>
                                <Accordion type="single" collapsible className="w-full">
                                    {Object.entries(groupedPermissions).map(([module, modulePermissions]) => (
                                        <AccordionItem key={module} value={module}>
                                            <AccordionTrigger>{module}</AccordionTrigger>
                                            <AccordionContent>
                                                {modulePermissions.map((permission) => (
                                                    <div key={permission.id} className="flex items-center justify-between py-2 border-b">
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">{permission.description}</span>
                                                            <div className="flex items-center space-x-2">
                                                                <span className={`font-mono text-xs ${getMethodColor(permission.method)}`}>{permission.method}</span>
                                                                <span className="text-xs text-gray-500">{permission.apiPath}</span>
                                                            </div>
                                                        </div>
                                                        <Switch
                                                            checked={permissions[permission.id] || false}
                                                            onCheckedChange={() => togglePermission(permission.id)}
                                                        />
                                                    </div>
                                                ))}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        </div>
                    )}
                    <DrawerFooter>
                        <Button className="bg-gradient-to-r from-yellow-500 to-orange-600" type="submit">Update Role</Button>
                    </DrawerFooter>
                </form>
            </DrawerContent>
            <ToastContainer position="top-right" autoClose={3000} containerId={"C"} />
        </Drawer>
    );
};

export default EditRoleDrawer;