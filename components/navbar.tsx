"use client";

import { usePathname } from 'next/navigation';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink } from '@radix-ui/react-navigation-menu';
import Image from 'next/image';
import { FaStore, FaUsers } from 'react-icons/fa';
import { IoMdHome, IoMdLogOut } from 'react-icons/io';
import { TbBrandGoogleAnalytics, TbReportAnalytics } from "react-icons/tb";
import { FaMoneyBillTransfer, FaReplyd, FaUserGroup } from 'react-icons/fa6';
import { BiSolidDiscount } from "react-icons/bi";
import { MdFastfood, MdOutlineSecurity } from "react-icons/md";
export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="w-64 bg-orange-400 text-black h-screen fixed top-0 left-0 shadow-md">
            <div className="flex flex-col h-full">
                <div className="text-2xl font-bold p-4 border-b border-gray-700 bg-orange-500 flex items-center">
                    <Image src="/images/1.png" alt="logo" width={50} height={50} />
                    <p className="ml-2">NABITI ADMIN RESTAURANT</p>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <NavigationMenu className="list-none p-0">
                        <NavigationMenuItem className="p-0">
                            <NavigationMenuLink
                                href="/admin"
                                className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${pathname === '/admin' ? 'bg-gray-700 text-white' : 'hover:bg-orange-300'}`}
                            >
                                <IoMdHome />
                                Trang chủ
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem className="p-0">
                            <NavigationMenuLink
                                href="/admin/permission"
                                className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${pathname === '/admin/permission' ? 'bg-gray-700 text-white' : 'hover:bg-orange-300'}`}
                            >
                                <MdOutlineSecurity />
                                Quyền truy cập
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem className="p-0">
                            <NavigationMenuLink
                                href="/admin/menu-list"
                                className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${pathname === '/admin/menu-list' ? 'bg-gray-700 text-white' : 'hover:bg-orange-300'}`}
                            >
                                <FaUsers />
                                Quản lý thực đơn
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem className="p-0">
                            <NavigationMenuLink
                                href="/admin/users"
                                className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${pathname === '/admin/users' ? 'bg-gray-700 text-white' : 'hover:bg-orange-300'}`}
                            >
                                <FaUsers />
                                Quản lí nhân viên
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem className="p-0">
                            <NavigationMenuLink
                                href="/admin/customers"
                                className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${pathname === '/admin/customers' ? 'bg-gray-700 text-white' : 'hover:bg-orange-300'}`}
                            >
                                <FaUserGroup />
                                Thông tin khách hàng
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem className="p-0">
                            <NavigationMenuLink
                                href="/admin/orders"
                                className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${pathname === '/admin/orders' ? 'bg-gray-700 text-white' : 'hover:bg-orange-300'}`}
                            >
                                <FaMoneyBillTransfer />
                                Quản lý đơn hàng
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem className="p-0">
                            <NavigationMenuLink
                                href="/admin/dishes"
                                className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${pathname === '/admin/dishes' ? 'bg-gray-700 text-white' : 'hover:bg-orange-300'}`}
                            >
                                <MdFastfood />
                                Quản lý món ăn
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem className="p-0">
                            <NavigationMenuLink
                                href="/admin/stock"
                                className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${pathname === '/admin/stock' ? 'bg-gray-700 text-white' : 'hover:bg-orange-300'}`}
                            >
                                <FaStore />
                                Quản lý kho
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem className="p-0">
                            <NavigationMenuLink
                                href="/admin/stock-reports"
                                className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${pathname === '/admin/stock-reports' ? 'bg-gray-700 text-white' : 'hover:bg-orange-300'}`}
                            >
                                <TbBrandGoogleAnalytics />
                                Thống kê xuất/nhập kho
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem className="p-0">
                            <NavigationMenuLink
                                href="/admin/promotions"
                                className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${pathname === '/admin/promotions' ? 'bg-gray-700 text-white' : 'hover:bg-orange-300'}`}
                            >
                                <BiSolidDiscount />
                                Quản lý khuyến mãi
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem className="p-0">
                            <NavigationMenuLink
                                href="/admin/feedbacks"
                                className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${pathname === '/admin/feedbacks' ? 'bg-gray-700 text-white' : 'hover:bg-orange-300'}`}
                            >
                                <FaReplyd />
                                Phản hồi & Đánh giá
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem className="p-0">
                            <NavigationMenuLink
                                href="/admin/statistic"
                                className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${pathname === '/admin/statistic' ? 'bg-gray-700 text-white' : 'hover:bg-orange-300'}`}
                            >
                                <TbReportAnalytics />
                                Thống kê báo cáo
                            </NavigationMenuLink>
                        </NavigationMenuItem>



                    </NavigationMenu>
                </div>
            </div>
        </nav>
    );
}
