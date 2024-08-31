'use client'
import HeaderAdmin from "@/components/header-admin";
import Navbar from "@/components/navbar";
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
    const user = useSelector((state) => state.auth.user);
    const router = useRouter();

    // Nếu user là null hoặc undefined, điều hướng người dùng đến trang 404
    if (!user) {
        router.push('/404');
        return null; // Không render gì cả cho đến khi redirect hoàn tất
    }

    return (
        <>
            <Navbar />
            <HeaderAdmin />

            <div className="flex bg-gray-100 min-h-screen">
                <div className="flex-1 flex flex-col ml-64">
                    <main className="flex-1 p-6">
                        <h1>{user.username}</h1>
                        {/* Nội dung chính của dashboard */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Các card thống kê */}
                            {['Tổng đơn hàng', 'Doanh thu', 'Khách hàng mới'].map((title, index) => (
                                <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
                                    <p className="text-3xl font-bold text-orange-500">
                                        {index === 0 ? '1,234' : index === 1 ? '$12,345' : '56'}
                                    </p>
                                </div>
                            ))}
                        </div>
                        {/* Thêm các phần khác của dashboard ở đây */}
                    </main>
                </div>
            </div>
        </>
    );
}
