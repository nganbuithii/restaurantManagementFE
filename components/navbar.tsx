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
                    <Image src="/images/1.png" alt="logo" width={40} height={40} />
                    <p className="ml-2 text-white text-base">NABITI RESTAURANT</p>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <NavigationMenu className="list-none p-0">
                        {[
                            { href: '/admin', icon: <IoMdHome />, text: 'Trang chủ' },
                            { href: '/admin/permission', icon: <MdOutlineSecurity />, text: 'Quyền truy cập' },
                            { href: '/admin/menu-list', icon: <FaUsers />, text: 'Quản lý thực đơn' },
                            { href: '/admin/users', icon: <FaUsers />, text: 'Quản lí nhân viên' },
                            { href: '/admin/customer-info', icon: <FaUserGroup />, text: 'Thông tin khách hàng' },
                            { href: '/admin/orders', icon: <FaMoneyBillTransfer />, text: 'Quản lý đơn hàng' },
                            { href: '/admin/dishes', icon: <MdFastfood />, text: 'Quản lý món ăn' },
                            { href: '/admin/storehouse', icon: <FaStore />, text: 'Quản lý kho' },
                            { href: '/admin/statistic-storehouse', icon: <TbBrandGoogleAnalytics />, text: 'Thống kê xuất/nhập kho' },
                            { href: '/admin/promotions', icon: <BiSolidDiscount />, text: 'Quản lý khuyến mãi' },
                            { href: '/admin/feedbacks', icon: <FaReplyd />, text: 'Phản hồi & Đánh giá' },
                            { href: '/admin/statistic', icon: <TbReportAnalytics />, text: 'Thống kê báo cáo' }
                        ].map(({ href, icon, text }) => (
                            <NavigationMenuItem key={href} className="p-0">
                                <NavigationMenuLink
                                    href={href}
                                    className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${pathname === href ? 'bg-gray-700 text-white' : 'hover:bg-orange-300'}`}
                                >
                                    <span className="text-xl mr-2">{icon}</span>
                                    <span>{text}</span>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        ))}
                    </NavigationMenu>
                </div>
            </div>
        </nav>
    );
}
