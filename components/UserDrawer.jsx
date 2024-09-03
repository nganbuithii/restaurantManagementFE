import { useState, useEffect } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useSelector } from 'react-redux';
import { FaTimes } from 'react-icons/fa'; 
import { authApi, endpoints } from '@/app/configs/API';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function UserDrawer({ isOpen, onClose,onUserCreated }) {
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [roleId, setRoleId] = useState(''); 
    const [roles, setRoles] = useState([]);
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await authApi(token).get(endpoints.getAllRoles);
                console.log("GET ROLE THÀNH CÔNG");
                setRoles(response.data.data); 
            } catch (error) {
                console.error("Failed to fetch roles:", error);
            }
        };

        if (isOpen) {
            fetchRoles();
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        console.log({ fullName, username, email, password, phone, roleId });

        try {
            const response = await authApi(token).post(endpoints.getAllUser, {
                fullName,
                username,
                email,
                password,
                phone,
                roleId 
            });
            console.log("Tạo người dùng thành công:", response.data);
            toast.success('Create user successfully!');
            onClose(); 
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(`Error: ${error.response.data.message || 'Something went wrong'}`);
            } else {
                toast.error('An unexpected error occurred.');
            }
            console.error("Failed to create user:", error);
        }
    };

    return (
        <>
        <Drawer open={isOpen} onClose={onClose}>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Add New User</DrawerTitle>
                    <Button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300">
                        <FaTimes />
                    </Button>
                </DrawerHeader>
                <div className="p-6 mb-4">
                    <Input
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="mb-2"
                    />
                    <Input
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="mb-2"
                    />
                    <Input
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mb-2"
                    />
                    <Input
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mb-2"
                    />
                    <Input
                        placeholder="Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="mb-2"
                    />
                    <div className="mb-4">
                        <Select onValueChange={(value) => setRoleId(value)} value={roleId}>
                            <SelectTrigger className="w-full bg-white border border-gray-300 rounded-lg shadow-sm">
                                <SelectValue placeholder="Select Role" />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map((roleOption) => (
                                    <SelectItem key={roleOption.id} value={roleOption.id}>
                                        {roleOption.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DrawerFooter>
                    <Button onClick={handleSubmit} className="bg-blue-500 text-white">
                        Submit
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
        <ToastContainer position="top-right" autoClose={3000} />
        </>
    );
}
