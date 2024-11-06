import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { logout, updateUser } from '@/app/store/authSlice';
import { UserCircle, Mail, Phone, UserCog, LogOut } from 'lucide-react';
import { authApi, endpoints } from '@/app/configs/API';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Camera } from 'lucide-react';
const UserProfileSheet = ({ user, isOpen, onOpenChange }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState({ ...user });
    const [isLoading, setIsLoading] = useState(false);
    const token = useSelector((state) => state.auth.token);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const handleLogout = () => {
        dispatch(logout());
        router.push('/');
    };
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setIsDialogOpen(true); // Hiển thị dialog khi có ảnh mới
        }
    };
    const handleUploadAvatar = async () => {
        if (!selectedFile) {
            toast.info('No avatar selected for upload', { containerId: "H" });
            return;
        }

        const avatarData = new FormData();
        avatarData.append('avatar', selectedFile);

        try {
            const response = await authApi(token).post(endpoints.uploadAVT, avatarData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });


            dispatch(updateUser(response.data.data));
            toast.success('Avatar uploaded successfully', { containerId: "H" });
            setIsDialogOpen(false); 

        } catch (error) {
            console.error('Error uploading avatar:', error.response ? error.response.data : error.message);
            toast.error('Failed to upload avatar. Please try again later.', { containerId: "H" });
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const updatedFields = {};
            Object.keys(editedUser).forEach(key => {
                if (editedUser[key] !== user[key]) {
                    updatedFields[key] = editedUser[key];
                }
            });

            if (Object.keys(updatedFields).length === 0) {
                toast.info("No changes detected.");
                setIsLoading(false);
                return;
            }

            const response = await authApi(token).patch(endpoints.getUserById(user.id), updatedFields);
            if (response.data && response.data.data) {
                dispatch(updateUser(response.data.data));
                toast.success("Profile updated successfully!", { containerId: 'C' });
                setIsEditing(false);
                onOpenChange(false);
            } else {
                throw new Error("Invalid response format");
            }
        } catch (error) {
            console.error("Update user failed:", error);
            toast.error(error.response?.data?.message || "Failed to update profile. Please try again.", { containerId: 'C' });
        } finally {
            setIsLoading(false);
        }
    };


    const handleCancel = () => {
        setEditedUser({ ...user });
        setIsEditing(false);
    };

    const handleChange = (e) => {
        setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
    };

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent className="bg-white p-6 rounded-lg shadow-md">
                <SheetHeader>
                    <SheetTitle className="text-2xl font-semibold text-gray-800">User Profile</SheetTitle>
                    <SheetDescription className="text-gray-600">Your account details</SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                    <div className="flex justify-center">
                        <div className="relative w-24 h-24">
                            <Image
                                src={user.avatar || "/images/default-avatar.jpg"}
                                alt="Profile Picture"
                                layout="fill"
                                objectFit="cover"
                                className="rounded-full border-2 border-orange-200"
                            />
                            {/* Icon máy ảnh */}
                            <label className="absolute bottom-0 right-0 p-1 bg-white rounded-full cursor-pointer">
                                <Camera className="text-orange-500" size={20} />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>
                    {isEditing ? (
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <UserCircle className="text-orange-500" />
                                <Input
                                    name="fullName"
                                    value={editedUser.fullName}
                                    onChange={handleChange}
                                    placeholder="Full Name"
                                    className="flex-1 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <UserCog className="text-orange-500" />
                                <Input
                                    name="username"
                                    value={editedUser.username}
                                    onChange={handleChange}
                                    placeholder="Username"
                                    className="flex-1 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Mail className="text-orange-500" />
                                <Input
                                    name="email"
                                    value={editedUser.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    className="flex-1 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Phone className="text-orange-500" />
                                <Input
                                    name="phone"
                                    value={editedUser.phone}
                                    onChange={handleChange}
                                    placeholder="Phone Number"
                                    className="flex-1 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                                />
                            </div>
                            <div className="flex space-x-2">
                                <Button
                                    onClick={handleSave}
                                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Saving...' : 'Save'}
                                </Button>
                                <Button
                                    onClick={handleCancel}
                                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-white"
                                    disabled={isLoading}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <UserCircle className="text-orange-500" />
                                <p className="flex-1 text-gray-800"><strong>Full Name:</strong> {user.fullName}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <UserCog className="text-orange-500" />
                                <p className="flex-1 text-gray-800"><strong>Username:</strong> {user.username}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Mail className="text-orange-500" />
                                <p className="flex-1 text-gray-800"><strong>Email:</strong> {user.email}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Phone className="text-orange-500" />
                                <p className="flex-1 text-gray-800"><strong>Phone:</strong> {user.phone}</p>
                            </div>
                            <Button onClick={handleEdit} className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                                Edit Profile
                            </Button>
                        </div>
                    )}
                    <Button onClick={handleLogout} className="w-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center space-x-2">
                        <LogOut size={18} />
                        <span>Logout</span>
                    </Button>
                    {/* Dialog xác nhận */}
                    {isDialogOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
                                <h3 className="text-lg font-semibold mb-4">Do you want to change your avatar?</h3>
                                <div className="flex justify-end space-x-2">
                                    <Button onClick={() => setIsDialogOpen(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800">
                                        No
                                    </Button>
                                    <Button onClick={handleUploadAvatar} className="bg-orange-500 hover:bg-orange-600 text-white" disabled={isLoading}>
                                        {isLoading ? 'Uploading...' : 'Yes'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </SheetContent>
            <ToastContainer containerId="C" position="top-right" autoClose={3000} />
        </Sheet>
    );
};

export default UserProfileSheet;
