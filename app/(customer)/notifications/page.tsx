
'use client'
import Footer from "@/components/footer";
import Header from "@/components/header";

export default function Notifications() {
    const notifications = [
        {
            id: 1,
            type: "order",
            title: "Cập nhật đơn hàng",
            content: "Đơn hàng #1234 của bạn đã được cập nhật trạng thái thành công.",
            date: "2024-08-08",
        },
        {
            id: 2,
            type: "promotion",
            title: "Khuyến mãi đặc biệt",
            content: "Giảm giá 20% cho tất cả các sản phẩm! Áp dụng mã: SALE20.",
            date: "2024-08-07",
        },
        // Thêm nhiều thông báo ở đây
    ];

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-100 py-10">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold text-center mb-6">Trang Thông Báo</h1>
                    <div className="bg-white shadow-md rounded-lg p-6">
                        {notifications.length > 0 ? (
                            <ul className="space-y-4">
                                {notifications.map((notification) => (
                                    <li key={notification.id} className={`border rounded-lg p-4 ${notification.type === "order" ? "bg-blue-50 border-blue-200" : "bg-green-50 border-green-200"} shadow-sm`}>
                                        <h2 className="text-xl font-semibold mb-2">{notification.title}</h2>
                                        <p className="text-gray-700 mb-2">{notification.content}</p>
                                        <span className="text-sm text-gray-500">{notification.date}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center text-gray-500">Chưa có thông báo nào.</p>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
