'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaBell } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { FaSignInAlt } from "react-icons/fa";
import { FaUserPen } from 'react-icons/fa6';
import { Button } from './ui/button';

export default function Header() {
    return (
        <header className=" text-white shadow-md">
   
            <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    <div className="flex-shrink-0">
                        <Link href="/">
                            <Image
                                src="/images/LOGO.png"
                                alt="Logo"
                                width={80}
                                height={80}
                            />
                        </Link>
                    </div>


                    <nav className="flex space-x-4">
                        <Link href="/home" className="text-black hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                            Home
                        </Link>
                        <Link href="/about" className="text-black hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                            About
                        </Link>
                        <Link href="/menu" className="text-black hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                            Menu
                        </Link>
                        <Link href="/invoice-history" className="text-black hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                            History Order
                        </Link>
                        <Link href="/cart" className="text-black hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                            <FiShoppingCart />
                        </Link>
                        <Link href="/notifications" className="text-black hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">

                            <FaBell />
                        </Link>

                    </nav>
                    {/* <Button>
                        Đặt bàn
                    </Button> */}

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                            <FaSignInAlt className="text-lg text-black" />
                            <Link href="/register" className="text-black font-medium hover:underline">
                                Sign In
                            </Link>
                        </div>
                        <div className="flex items-center space-x-2">
                            <FaUserPen className="text-lg text-black" />
                            <Link href="/logout" className="text-black font-medium hover:underline">
                                Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
