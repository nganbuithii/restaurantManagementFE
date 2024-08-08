"use client";
import Navbar from "@/components/navbar";

// Đánh dấu thành phần này là client component


export default function AdminDashboard() {
    return (
        <div className="flex">
            <Navbar />
            <main className="ml-64 flex-1 p-6 bg-gray-100">
                <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            </main>

        </div>
    );
}
