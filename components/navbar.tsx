"use client";

import { usePathname } from 'next/navigation';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink } from '@radix-ui/react-navigation-menu';
import Image from 'next/image';

export default function Navbar() {
    const pathname = usePathname();


    return (
        <nav className="w-64 bg-orange-400 text-black h-screen fixed top-0 left-0 shadow-md">
            <div className="flex flex-col h-full">
                <div className="text-2xl font-bold p-4 border-b border-gray-700 bg-orange-500 flex items-center">
                    <Image src="/images/1.png" alt="logo" width={50} height={50} />
                    <p className="ml-2">NABITI RESTAURANT</p>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <NavigationMenu>
                        <NavigationMenuItem>
                            <NavigationMenuLink
                                href="/admin"
                                className={`block px-4 py-3 rounded-lg transition-colors duration-200 ${pathname === '/admin' ? 'bg-gray-700 text-white' : 'hover:bg-gray-600'}`}
                            >
                                Dashboard
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuLink
                                href="/admin/users"
                                className={`block px-4 py-3 rounded-lg transition-colors duration-200 ${pathname === '/admin/users' ? 'bg-gray-700 text-white' : 'hover:bg-gray-600'}`}
                            >
                                Users
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuLink
                                href="/admin/orders"
                                className={`block px-4 py-3 rounded-lg transition-colors duration-200 ${pathname === '/admin/orders' ? 'bg-gray-700 text-white' : 'hover:bg-gray-600'}`}
                            >
                                Orders
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink
                                href="/admin/settings"
                                className={`block px-4 py-3 rounded-lg transition-colors duration-200 ${pathname === '/admin/settings' ? 'bg-gray-700 text-white' : 'hover:bg-gray-600'}`}
                            >
                                Settings
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenu>
                </div>
            </div>
        </nav>
    );
}
