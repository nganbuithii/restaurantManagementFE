'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaBell, FaSignInAlt } from "react-icons/fa";
import { FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
import { Button } from './ui/button';
import { FaRegUser } from "react-icons/fa";
import { useRouter, usePathname } from 'next/navigation';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();
    const pathname = usePathname();

    const isBookingPage = pathname === '/booking';

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
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
                    <nav className="hidden md:flex space-x-8 items-center">
                        {['Home', 'About', 'Menu', 'History Order'].map((item) => (
                            <Link key={item} href={`/${item.toLowerCase().replace(' ', '-')}`}>
                                <span className={`text-sm font-medium hover:text-orange-300 transition-colors duration-300 ${getTextColor()}`}>
                                    {item}
                                </span>
                            </Link>
                        ))}
                        <form onSubmit={handleSearch} className="flex items-center space-x-2 ml-8">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search dishes..."
                                className={`border rounded-full px-4 py-2 ${isBookingPage ? 'border-white bg-orange-400' : isScrolled ? 'border-gray-400 bg-white' : 'border-white bg-transparent'} focus:outline-none`}
                            />
                            <Button type="submit" className={`${isBookingPage ? 'bg-white text-orange-500' : 'bg-orange-500 text-white'} px-4 py-2 rounded-full transition-colors duration-300 hover:bg-orange-600 hover:text-white`}>
                                Search
                            </Button>
                        </form>
                    </nav>

                    {/* Desktop Action Buttons */}
                    <div className="hidden md:flex items-center space-x-6">
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
                        <div className="flex items-center space-x-4">
                            <Link href="/login" className="flex items-center space-x-1">
                                <FaSignInAlt className={getTextColor()} />
                                <span className={`text-sm font-medium hover:text-orange-300 transition-colors duration-300 ${getTextColor()}`}>
                                    Login
                                </span>
                            </Link>
                            <Link href="/register" className="flex items-center space-x-1">
                                <FaRegUser className={getTextColor()} />
                                <span className={`text-sm font-medium hover:text-orange-300 transition-colors duration-300 ${getTextColor()}`}>
                                    Register
                                </span>
                            </Link>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
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
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {['Home', 'About', 'Menu', 'History Order'].map((item) => (
                            <Link key={item} href={`/${item.toLowerCase().replace(' ', '-')}`}>
                                <span className={`block px-3 py-2 rounded-md text-base font-medium hover:text-orange-300 hover:bg-orange-100 transition-colors duration-300 ${getTextColor()}`}>
                                    {item}
                                </span>
                            </Link>
                        ))}
                        <form onSubmit={handleSearch} className="flex items-center space-x-2 px-3 py-2">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search dishes..."
                                className={`border rounded-full px-4 py-2 ${isBookingPage ? 'border-white bg-orange-400' : 'border-gray-400 bg-white'} focus:outline-none`}
                            />
                            <Button type="submit" className={`${isBookingPage ? 'bg-white text-orange-500' : 'bg-orange-500 text-white'} px-4 py-2 rounded-full hover:bg-orange-600 hover:text-white`}>
                                Search
                            </Button>
                        </form>
                    </div>
                    <div className={`pt-4 pb-3 border-t ${isBookingPage ? 'border-orange-400' : 'border-gray-200'}`}>
                        <div className="flex items-center px-5 space-x-4">
                            <Link href="/cart">
                                <FiShoppingCart className={`text-2xl hover:text-orange-300 transition-colors duration-300 ${getTextColor()}`} />
                            </Link>
                            <Link href="/notifications">
                                <FaBell className={`text-2xl hover:text-orange-300 transition-colors duration-300 ${getTextColor()}`} />
                            </Link>
                        </div>
                        <div className="mt-3 px-2 space-y-1">
                            <Link href="/login">
                                <span className={`block px-3 py-2 rounded-md text-base font-medium hover:text-orange-300 hover:bg-orange-100 transition-colors duration-300 ${getTextColor()}`}>
                                    Login
                                </span>
                            </Link>
                            <Link href="/register">
                                <span className={`block px-3 py-2 rounded-md text-base font-medium hover:text-orange-300 hover:bg-orange-100 transition-colors duration-300 ${getTextColor()}`}>
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