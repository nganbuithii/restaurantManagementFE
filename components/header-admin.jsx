import { useState } from "react";
import Image from "next/image";
import { FaBell } from "react-icons/fa";

export default function HeaderAdmin() {
    const [showModal, setShowModal] = useState(false);

    return (
        <main className="ml-64 flex-1 p-6 bg-orange-300 flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <div className="text-2xl">
                    <FaBell />
                </div>
            </div>

            <div className="flex items-center space-x-4 relative">
                <div className="flex flex-col text-right">
                    <p className="font-semibold">Bùi Thị NGÂN</p>
                    <p className="text-gray-600">Role administrator</p>
                </div>
                <div>
                    <Image
                        src="/images/mem.jpg"
                        alt="avt"
                        width={80}
                        height={80}
                        className="rounded-full border border-gray-300 cursor-pointer"
                        onClick={() => setShowModal(!showModal)}
                    />
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="absolute -top-36 right-0 mt-2 w-72 bg-white shadow-lg rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                            <Image
                                src="/images/mem.jpg"
                                alt="avt"
                                width={50}
                                height={50}
                                className="rounded-full border border-gray-300"
                            />
                            <div>
                                <p className="font-semibold">đăng yasuo</p>
                                <p className="text-sm text-gray-600">duaconcuagio@yahoo.com</p>
                            </div>
                        </div>
                        <hr className="my-2" />
                        <ul className="space-y-2">
                            <li className="flex items-center space-x-2 cursor-pointer">
                                <i className="fas fa-info-circle text-gray-700"></i>
                                <span>Thông tin của tôi</span>
                            </li>
                            <li className="flex items-center space-x-2 cursor-pointer">
                                <i className="fas fa-key text-gray-700"></i>
                                <span>Đổi mật khẩu</span>
                            </li>
                            <li className="flex items-center space-x-2 cursor-pointer">
                                <i className="fas fa-home text-gray-700"></i>
                                <span>Về trang chủ</span>
                            </li>
                            <li className="flex items-center space-x-2 cursor-pointer">
                                <i className="fas fa-sign-out-alt text-gray-700"></i>
                                <span>Đăng xuất</span>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </main>
    );
}
