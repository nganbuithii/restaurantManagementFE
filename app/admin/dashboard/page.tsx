"use client";
import HeaderAdmin from "@/components/header-admin";
import Navbar from "@/components/navbar";

// Đánh dấu thành phần này là client component


export default function AdminDashboard() {
    return (
        <div className="flex">
        <Navbar />
        <HeaderAdmin/>
    </div>
    );
}
