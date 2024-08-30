'use client'
import Footer from "@/components/footer";
import Header from "@/components/header";
import Image from "next/image";

export default function HistoryOrder() {
    return (
        <>
            <Header />
            <div className="relative">
                {/* Uốn lượn dưới header */}
                <div className="absolute top-0 left-0 w-full h-16 bg-white z-10"></div>
                <div className="bg-orange-200 h-16 relative z-20">
                    {/* Thêm lớp uốn lượn */}
                    {/* <svg viewBox="0 0 1440 100" className="absolute bottom-0 left-0 w-full">
                        <path
                            fill="#f59e0b"
                            fillOpacity="1"
                            d="M0,50L40,70C80,90,160,130,240,140C320,150,400,130,480,106.7C560,83,640,53,720,53C800,53,880,83,960,98.7C1040,114,1120,114,1180,106.7C1240,100,1300,86,1360,85L1400,84L1400,0L1360,0C1320,0,1280,0,1240,0C1200,0,1160,0,1120,0C1080,0,1040,0,1000,0C960,0,920,0,880,0C840,0,800,0,760,0C720,0,680,0,640,0C600,0,560,0,520,0C480,0,440,0,400,0C360,0,320,0,280,0C240,0,200,0,160,0C120,0,80,0,40,0L0,0Z"
                        ></path>
                    </svg> */}
                </div>
                <div className="container mx-auto px-4 py-8 mt-16">
                    <h1 className="text-3xl font-bold mb-6 text-center">Order History</h1>
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-orange-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {/* Example row, replace with actual data */}
                                <tr className="hover:bg-gray-100 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <Image src="/images/sample-product.jpg" alt="Product" width={50} height={50} className="rounded-md mr-4" />
                                            <div>
                                                <p className="font-bold text-gray-900">#12345</p>
                                                <p className="text-sm text-gray-500">3 Items</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <p className="text-gray-900">2023-05-15</p>
                                        <p className="text-sm text-gray-500">12:30 PM</p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">$99.99</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            Completed
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <a href="#" className="text-indigo-600 hover:text-indigo-900">View Details</a>
                                    </td>
                                </tr>
                                {/* Add more rows as needed */}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
