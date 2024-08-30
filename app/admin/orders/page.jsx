
'use client'
import Breadcrumbs from "@/components/Breadcrumbs";
import HeaderAdmin from "@/components/header-admin";
import Navbar from "@/components/navbar";
import { Switch } from "@/components/ui/switch";

export default function Orders() {
    const labels = ["Trang chủ", "Đơn hàng"];
    const links = ["/admin/dashboard", "/admin/orders"]; 

    return (
        <div className="flex">
            <Navbar />
            <div className="flex-1 flex flex-col">
                <HeaderAdmin />
                <main className="ml-64 flex-1 p-6 bg-gray-100">
                    <Breadcrumbs labels={labels} links={links} />
                    <h1 className="mt-4 text-3xl font-bold mb-6">Quản lý đơn hàng</h1>
                    <section className="mt-6 bg-white p-6 rounded-lg shadow-lg">
                    
                    </section>
                </main>
            </div>
        </div>
    );
}
