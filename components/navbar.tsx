'use client'
import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaStore, FaUsers, FaReplyd } from 'react-icons/fa';
import { IoMdHome, IoMdLogOut } from 'react-icons/io';
import { TbBrandGoogleAnalytics, TbReportAnalytics } from "react-icons/tb";
import { BiSolidDiscount } from "react-icons/bi";
import { MdFastfood, MdOutlineSecurity } from "react-icons/md";
import { FaCartFlatbed } from "react-icons/fa6";
import { FiUsers } from "react-icons/fi";

const navItems = [
    { href: '/admin/dashboard', icon: <IoMdHome size={20} />, text: 'Trang chủ' },
    { href: '/admin/permission', icon: <MdOutlineSecurity size={20} />, text: 'Quyền truy cập' },
    { href: '/admin/menu', icon: <FaUsers size={20} />, text: 'Quản lý thực đơn' },
    { href: '/admin/users', icon: <FaUsers size={20} />, text: 'Quản lí nhân viên' },
    { href: '/admin/tables', icon: <FiUsers size={20} />, text: 'Bàn' },
    { href: '/admin/orders', icon: <FaCartFlatbed size={20} />, text: 'Quản lý đơn hàng' },
    { href: '/admin/dishes', icon: <MdFastfood size={20} />, text: 'Quản lý món ăn' },
    { href: '/admin/storehouse', icon: <FaStore size={20} />, text: 'Quản lý kho' },
    { href: '/admin/warehouse-slips', icon: <TbBrandGoogleAnalytics size={20} />, text: 'Thống kê xuất/nhập kho' },
    { href: '/admin/promotions', icon: <BiSolidDiscount size={20} />, text: 'Quản lý khuyến mãi' },
    { href: '/admin/feedbacks', icon: <FaReplyd size={20} />, text: 'Phản hồi & Đánh giá' },
    { href: '/admin/statistic', icon: <TbReportAnalytics size={20} />, text: 'Thống kê báo cáo' },
    { href: '/admin/reservations', icon: <TbReportAnalytics size={20} />, text: 'Lịch hẹn' },
    { href: '/admin/suppliers', icon: <TbReportAnalytics size={20} />, text: 'Nhà cung cấp' },
    { href: '/admin/ingredients', icon: <TbReportAnalytics size={20} />, text:'Nguyên liệu' }
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="w-64 bg-gradient-to-b from-orange-500 to-orange-400 text-white h-screen fixed top-0 left-0 shadow-lg flex flex-col">
            <div className="p-4 border-b border-orange-300 bg-orange-600 flex items-center">
                <Image src="/images/1.png" alt="logo" width={40} height={40} className="rounded-full" />
                <p className="ml-3 text-white text-lg font-extrabold">NABITI RESTAURANT</p>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-300 scrollbar-track-orange-100">
                <ul className="py-4 space-y-1">
                    {navItems.map(({ href, icon, text }) => (
                        <li key={href}>
                            <Link href={href} passHref>
                                <span className={`flex items-center px-4 py-2 text-sm transition-colors duration-200 ${pathname === href
                                        ? 'bg-white text-orange-500 border-r-4 border-orange-500'
                                        : 'text-white hover:bg-orange-300 hover:text-white'
                                    }`}>
                                    <span className="mr-3">{icon}</span>
                                    <span className="font-medium">{text}</span>
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

        </nav>
    );
}
