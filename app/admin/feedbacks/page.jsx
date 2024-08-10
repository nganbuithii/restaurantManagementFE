'use client'

import { useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import HeaderAdmin from "@/components/header-admin";
import Navbar from "@/components/navbar";
import { Select } from "@/components/ui/select";
import SearchInput from "@/components/SearchInput";
import SortSelect from "@/components/SortSelect"; // Import SortSelect
import Image from "next/image";
import { CiStar } from "react-icons/ci";
import { Button } from "@/components/ui/button";

export default function Feedbacks() {
    const labels = ["Trang chủ", "Phản hồi"];
    const links = ["/admin/dashboard", "/admin/feedbacks"];

    // State for search query
    const [searchQuery, setSearchQuery] = useState("");

    // State for selected sort option
    const [sortOption, setSortOption] = useState("light");

    // Dummy data for menu items with image URLs
    const menuItems = [
        { id: 1, name: "Gà quay", price: "100000", status: "Active", imageUrl: "/images/food-home1.png" },
        { id: 2, name: "Bún bò", price: "80000", status: "Inactive", imageUrl: "/images/food-home2.png" },
        // Add more items with image URLs as needed
    ];

    // Filtered menu items based on search query
    const filteredMenuItems = menuItems.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex">
            <Navbar />
            <div className="flex-1 flex flex-col">
                <HeaderAdmin />
                <main className="ml-64 flex-1 p-6 bg-gray-100">
                    <Breadcrumbs labels={labels} links={links} />
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-4xl font-extrabold text-gray-900">Danh sách phản hồi</h1>
                        <div className="flex flex-row items-center space-x-4 p-4 bg-gray-100 rounded-md shadow-md">
                            <p className="text-lg font-semibold">Sắp xếp theo</p>
                            <div className="flex-grow">
                                <SortSelect
                                    value={sortOption}
                                    onChange={setSortOption}
                                />
                            </div>
                        </div>

                        <SearchInput
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="bg-white rounded-lg shadow-lg overflow-hidden p-4 max-w-sm mx-auto">
                        <div className="flex flex-col space-y-4 ">
                            <div className="flex items-center space-x-4 width-64">
                                <Image
                                    src="/images/1.png"
                                    alt="avt"
                                    width={80}
                                    height={80}
                                    className="rounded-full"
                                />
                                <div className="flex flex-col">
                                    <p className="text-lg font-semibold">Ngan Bui Thi</p>
                                    <p className="text-gray-500 text-sm">23-1-2024</p>
                                </div>
                            </div>
                            <p className="text-gray-700 text-base">
                                NHÀ HÀNG NGOL OK
                            </p>
                            <div className="flex items-center space-x-1">
                                <CiStar className="text-yellow-500  text-2xl" />
                                <CiStar className="text-yellow-500 text-2xl" />
                                <CiStar className="text-yellow-500 text-2xl" />
                                <CiStar className="text-yellow-500 text-2xl" />
                            </div>
                            <Button className="bg-red-500 text-white hover:bg-red-600 rounded-md px-3 py-1.5 text-sm">
                                Ẩn phản hồi
                            </Button>
                        </div>
                        <div className="flex flex-col space-y-4 ">
                            <div className="flex items-center space-x-4 width-64">
                                <Image
                                    src="/images/1.png"
                                    alt="avt"
                                    width={80}
                                    height={80}
                                    className="rounded-full"
                                />
                                <div className="flex flex-col">
                                    <p className="text-lg font-semibold">Ngan Bui Thi</p>
                                    <p className="text-gray-500 text-sm">23-1-2024</p>
                                </div>
                            </div>
                            <p className="text-gray-700 text-base">
                                NHÀ HÀNG NGOL OK
                            </p>
                            <div className="flex items-center space-x-1">
                                <CiStar className="text-yellow-500  text-2xl" />
                                <CiStar className="text-yellow-500 text-2xl" />
                                <CiStar className="text-yellow-500 text-2xl" />
                                <CiStar className="text-yellow-500 text-2xl" />
                            </div>
                            <Button className="bg-red-500 text-white hover:bg-red-600 rounded-md px-3 py-1.5 text-sm">
                                Ẩn phản hồi
                            </Button>
                        </div>
                    </div>


                </main>
            </div>
        </div>
    );
}
