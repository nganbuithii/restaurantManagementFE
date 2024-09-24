import React, { useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { authApi, endpoints } from '@/app/configs/API';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreatePermissionDrawer = ({ isOpen, onClose, onCreatePermission }) => {
    const [apiPath, setApiPath] = useState('');
    const [method, setMethod] = useState('GET');
    const [module, setModule] = useState('');
    const [description, setDescription] = useState('');
    const token = useSelector((state) => state.auth.token);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newPermission = {
            apiPath,
            method,
            module,
            description
        };
        
        try {
            const response = await authApi(token).post(endpoints.getAllPermission, newPermission)
            console.log("New permission:", newPermission);
            console.log("create thành công", response.data)
            onCreatePermission(newPermission); 
            toast.success('Ingredient added successfully!', { containerId: 'B' });
            onClose();
        } catch (error) {
            console.error("Error creating permission:", error);
            if (error.response && error.response.data) {
                toast.error(`Error creating permission ${error.response.data.message || 'Something went wrong'}`, { containerId: 'B' });
            } else {
                toast.error('Error creating permission', { containerId: 'B' });
            }
        }
    };

    return (
        <Drawer open={isOpen} onClose={onClose}>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Create New Permission</DrawerTitle>
                    <DrawerClose onClick={onClose} />
                </DrawerHeader>
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label htmlFor="apiPath" className="block text-sm font-medium text-gray-700">API Path</label>
                        <Input
                            id="apiPath"
                            value={apiPath}
                            onChange={(e) => setApiPath(e.target.value)}
                            placeholder="e.g., /api/inventory"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="method" className="block text-sm font-medium text-gray-700">Method</label>
                        <Select value={method} onValueChange={setMethod}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select method" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="GET">GET</SelectItem>
                                <SelectItem value="POST">POST</SelectItem>
                                <SelectItem value="PUT">PUT</SelectItem>
                                <SelectItem value="DELETE">DELETE</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label htmlFor="module" className="block text-sm font-medium text-gray-700">Module</label>
                        <Select value={module} onValueChange={setModule}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select module" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="User">User</SelectItem>
                                <SelectItem value="Voucher">Voucher</SelectItem>
                                <SelectItem value="Menu-Item">Menu-Item</SelectItem>
                                <SelectItem value="Menu">Menu</SelectItem>
                                <SelectItem value="Inventory">Inventory</SelectItem>
                                <SelectItem value="Ingredient">Ingredient</SelectItem>
                                <SelectItem value="Order">Order</SelectItem>
                                <SelectItem value="Reservation">Reservation</SelectItem>
                                <SelectItem value="Warehouse-slip">Warehouse Slip</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g., Permission to read inventory data"
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full bg-gradient-to-r from-yellow-500 to-orange-600">Create Permission</Button>
                </form>
            </DrawerContent>
            <ToastContainer position="top-right" autoClose={3000} containerId="B" />
        </Drawer>
    );
};

export default CreatePermissionDrawer;