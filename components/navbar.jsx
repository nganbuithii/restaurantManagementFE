import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { IoMdHome, IoMdLogOut } from 'react-icons/io';
import { TbBrandGoogleAnalytics, TbReportAnalytics } from "react-icons/tb";
import { BiSolidDiscount } from "react-icons/bi";
import { MdFastfood, MdOutlineSecurity } from "react-icons/md";
import { FaCartFlatbed, FaStore, FaUsers, FaReplyd, FaCalendarMinus } from "react-icons/fa6";
import { FiUsers } from "react-icons/fi";
import { SiAdguard } from "react-icons/si";

const navItems = [
    { href: '/admin/dashboard', icon: <IoMdHome size={20} />, text: 'Dashboard' },
    {
        text: 'Management',
        icon: <FaUsers size={20} />,
        subItems: [
            { href: '/admin/permission', icon: <MdOutlineSecurity size={20} />, text: 'Permissions' },
            { href: '/admin/menu', icon: <MdFastfood size={20} />, text: 'Menu' },
            { href: '/admin/users', icon: <FiUsers size={20} />, text: 'Users' },
            { href: '/admin/tables', icon: <FaStore size={20} />, text: 'Tables' },
            { href: '/admin/orders', icon: <FaCartFlatbed size={20} />, text: 'Orders' },
            { href: '/admin/dishes', icon: <MdFastfood size={20} />, text: 'Dishes' },
            { href: '/admin/ingredients', icon: <TbReportAnalytics size={20} />, text: 'Ingredients' },
            { href: '/admin/roles', icon: <SiAdguard size={20} />, text: 'Roles' },
        ]
    },
    { href: '/admin/storehouse', icon: <FaStore size={20} />, text: 'Storehouse' },
    { href: '/admin/warehouse-slips', icon: <TbBrandGoogleAnalytics size={20} />, text: 'Warehouse Slips' },
    { href: '/admin/promotions', icon: <BiSolidDiscount size={20} />, text: 'Promotions' },
    { href: '/admin/feedbacks', icon: <FaReplyd size={20} />, text: 'Feedback' },
    { href: '/admin/statistics', icon: <TbReportAnalytics size={20} />, text: 'Statistics' },
    { href: '/admin/reservations', icon: <FaCalendarMinus size={20} />, text: 'Reservations' },
    { href: '/admin/suppliers', icon: <FaStore size={20} />, text: 'Suppliers' },
];

const CustomNavbar = () => {
    const pathname = usePathname();
    const [openSubmenu, setOpenSubmenu] = useState(null);

    const toggleSubmenu = (index) => {
        setOpenSubmenu(openSubmenu === index ? null : index);
    };

    return (
        <nav className="w-64 bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300 text-orange-800 h-screen fixed top-0 left-0 shadow-lg flex flex-col transition-all duration-300 ease-in-out">
            <div className="px-6 py-3 border-b border-orange-300 bg-orange-400 flex items-center justify-center">
                <Image src="/images/1.png" alt="logo" width={50} height={50} className="rounded-full shadow-lg" />
                <p className="ml-3 text-white text-xl font-extrabold tracking-wider">Nabity Restaurant</p>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-300 scrollbar-track-orange-100">
                <ul className="py-4 space-y-1">
                    {navItems.map((item, index) => (
                        <li key={item.text}>
                            {item.subItems ? (
                                <div>
                                    <button
                                        onClick={() => toggleSubmenu(index)}
                                        className="w-full flex items-center justify-between px-4 py-3 text-sm transition-colors duration-200 hover:bg-orange-300 hover:text-white rounded-md"
                                    >
                                        <span className="flex items-center">
                                            <span className="mr-3 text-orange-600">{item.icon}</span>
                                            <span className="font-medium">{item.text}</span>
                                        </span>
                                        {openSubmenu === index ? <FaChevronUp className="text-orange-600" /> : <FaChevronDown className="text-orange-600" />}
                                    </button>
                                    {openSubmenu === index && (
                                        <ul className="bg-orange-50 rounded-md mx-2 mt-1">
                                            {item.subItems.map((subItem) => (
                                                <li key={subItem.href}>
                                                    <Link href={subItem.href} passHref>
                                                        <span className={`flex items-center px-6 py-2 text-sm transition-colors duration-200 ${pathname === subItem.href
                                                                ? 'bg-orange-300 text-white rounded-md'
                                                                : 'hover:bg-orange-200 hover:text-orange-800 rounded-md'
                                                            }`}>
                                                            <span className="mr-3 text-orange-600">{subItem.icon}</span>
                                                            <span className="font-medium">{subItem.text}</span>
                                                        </span>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ) : (
                                <Link href={item.href} passHref>
                                    <span className={`flex items-center px-4 py-3 text-sm transition-colors duration-200 ${pathname === item.href
                                            ? 'bg-orange-400 text-white rounded-md shadow-md'
                                            : 'text-orange-800 hover:bg-orange-300 hover:text-white rounded-md'
                                        }`}>
                                        <span className="mr-3 text-orange-600">{item.icon}</span>
                                        <span className="font-medium">{item.text}</span>
                                    </span>
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

        </nav>
    );
};

export default CustomNavbar;