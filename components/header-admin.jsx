import Image from "next/image";
import { FaBell } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { logout } from "@/app/store/authSlice";
import ProfileDrawer from "./ProfileDrawer"; // Import the new ProfileDrawer component

export default function HeaderAdmin() {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const router = useRouter();
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        router.push('/admin/login');
    };

    return (
        <main suppressHydrationWarning className="ml-64 flex-1 p-6 bg-gray-100 flex items-center justify-between shadow-md relative">
            {user ? (
                <>
                    <div className="flex items-center space-x-4">
                        <h1 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h1>
                        <div className="text-2xl text-gray-600 cursor-pointer hover:text-gray-800 transition-colors">
                            <FaBell />
                        </div>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="absolute top-0 right-0 mt-4 mr-4 flex items-center space-x-4 cursor-pointer">
                                <div className="flex flex-col text-right">
                                    <p className="font-semibold text-gray-800">{user.username}</p>
                                    <p className="text-gray-500">{user.roleName}</p>
                                </div>
                                <div>
                                    <Image
                                        src={user.avatar || "/images/default-avatar.jpg"}
                                        alt="avatar"
                                        width={40}
                                        height={40}
                                        className="rounded-full border border-gray-300"
                                    />
                                </div>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onSelect={() => setIsSheetOpen(true)}>Profile</DropdownMenuItem>
                            <DropdownMenuItem onSelect={handleLogout}>Log out</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <ProfileDrawer isOpen={isSheetOpen} setIsOpen={setIsSheetOpen} />
                </>
            ) : (
                <div>User not exist</div>
            )}
        </main>
    );
}
