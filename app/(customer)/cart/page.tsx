import Footer from "@/components/footer"
import Header from "@/components/header"
import Image from 'next/image';

export default function Cart() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-100 py-10">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold text-center mb-6">Giỏ Hàng</h1>
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-orange-600 text-left rounded-lg">
                                    <th className="py-2 px-4 border-b">Sản phẩm</th>
                                    <th className="py-2 px-4 border-b">Số lượng</th>
                                    <th className="py-2 px-4 border-b">Giá</th>
                                    <th className="py-2 px-4 border-b">Tổng</th>
                                    <th className="py-2 px-4 border-b"></th>
                                </tr>
                            </thead>
                            <tbody>

                                <tr className="border-b">
                                    <td className="py-4 px-4 flex items-center">
                                        <Image
                                            src="https://images.squarespace-cdn.com/content/v1/53883795e4b016c956b8d243/1551438228969-H0FPV1FO3W5B0QL328AS/chup-anh-thuc-an-1.jpg"
                                            alt="Product"
                                            width={64}
                                            height={64}
                                            className="object-cover rounded-md mr-4"
                                        />
                                        <span className="font-medium">hambuger</span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <input type="number" min="1" className="w-20 px-2 py-1 border rounded" />
                                    </td>
                                    <td className="py-4 px-4">$50.00</td>
                                    <td className="py-4 px-4">$50.00</td>
                                    <td className="py-4 px-4 text-center">
                                        <button className="text-red-500 hover:text-red-700">Xóa</button>
                                    </td>
                                </tr>
                                {/* Thêm nhiều hàng sản phẩm ở đây */}
                            </tbody>
                        </table>
                        <div className="mt-6 flex justify-between items-center">
                            <span className="text-lg font-semibold">Tổng cộng:</span>
                            <span className="text-lg font-bold">$100.00</span>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
                                Tiến hành thanh toán
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
