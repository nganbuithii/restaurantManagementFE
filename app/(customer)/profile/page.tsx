import Footer from "@/components/footer";
import Header from "@/components/header";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function Profile() {
    return (
        <>
            <Header />
            <main className="p-8 bg-gray-100 min-h-screen">
                <h1 className="text-3xl font-semibold text-center mb-8 text-gray-800">Thông tin cá nhân</h1>
                <section className="flex items-start bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto mb-8">
                    <div className="flex-shrink-0 mr-8">
                        <Image
                            src="/images/1.png"
                            alt="avatar"
                            width={200}
                            height={200}
                            className="rounded-full border-4 border-gray-300 shadow-md"
                        />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Thông tin khách hàng</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col">
                                <label htmlFor="customerId" className="mb-2 font-medium text-gray-700">Mã khách hàng</label>
                                <Input id="customerId" placeholder="Mã khách hàng" className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300" />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="customerName" className="mb-2 font-medium text-gray-700">Tên khách hàng</label>
                                <Input id="customerName" placeholder="Tên khách hàng" className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300" />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="joinDate" className="mb-2 font-medium text-gray-700">Ngày tham gia</label>
                                <Input id="joinDate" placeholder="Ngày tham gia" className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300" />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="loyaltyPoints" className="mb-2 font-medium text-gray-700">Điểm tích lũy</label>
                                <Input id="loyaltyPoints" placeholder="Điểm tích lũy" className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300" />
                            </div>
                            <div className="flex flex-col mb-4">
                        <label htmlFor="email" className="mb-2 font-medium text-gray-700">Email</label>
                        <Input id="email" placeholder="Email" className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300" />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="role" className="mb-2 font-medium text-gray-700">Vai trò</label>
                        <Input id="role" placeholder="Vai trò" className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300" />
                    </div>
                        </div>
                    </div>
                </section>

            </main>
            <Footer />
        </>
    );
}
