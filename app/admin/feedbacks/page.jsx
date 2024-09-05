'use client'

import { useEffect, useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import HeaderAdmin from "@/components/header-admin";
import Navbar from "@/components/navbar";
import SearchInput from "@/components/SearchInput";
import SortSelect from "@/components/SortSelect";
import Image from "next/image";
import { CiStar } from "react-icons/ci";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/CustomPagination";
import { calculateTotalPages } from "@/lib/paginationUtils";
import { format } from 'date-fns';
import API, { authApi, endpoints } from "@/app/configs/API";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Feedbacks() {
    const labels = ["Home", "Management Feedbacks"];
    const links = ["/admin/dashboard", "/admin/feedbacks"];

    const [searchQuery, setSearchQuery] = useState("");
    const [feedbacks, setFeedbacks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const token = useSelector((state) => state.auth.token);

    


    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await authApi(token).get(endpoints.getAllFeedbacks, {
                    params: {
                        page: currentPage,
                    }
                });
                
                setFeedbacks(response.data.data.data);

                const total = response.data.data.total;
                const itemsPerPage = response.data.data.itemsPerPage;
                const calculatedTotalPages = calculateTotalPages(total, itemsPerPage);
                
                setTotalPages(calculatedTotalPages);
            } catch (error) {
                console.error("Failed to fetch feedbacks:", error);
            }
        };

        fetchFeedbacks();
    }, [currentPage]);

    const filteredFeedbacks = feedbacks.filter(feedback =>
        feedback.content.toLowerCase().includes(searchQuery.toLowerCase())
    );





    return (
        <div className="flex">
            <Navbar />
            <div className="flex-1 flex flex-col">
                <HeaderAdmin />
                <main className="ml-64 flex-1 p-6 bg-gray-100">
                    <Breadcrumbs labels={labels} links={links} />
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-4xl font-extrabold text-gray-900">
                        Feedback and rating list</h1>
                
                        <SearchInput
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {filteredFeedbacks.map((feedback) => (
        <div key={feedback.id} className="bg-white rounded-lg shadow-lg overflow-hidden p-4">
            <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-4">
                    <Image
                        src="/images/default-avatar.jpg"
                        alt="avatar"
                        width={80}
                        height={80}
                        className="rounded-full"
                    />
                    <div className="flex flex-col">
                        <p className="text-lg font-semibold">{feedback.user.fullName}</p>
                        <p className="text-gray-500 text-sm">
                            {format(new Date(feedback.createdAt), 'dd-MM-yyyy')}
                        </p>
                    </div>
                </div>
                <p className="text-gray-700 text-base">{feedback.content}</p>
                <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, index) => (
                        <CiStar
                            key={index}
                            className={`text-2xl ${
                                index < feedback.rating ? 'text-yellow-500' : 'text-gray-300'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    ))}
</div>


                    <div className="mt-6">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                
                </main>
            </div>
        </div>
    );
}
export default dynamic(() => Promise.resolve(Feedbacks), { ssr: false })
