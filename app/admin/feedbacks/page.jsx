'use client'
import React, { useEffect, useState } from "react";
import { format } from 'date-fns';
import { useSelector } from "react-redux";
import { Star, Search, ChevronLeft, ChevronRight, ThumbsUp, ThumbsDown } from "lucide-react";
import { authApi, endpoints } from "@/app/configs/API";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/navbar";
import HeaderAdmin from "@/components/header-admin";
import dynamic from "next/dynamic";
import { SelectGroup } from "@radix-ui/react-select";
import { checkPermission } from '@/utils/permissionUtils';
import Image from "next/image";

const getLabelIcon = (label) => {
    switch (label?.toUpperCase()) {
        case 'POSITIVE':
            return <ThumbsUp className="w-4 h-4 text-green-500" />;
        case 'NEGATIVE':
            return <ThumbsDown className="w-4 h-4 text-red-500" />;
        default:
            return null;
    }
};

const Feedbacks = () => {
    const permissions = useSelector(state => state.auth.permissions);
    const canView = checkPermission(permissions, 'Feedback', 'GET');

    const [searchQuery, setSearchQuery] = useState("");
    const [feedbacks, setFeedbacks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState("newest");
    const token = useSelector((state) => state.auth.token);
    const [selectedStatus, setSelectedStatus] = useState("");
    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const params = {
                    page: currentPage,
                };
                if (selectedStatus !== 'all') {
                    params.search = selectedStatus;
                }
                const response = await authApi(token).get(endpoints.getAllFeedbacks, {
                    params: params,
                });
                setFeedbacks(response.data.data.data);
                setTotalPages(Math.ceil(response.data.data.total / response.data.data.itemsPerPage));
            } catch (error) {
                console.error("Failed to fetch feedbacks:", error);
            }
        };

        fetchFeedbacks();
    }, [token, currentPage, sortBy, selectedStatus]);

    const filteredFeedbacks = feedbacks.filter(feedback =>
        feedback.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feedback.user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex ">
            <Navbar />
            <div className="flex-1 flex flex-col">
                <HeaderAdmin />
                {canView ? (
                    <main className="ml-64 flex-1 p-6 bg-gray-100">
                        <div className="container mx-auto px-6 py-8">
                            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Feedback Management</h1>
                            <div className="mb-6 flex justify-between items-center">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <Input
                                        type="text"
                                        placeholder="Search feedbacks..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 pr-4 py-2 w-64 rounded-full border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                    />
                                </div>
                                <div className="flex items-center space-x-4">
                                    <Select onValueChange={(value) => setSelectedStatus(value)} className="w-full md:w-auto">
                                        <SelectTrigger className="w-full md:w-[180px] bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out">
                                            <SelectValue placeholder="Filter status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Tag</SelectLabel>
                                                <SelectItem value="all">All</SelectItem>
                                                <SelectItem value="Positive">Positive</SelectItem>
                                                <SelectItem value="Negative">Negative</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>

                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {filteredFeedbacks.map((feedback) => (
                                    <Card key={feedback.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
                                        <CardContent className="p-6">
                                            <div className="flex items-center mb-4">
                                                <Avatar className="h-10 w-10 mr-3">
                                                    <AvatarImage src={feedback.user.avatar || "/images/default-avatar.jpg"} alt={feedback.user.fullName} />
                                                    <AvatarFallback>{feedback.user.fullName.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <h3 className="font-semibold text-gray-800">{feedback.user.fullName}</h3>
                                                    <p className="text-sm text-gray-500">{format(new Date(feedback.createdAt), 'MMM dd, yyyy')}</p>
                                                </div>
                                                {feedback.label && (
                                                    <div className="ml-auto">
                                                        {getLabelIcon(feedback.label)}
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-gray-600 mb-4">{feedback.content}</p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    {[...Array(5)].map((_, index) => (
                                                        <Star
                                                            key={index}
                                                            className={`h-5 w-5 ${index < feedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                                        />
                                                    ))}
                                                    <span className="ml-2 text-sm font-medium text-gray-600">{feedback.rating}/5</span>
                                                </div>
                                                <span className="text-sm font-medium text-blue-600">@{feedback.user.username}</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            <div className="mt-8 flex justify-center">
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="mr-2"
                                >
                                    <ChevronLeft className="h-4 w-4 mr-2" /> Previous
                                </Button>
                                <span className="mx-4 self-center">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="ml-2"
                                >
                                    Next <ChevronRight className="h-4 w-4 ml-2" />
                                </Button>
                            </div>
                        </div>
                    </main>) :
                    (<div className="flex flex-col items-center justify-center h-full bg-white rounded-xl shadow-lg p-8">
                        <Image src="/images/permission-deny.avif" alt="Permission Denied" width={200} height={200} className="mb-6" />
                        <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
                        <p className="text-gray-600 text-lg text-center">You do not have permission to view the user management page.</p>
                    </div>)}
            </div>
        </div>
    );
};

export default dynamic(() => Promise.resolve(Feedbacks), { ssr: false })