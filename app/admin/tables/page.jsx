'use client';
import { useEffect, useState } from "react";
import API, { endpoints } from "@/app/configs/API";
import Breadcrumbs from "@/components/Breadcrumbs";
import HeaderAdmin from "@/components/header-admin";
import Navbar from "@/components/navbar";
import { calculateTotalPages } from "@/lib/paginationUtils";

export default function Orders() {
    const labels = ["Home", "Tables"];
    const links = ["/admin/dashboard", "/admin/tables"];
    const [tables, setTables] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchTables = async () => {
            try {
                const response = await API.get(endpoints.getTables, {
                    params: {
                        page: currentPage,
                    }
                });
                console.log("GET SUCCESS");
                setTables(response.data.data.data);

                const total = response.data.data.total;
                const itemsPerPage = response.data.data.itemsPerPage;
                const calculatedTotalPages = calculateTotalPages(total, itemsPerPage);

                setTotalPages(calculatedTotalPages);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };

        fetchTables();
    }, [currentPage]);

    const getStatusColor = (isActive) => {
        return isActive ? 'bg-green-500' : 'bg-gray-500';
    };

    return (
        <div className="flex">
            <Navbar />
            <div className="flex-1 flex flex-col">
                <HeaderAdmin />
                <main className="ml-64 flex-1 p-6 bg-gray-100">
                    <Breadcrumbs labels={labels} links={links} />

                    <div className="mt-6 flex flex-wrap justify-start gap-4">
                        {tables.map((table) => (
                            <div
                                key={table.id}
                                className={`p-4 rounded-lg ${getStatusColor(table.isActive)} text-white text-center w-32 h-32 flex flex-col justify-center items-center`}
                            >
                                <h2 className="text-xl font-bold">Table {table.number}</h2>
                                <p>Seats: {table.seats}</p>
                                <p>Status: {table.isActive ? 'Active' : 'Inactive'}</p>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
