import { useState } from "react";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
    SheetDescription,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import { updateUser } from "@/app/store/authSlice";
import { authApi, endpoints } from "@/app/configs/API";
import Image from "next/image";
import { FaCamera } from "react-icons/fa"; // Import camera icon

export default function ProfileDrawer({ isOpen, setIsOpen }) {
    const user = useSelector((state) => state.auth.user);
    const token = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        email: user?.email || "",
        fullName: user?.fullName || "",
        phone: user?.phone || "",
        username: user?.username || "",
        avatar: null,
    });
    
    const [previewImage, setPreviewImage] = useState(user?.avatar || "/images/default-avatar.jpg");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prevData => ({
                ...prevData,
                avatar: file
            }));
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const updateUserProfile = async () => {
        try {
            const updatedFields = new FormData();
            let avatarUpdated = false;
    
            Object.keys(formData).forEach((key) => {
                if (formData[key] && formData[key] !== user[key]) {
                    updatedFields.append(key, formData[key]);
                }
            });
    
            if (formData.avatar) {
                avatarUpdated = true;
                const avatarData = new FormData();
                avatarData.append('avatar', formData.avatar);
    
                const avatarResponse = await authApi(token).post(endpoints.uploadAVT, avatarData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
    
                console.log('Avatar upload response:', avatarResponse.data);
            }
    
            if (!updatedFields.has('email') && !updatedFields.has('fullName') && !updatedFields.has('phone') && !avatarUpdated) {
                toast.info('No changes to update', { containerId: "H" });
                return;
            }
    
            const response = await authApi(token).patch(endpoints.getUserById(user.id), updatedFields, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
    
            dispatch(updateUser(response.data.data));
            toast.success('Profile updated successfully', { containerId: "H" });
            setIsOpen(false);
        } catch (error) {
            console.error('Error updating profile:', error.response ? error.response.data : error.message);
            toast.error('Failed to update profile. Please try again later.', { containerId: "H" });
        }
    };
    
    return (
        <>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetContent className="p-6 space-y-4 bg-white shadow-lg rounded-lg">
                    <SheetHeader>
                        <SheetTitle className="text-2xl font-semibold">User Profile</SheetTitle>
                        <SheetDescription className="text-gray-600">
                            View and edit your profile information.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="flex flex-col items-center">
                        <div className="relative">
                            <Image
                                src={previewImage}
                                alt="avatar"
                                width={120}
                                height={120}
                                className="rounded-full border border-gray-300 shadow-md"
                            />
                            <label htmlFor="avatar" className="absolute bottom-0 right-0 mb-2 mr-2 bg-gray-800 rounded-full p-2 cursor-pointer text-white flex items-center justify-center">
                                <FaCamera className="text-xl" />
                                <input type="file" id="avatar" onChange={handleAvatarChange} className="hidden" accept="image/*" />
                            </label>
                        </div>
                        <div className="w-full mt-4 space-y-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right">
                                    Email
                                </Label>
                                <Input id="email" name="email" value={formData.email} onChange={handleInputChange} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="fullName" className="text-right">
                                    Full Name
                                </Label>
                                <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="phone" className="text-right">
                                    Phone
                                </Label>
                                <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="username" className="text-right">
                                    Username
                                </Label>
                                <Input id="username" name="username" value={formData.username} onChange={handleInputChange} className="col-span-3" />
                            </div>
                        </div>
                    </div>
                    <SheetFooter className="flex justify-end">
                        <Button type="submit" onClick={updateUserProfile} className="bg-gradient-to-r from-yellow-500 to-orange-600">Save changes</Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
            <ToastContainer containerId="H" position="top-right" autoClose={3000} />
        </>
    );
}
