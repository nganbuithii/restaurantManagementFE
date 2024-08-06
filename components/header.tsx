'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaBell } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { FaSignInAlt } from "react-icons/fa";
import { FaUserPen } from 'react-icons/fa6';

export default function Header() {
    return (
        <header className="bg-gray-800 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                        <Link href="/" className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                            Home
                        </Link>
                        <Link href="/about" className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                            About
                        </Link>
                        <Link href="/menu" className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                            Menu
                        </Link>
                        <Link href="/invoice-history" className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                            History Order
                        </Link>
                        <Link href="/cart" className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                            <FiShoppingCart />
                        </Link>
                        <Link href="/notifications" className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">

                            <FaBell />
                        </Link>

                    </nav>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                            <FaSignInAlt className="text-lg" />
                            <Link href="/register" className="text-white font-medium hover:underline">
                                Sign In
                            </Link>
                        </div>
                        <div className="flex items-center space-x-2">
                            <FaUserPen className="text-lg" />
                            <Link href="/logout" className="text-white font-medium hover:underline">
                                Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
