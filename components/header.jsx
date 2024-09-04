'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaBell, FaSignInAlt, FaUserCircle } from "react-icons/fa";
import { FiShoppingCart, FiMenu, FiX, FiSearch } from "react-icons/fi";
import { Button } from './ui/button';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/app/store/authSlice';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const isBookingPage = pathname === '/booking';

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        // Cleanup function to remove event listener
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleBookTableClick = () => {
        router.push('/booking');
    };

    const getHeaderColor = () => {
        if (isBookingPage) {
            return 'bg-orange-500';
        }
        return isScrolled ? 'bg-white' : 'bg-transparent';
    };

    const getTextColor = () => {
        if (isBookingPage) {
            return 'text-white';
        }
        return isScrolled ? 'text-gray-800' : 'text-white';
    };

    const handleLogout = () => {
        dispatch(logout());
        router.push('/login');
    };

    return (
        <header className={`fixed w-full z-50 transition-all duration-300 ${getHeaderColor()} ${isScrolled ? 'shadow-md' : ''}`}>
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
                    <nav className="hidden lg:flex space-x-8 items-center">
                        {['Home', 'About', 'Menu', 'Order History'].map((item) => (
                            <Link key={item} href={`/${item.toLowerCase().replace(' ', '-')}`}>
                                <span className={`text-sm font-medium hover:text-orange-300 transition-colors duration-300 ${getTextColor()}`}>
                                    {item}
                                </span>
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop Action Buttons */}
                    <div className="hidden lg:flex items-center space-x-6">
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search dishes..."
                                className={`border rounded-full pl-10 pr-4 py-2 ${isBookingPage ? 'border-white bg-orange-400 placeholder-white' : isScrolled ? 'border-gray-300 bg-gray-100' : 'border-white bg-white bg-opacity-20'} focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all duration-300`}
                            />
                            <FiSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${getTextColor()}`} />
                        </form>
                        <Link href="/cart">
                            <FiShoppingCart className={`text-2xl hover:text-orange-300 transition-colors duration-300 ${getTextColor()}`} />
                        </Link>
                        <Link href="/notifications">
                            <FaBell className={`text-2xl hover:text-orange-300 transition-colors duration-300 ${getTextColor()}`} />
                        </Link>
                        <Button 
                            onClick={handleBookTableClick} 
                            className={`${isBookingPage ? 'bg-white text-orange-500 hover:bg-orange-100' : 'bg-orange-500 hover:bg-orange-600 text-white'} px-4 py-2 rounded-full transition-colors duration-300`}
                        >
                            Book a Table
                        </Button>
                        {user ? (
                            <div className="relative group">
                                <button className="flex items-center space-x-2">
                                    <FaUserCircle className={`text-2xl ${getTextColor()}`} />
                                    <span className={`font-medium ${getTextColor()}`}>{user.username}</span>
                                </button>
                                <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-xl z-20 hidden group-hover:block">
                                    <Link href="/profile">
                                        <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-100">Profile</span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-100"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link href="/login">
                                <Button className={`${isBookingPage ? 'bg-white text-orange-500' : 'bg-orange-500 text-white'} hover:bg-orange-600 hover:text-white px-4 py-2 rounded-full transition-colors duration-300`}>
                                    <FaSignInAlt className="mr-2" />
                                    Login
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`text-3xl focus:outline-none ${getTextColor()}`}
                        >
                            {isMenuOpen ? <FiX /> : <FiMenu />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden bg-white">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {['Home', 'About', 'Menu', 'Order History'].map((item) => (
                            <Link key={item} href={`/${item.toLowerCase().replace(' ', '-')}`}>
                                <span className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-orange-50 transition-colors duration-300">
                                    {item}
                                </span>
                            </Link>
                        ))}
                        <form onSubmit={handleSearch} className="px-3 py-2">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search dishes..."
                                    className="w-full border rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
                                />
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>
                        </form>
                    </div>
                    <div className="pt-4 pb-3 border-t border-gray-200">
                        <div className="flex items-center px-5 space-x-4">
                            <Link href="/cart">
                                <FiShoppingCart className="text-2xl text-gray-600 hover:text-orange-500" />
                            </Link>
                            <Link href="/notifications">
                                <FaBell className="text-2xl text-gray-600 hover:text-orange-500" />
                            </Link>
                            <Button 
                                onClick={handleBookTableClick} 
                                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full transition-colors duration-300"
                            >
                                Book a Table
                            </Button>
                        </div>
                        <div className="mt-3 px-2 space-y-1">
                            {user ? (
                                <>
                                    <span className="block px-3 py-2 rounded-md text-base font-medium text-gray-700">
                                        Welcome, {user.username}
                                    </span>
                                    <Link href="/profile">
                                        <span className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-orange-50">
                                            Profile
                                        </span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-orange-50"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link href="/login">
                                    <span className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-orange-50">
                                        Login
                                    </span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}