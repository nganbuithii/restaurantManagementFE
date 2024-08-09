import Breadcrumbs from "@/components/Breadcrumbs";
import HeaderAdmin from "@/components/header-admin";
import Navbar from "@/components/navbar";
import { Switch } from "@/components/ui/switch";

export default function Permission() {
    const labels = ["Trang chủ", "Quyền"];
    const links = ["/admin/dashboard", "/admin/permissions"]; // Liên kết cho hai nhãn

    return (
        <div className="flex">
            <Navbar />
            <div className="flex-1 flex flex-col">
                <HeaderAdmin />
                <main className="ml-64 flex-1 p-6 bg-gray-100">
                    <Breadcrumbs labels={labels} links={links} />
                    <h1 className="mt-4 text-3xl font-bold mb-6">Quản lý quyền truy cập</h1>
                    <section className="mt-6 bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold mb-4">Danh sách vai trò</h3>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <Switch />
                                <p className="font-bold ml-3 text-lg">Nhân viên</p>
                            </div>

                            <div className="space-y-2 p-4 bg-orange-100 rounded-md">
                                <div className="flex items-center">
                                    <Switch />
                                    <p className="font-bold ml-3 text-lg">Thêm mới</p>
                                </div>
                                <div className="flex items-center">
                                    <Switch />
                                    <p className="font-bold ml-3 text-lg">Chỉnh sửa</p>
                                </div>
                                <div className="flex items-center">
                                    <Switch />
                                    <p className="font-bold ml-3 text-lg">Xóa</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}
