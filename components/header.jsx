import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux'; 
import Link from 'next/link';
import Image from 'next/image';
import { FaBell, FaSignInAlt } from "react-icons/fa";
import { FiShoppingCart, FiMenu, FiX, FiSearch } from "react-icons/fi";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import UserProfileSheet from './UserProfileSheet';
import { fetchUnreadNotificationsCount } from '@/app/store/NotificationSlice';
import NotificationPopover from '@/components/NotificationPopover';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isProfileSheetOpen, setIsProfileSheetOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const user = useSelector((state) => state.auth.user);
    const unreadCount = useSelector((state) => state.notifications.unreadCount); 
        const dispatch = useDispatch();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (user) {
            console.log("unread c ount",unreadCount)
            dispatch(fetchUnreadNotificationsCount());
        }
    }, [dispatch, user,unreadCount]);

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

    const handleProfileClick = () => {
        setIsProfileSheetOpen(true);
    };

    const headerClass = `fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-sm shadow-md' : 'bg-gradient-to-b from-black/70 to-transparent'
    }`;

    const textColor = isScrolled ? 'text-gray-800' : 'text-white';

    const menuItems = [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
        { name: 'Menus', href: '/menu' },
        { name: 'History Order', href: '/order-history' },
        { name: 'Reservations', href: '/reservation-history' },
        { name: 'Voucher', href: '/voucher' },
    ];

    return (
        <header className={headerClass}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 transition-transform duration-300 hover:scale-105">
                        <Image
                            src="/images/LOGO.png"
                            alt="Logo Nabiti"
                            width={80}
                            height={80}
                            className="transition-all duration-300"
                        />
                    </Link>

                    {/* Navigation Menu */}
                    <nav className="hidden lg:flex space-x-6 items-center">
                        {menuItems.map((item) => (
                            <Link key={item.name} href={item.href}>
                                <span className={`text-sm font-medium hover:text-orange-300 transition-colors duration-300 ${textColor} relative group`}>
                                    {item.name}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-300 transition-all group-hover:w-full"></span>
                                </span>
                            </Link>
                        ))}
                    </nav>

                    {/* Right side buttons */}
                    <div className="flex items-center space-x-4">
                        {/* Search form */}
                        <form onSubmit={handleSearch} className="relative hidden sm:block">
                            <Input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Tìm kiếm món ăn..."
                                className={`w-48 md:w-64 pl-10 rounded-full border-2 border-orange-300 focus:border-orange-500 transition-all duration-300 bg-white/10 backdrop-blur-sm ${textColor}`}
                            />
                            <FiSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${textColor}`} />
                        </form>

                        {/* Cart and Notifications */}
                        <Link href="/cart" className="relative group">
                            <FiShoppingCart className={`text-2xl hover:text-orange-300 transition-colors duration-300 ${textColor}`} />
                            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">0</span>
                        </Link>

                        {/* Notifications */}
                      
                        <NotificationPopover />

                        {/* Book a Table button */}
                        <Button
                            onClick={handleBookTableClick}
                            className="rounded-full bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300 transform hover:scale-105"
                        >
                            Booking now
                        </Button>

                        {/* User Profile or Login button */}
                        {user ? (
                            <>
                                <Button variant="ghost" className="flex items-center space-x-2 hover:bg-transparent border-none" onClick={handleProfileClick}>
                                    <Image
                                        src={user.avatar || "/images/default-avatar.jpg"}
                                        alt="avt"
                                        width={40}
                                        height={40}
                                        className="rounded-full border-2 border-orange-300"
                                    />
                                    <span className={`${textColor} font-medium hidden sm:inline`}>{user.username}</span>
                                </Button>
                                <UserProfileSheet
                                    user={user}
                                    isOpen={isProfileSheetOpen}
                                    onOpenChange={setIsProfileSheetOpen}
                                />
                            </>
                        ) : (
                            <Button onClick={() => router.push('/login')} variant="outline" className="rounded-full border-orange-300 text-orange-500 hover:bg-orange-50 transition-all duration-300">
                                <FaSignInAlt className="mr-2" />
                                Login
                            </Button>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="lg:hidden">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`${textColor} hover:bg-orange-100`}
                        >
                            {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="lg:hidden bg-white shadow-lg rounded-b-lg">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {menuItems.map((item) => (
                            <Link key={item.name} href={item.href}>
                                <span className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-orange-50 transition-colors duration-300">
                                    {item.name}
                                </span>
                            </Link>
                        ))}

                        <form onSubmit={handleSearch} className="px-3 py-2">
                            <div className="relative">
                                <Input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Tìm kiếm món ăn..."
                                    className="w-full pl-10 rounded-full border-2 border-orange-300 focus:border-orange-500 transition-all duration-300 bg-white/10 backdrop-blur-sm"
                                />
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700" />
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </header>
    );
}
