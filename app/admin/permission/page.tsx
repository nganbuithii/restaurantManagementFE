import Breadcrumbs from "@/components/Breadcrumbs";
import HeaderAdmin from "@/components/header-admin";
import Navbar from "@/components/navbar";

export default function Permission() {
    const labels = ["Trang chủ", "Quyền"];
    const links = ["/admin/dashboard", "/admin/permissions"]; // Liên kết cho hai nhãn
    return (
        <div className="flex">
            <Navbar />
            <div className="flex-1 flex flex-col">
                <HeaderAdmin />
                <main className="ml-64 flex-1 p-6 bg-gray-100 flex items-center justify-between">
                    <Breadcrumbs labels={labels} links={links} />
                    <h1 className="text-3xl font-bold mb-6">HELLO TRANG QUYỀN</h1>

                </main>
            </div>
        </div>
    );
}
