'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaBell, FaSignInAlt } from "react-icons/fa";
import { FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
import { Button } from './ui/button';
import { FaRegUser } from "react-icons/fa";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0">
                        <Link href="/">
                            <Image
                                src="/images/LOGO.png"
                                alt="Logo"
                                width={80}
                                height={80}
                                className="transition-all duration-300"
                            />
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-8">
                        {['Home', 'About', 'Menu', 'History Order'].map((item) => (
                            <Link key={item} href={`/${item.toLowerCase().replace(' ', '-')}`}>
                                <span className={`text-sm font-medium hover:text-orange-500 transition-colors duration-300 ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
                                    {item}
                                </span>
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop Action Buttons */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link href="/cart">
                            <FiShoppingCart className={`text-2xl hover:text-orange-500 transition-colors duration-300 ${isScrolled ? 'text-gray-800' : 'text-white'}`} />
                        </Link>
                        <Link href="/notifications">
                            <FaBell className={`text-2xl hover:text-orange-500 transition-colors duration-300 ${isScrolled ? 'text-gray-800' : 'text-white'}`} />
                        </Link>
                        <Button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full transition-colors duration-300">
                            Book a Table
                        </Button>
                        <div className="flex items-center space-x-4">
                            <Link href="/login" className="flex items-center space-x-1">
                                <FaSignInAlt className={`text-lg ${isScrolled ? 'text-gray-800' : 'text-white'}`} />
                                <span className={`text-sm font-medium hover:text-orange-500 transition-colors duration-300 ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
                                    Login
                                </span>
                            </Link>
                            <Link href="/register" className="flex items-center space-x-1">
                            <FaRegUser  className={`text-lg ${isScrolled ? 'text-gray-800' : 'text-white'}`} />
                                <span className={`text-sm font-medium hover:text-orange-500 transition-colors duration-300 ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
                                    Register
                                </span>
                            </Link>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`text-3xl focus:outline-none ${isScrolled ? 'text-gray-800' : 'text-white'}`}
                        >
                            {isMenuOpen ? <FiX /> : <FiMenu />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {['Home', 'About', 'Menu', 'History Order'].map((item) => (
                            <Link key={item} href={`/${item.toLowerCase().replace(' ', '-')}`}>
                                <span className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:text-orange-500 hover:bg-gray-100 transition-colors duration-300">
                                    {item}
                                </span>
                            </Link>
                        ))}
                    </div>
                    <div className="pt-4 pb-3 border-t border-gray-200">
                        <div className="flex items-center px-5 space-x-4">
                            <Link href="/cart">
                                <FiShoppingCart className="text-2xl text-gray-800 hover:text-orange-500 transition-colors duration-300" />
                            </Link>
                            <Link href="/notifications">
                                <FaBell className="text-2xl text-gray-800 hover:text-orange-500 transition-colors duration-300" />
                            </Link>
                        </div>
                        <div className="mt-3 px-2 space-y-1">
                            <Link href="/login">
                                <span className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:text-orange-500 hover:bg-gray-100 transition-colors duration-300">
                                    Login
                                </span>
                            </Link>
                            <Link href="/register">
                                <span className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:text-orange-500 hover:bg-gray-100 transition-colors duration-300">
                                    Register
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}