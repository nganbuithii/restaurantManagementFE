'use client'
import Breadcrumbs from "@/components/Breadcrumbs";
import HeaderAdmin from "@/components/header-admin";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { CiLock } from "react-icons/ci";
import { FaLock, FaUnlock, FaUserEdit } from "react-icons/fa";
import { IoMdInformationCircle } from "react-icons/io";

export default function Users() {
    const labels = ["Trang chủ", "Quản lý người dùng"];
    const links = ["/admin/dashboard", "/admin/users"];

    const addUser = () => {
        try{

        }catch(error){
            console.log(error)
            toast.error('Add new user faill');
        }
    }
    return (
        <div className="flex">
            <Navbar />
            <div className="flex-1 flex flex-col">
                <HeaderAdmin />
                <main className="ml-64 flex-1 p-6 bg-gray-100">
                    <Breadcrumbs labels={labels} links={links} />
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-4xl font-extrabold text-gray-900">Quản lý người dùng</h1>
                    </div>
                    <Button className ="p-5 bg-orange-300">Add new user </Button> 

                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <table className="w-full text-left border-separate border-spacing-0">
                            <thead className="bg-gray-200 text-gray-700">
                                <tr>
                                    <th className="p-4 border-b border-gray-300">Tên</th>
                                    <th className="p-4 border-b border-gray-300">Email</th>
                                    <th className="p-4 border-b border-gray-300">Vai trò</th>
                                    <th className="p-4 border-b border-gray-300">Tình trạng</th>
                                    <th className="p-4 border-b border-gray-300">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="hover:bg-gray-50 transition duration-150">
                                    <td className="p-4 border-b border-gray-300">Nguyễn Văn A</td>
                                    <td className="p-4 border-b border-gray-300">a.nguyen@example.com</td>
                                    <td className="p-4 border-b border-gray-300">Quản trị viên</td>
                                    <td className="p-4 border-b border-gray-300">
                                        <div className="p-2 bg-orange-500 rounded-lg flex items-center space-x-2 text-white">
                                            <FaUnlock className="text-white" />
                                            <p>Unlock</p>
                                        </div>
                                    </td>
                                    <td className="p-4 border-b border-gray-300 flex space-x-3">
                                        <button className="text-blue-600 hover:bg-blue-100 rounded px-4 py-2 transition duration-150">Xem chi tiết</button>
                                        <button className="text-red-600 hover:bg-red-100 rounded px-4 py-2 transition duration-150">Xóa</button>
                                    </td>
                                </tr>
                                <tr className="hover:bg-gray-50 transition duration-150">
                                    <td className="p-4 border-b border-gray-300">Nguyễn Văn B</td>
                                    <td className="p-4 border-b border-gray-300">b.nguyen@example.com</td>
                                    <td className="p-4 border-b border-gray-300">Người dùng</td>
                                    <td className="p-4 border-b border-gray-300">
                                        <div className="p-2 bg-green-500 rounded-lg flex items-center space-x-2 text-white">
                                            <FaLock className="text-white" />
                                            <p>Locked</p>
                                        </div>
                                    </td>
                                    <td className="p-4 border-b border-gray-300 flex space-x-3">
                                        <button className="text-blue-600 hover:bg-blue-100 rounded px-4 py-2 transition duration-150 flex items-center space-x-1 bg-blue-200">
                                            <FaUserEdit />
                                            <span>Chuyển vai trò</span>
                                        </button>
                                        <button className="text-cyan-600 hover:bg-cyan-100 rounded px-4 py-2 transition duration-150 flex items-center space-x-1 bg-cyan-300">
                                            <IoMdInformationCircle />
                                            <span>Xem chi tiết</span>
                                        </button>
                                        <button className="text-red-600 hover:bg-red-100 rounded px-4 py-2 transition duration-150 flex items-center space-x-1 bg-red-300">
                                            <CiLock />
                                            <span>Khóa</span>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </main>
            </div>
        </div>
    );
}
