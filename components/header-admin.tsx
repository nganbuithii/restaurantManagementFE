import Image from "next/image";
import { FaBell } from "react-icons/fa";

export default function HeaderAdmin() {
    return (
        <main className="ml-64 flex-1 p-6 bg-orange-300 flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <div className="text-2xl">
                    <FaBell />
                </div>
            </div>

            <div className="flex items-center space-x-4">
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
                        className="rounded-full border border-gray-300"
                    />
                </div>
            </div>
        </main>
    );
}
