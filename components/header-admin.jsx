'use client'

import { useState } from "react";
import Image from "next/image";
import { FaBell } from "react-icons/fa";
import { useSelector } from "react-redux";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function HeaderAdmin() {
    const user = useSelector((state) => state.auth.user);

    return (
        <main className="ml-64 flex-1 p-6 bg-gray-100 flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h1>
                <div className="text-2xl text-gray-600 cursor-pointer hover:text-gray-800 transition-colors">
                    <FaBell />
                </div>
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger> <div className="flex items-center space-x-4 relative">
                    <div className="flex flex-col text-right">
                        <p className="font-semibold text-gray-800">{user.username}</p>
                        <p className="text-gray-500">{user.roleName}</p>
                    </div>
                    <div>
                        <Image
                            src="/images/mem.jpg"
                            alt="avt"
                            width={40}
                            height={40}
                            className="rounded-full border border-gray-300 cursor-pointer"

                        />
                    </div>
                </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Log out</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>


        </main>
    );
}
