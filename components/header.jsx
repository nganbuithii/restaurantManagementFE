import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import Image from 'next/image';
import { FaBell, FaSignInAlt, FaUserCircle } from "react-icons/fa";
import { FiShoppingCart, FiMenu, FiX, FiSearch } from "react-icons/fi";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleBookTableClick = () => {
        if (user) {
            router.push('/booking');
        } else {
            localStorage.setItem('previousPage', '/booking');
            router.push("/login");
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        router.push('/');
    };

    const headerClass = `fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
        } ${isBookingPage ? 'bg-orange-500' : ''}`;

    const textColor = isBookingPage ? 'text-white' : (isScrolled ? 'text-gray-800' : 'text-white');

    return (
        <header className={headerClass}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <Link href="/" className="flex-shrink-0">
                        <Image
                            src="/images/LOGO.png"
                            alt="Logo"
                            width={80}
                            height={80}
                            className="transition-all duration-300"
                        />
                    </Link>

                    <nav className="hidden lg:flex space-x-8 items-center">
                        {['Home', 'About', 'Menu', 'Order History'].map((item) => (
                            <Link key={item} href={`/${item.toLowerCase().replace(' ', '-')}`}>
                                <span className={`text-sm font-medium hover:text-orange-300 transition-colors duration-300 ${textColor}`}>
                                    {item}
                                </span>
                            </Link>
                        ))}
                    </nav>

                    <div className="hidden lg:flex items-center space-x-6">
                        <form onSubmit={handleSearch} className="relative">
                            <Input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search dishes..."
                                className={`w-64 pl-10 ${isBookingPage ? 'bg-orange-400 placeholder-white' : ''}`}
                            />
                            <FiSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${textColor}`} />
                        </form>
                        <Link href="/cart">
                            <FiShoppingCart className={`text-2xl hover:text-orange-300 transition-colors duration-300 ${textColor}`} />
                        </Link>
                        <Link href="/notifications">
                            <FaBell className={`text-2xl hover:text-orange-300 transition-colors duration-300 ${textColor}`} />
                        </Link>
                        <Button
                            onClick={handleBookTableClick}
                            variant={isBookingPage ? 'secondary' : 'default'}
                            className="rounded-full"
                        >
                            Book a Table
                        </Button>
                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="flex items-center space-x-2 hover:bg-transparent border-none">
                                        <Image
                                            src={user.avatar || "/images/default-avatar.jpg"}
                                            alt="avatar"
                                            width={32}
                                            height={32}
                                            className="rounded-full"
                                        />
                                        <span className={textColor}>{user.username}</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onSelect={() => router.push('/profile')}>Profile</DropdownMenuItem>
                                    <DropdownMenuItem onSelect={handleLogout}>Log out</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button onClick={() => router.push('/login')} variant="outline" className="rounded-full">
                                <FaSignInAlt className="mr-2" />
                                Login
                            </Button>
                        )}
                    </div>

                    <div className="lg:hidden">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={textColor}
                        >
                            {isMenuOpen ? <FiX /> : <FiMenu />}
                        </Button>
                    </div>
                </div>
            </div>

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
                                <Input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search dishes..."
                                    className="w-full pl-10"
                                />
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>
                        </form>
                    </div>
                    <div className="pt-4 pb-3 border-t border-gray-200">
                        <div className="flex items-center justify-around px-5">
                            <Link href="/cart">
                                <FiShoppingCart className="text-2xl text-gray-600 hover:text-orange-500" />
                            </Link>
                            <Link href="/notifications">
                                <FaBell className="text-2xl text-gray-600 hover:text-orange-500" />
                            </Link>
                            <Button
                                onClick={handleBookTableClick}
                                className="rounded-full"
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
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start"
                                        onClick={() => router.push('/profile')}
                                    >
                                        Profile
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => router.push('/login')}
                                >
                                    <FaSignInAlt className="mr-2" />
                                    Login
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}