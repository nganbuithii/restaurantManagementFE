'use client'

import { useState } from "react";
import Image from "next/image";
import { FaBell } from "react-icons/fa";

export default function HeaderAdmin() {
    const [showModal, setShowModal] = useState(false);

    return (
        <main className="ml-64 flex-1 p-6 bg-gray-100 flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-4">
                <h1 className="text-3xl font-semibold text-gray-800">Admin Dashboard</h1>
                <div className="text-2xl text-gray-600 cursor-pointer hover:text-gray-800 transition-colors">
                    <FaBell />
                </div>
            </div>

            <div className="flex items-center space-x-4 relative">
                <div className="flex flex-col text-right">
                    <p className="font-semibold text-gray-800">Bùi Thị NGÂN</p>
                    <p className="text-gray-500">Role administrator</p>
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
                    <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center space-x-3">
                            <Image
                                src="/images/mem.jpg"
                                alt="avt"
                                width={50}
                                height={50}
                                className="rounded-full border border-gray-300"
                            />
                            <div>
                                <p className="font-semibold text-gray-800">đăng yasuo</p>
                                <p className="text-sm text-gray-500">duaconcuagio@yahoo.com</p>
                            </div>
                        </div>
                        <hr className="my-2 border-gray-300" />
                        <ul className="space-y-2">
                            <li className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors">
                                <i className="fas fa-info-circle text-gray-600"></i>
                                <span>Thông tin của tôi</span>
                            </li>
                            <li className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors">
                                <i className="fas fa-key text-gray-600"></i>
                                <span>Đổi mật khẩu</span>
                            </li>
                            <li className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors">
                                <i className="fas fa-home text-gray-600"></i>
                                <span>Về trang chủ</span>
                            </li>
                            <li className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors">
                                <i className="fas fa-sign-out-alt text-gray-600"></i>
                                <span>Đăng xuất</span>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </main>
    );
}
