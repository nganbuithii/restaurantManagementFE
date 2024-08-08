"use client";
import HeaderAdmin from "@/components/header-admin";
import Navbar from "@/components/navbar";


export default function AdminDashboard() {
    return (
        <div className="flex">
        <Navbar />
        <HeaderAdmin/>
    </div>
    );
}
