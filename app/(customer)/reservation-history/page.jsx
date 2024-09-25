
'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { authApi, endpoints } from '@/app/configs/API';
import { useSelector } from 'react-redux';
import Footer from '@/components/footer';
import Header from '@/components/header';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import Loading from '@/components/Loading';
import dynamic from 'next/dynamic';
import ReservationDrawer from './ReservationDrawer';
import { RefreshCw, Calendar, Clock, Info, MapPin, Users, Edit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TableSelectionDrawer from './TableSelectionDrawer'
const ReservationHistory = () => {
    const [loading, setLoading] = useState(true);
    const [reservations, setReservations] = useState([]);
    const [error, setError] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [filter, setFilter] = useState('all');
    const [isTableDrawerOpen, setIsTableDrawerOpen] = useState(false);
    const [selectedTable, setSelectedTable] = useState(null);
    const [reservationDate, setReservationDate] = useState(new Date());
    const [reservationTime, setReservationTime] = useState("18:00");



    const token = useSelector((state) => state.auth.token);

    const fetchReservations = useCallback(async () => {
        try {
            setLoading(true);
            const response = await authApi(token).post(endpoints['getReservationByMe']);
            setReservations(response.data.data);
            setError(null);
        } catch (err) {
            setError('Unable to load reservation history. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchReservations();
    }, [token, fetchReservations]);


    useEffect(() => {
        fetchReservations();
    }, [token,fetchReservations]);


    const handleViewDetails = (reservationId) => {
        setSelectedId(reservationId);
        setIsDrawerOpen(true);
    };

    const handleRefresh = () => {
        fetchReservations();
    };

    const handleTableChange = (reservationId) => {
        setSelectedId(reservationId);
        setIsTableDrawerOpen(true);
        // Set the reservation date and time for the drawer
        const selectedReservation = reservations.find(res => res.id === reservationId);
        if (selectedReservation) {
            setReservationDate(new Date(selectedReservation.date));
            setReservationTime(selectedReservation.time);
        }
    };

    const handleTableSelected = (table) => {
        console.log("Selected Table:", table);
        console.log("For Reservation ID:", selectedId);
        setSelectedTable(table);
        setIsTableDrawerOpen(false);
        // Ở đây bạn có thể thêm logic để cập nhật lịch hẹn với bàn mới
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Confirmed':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'Cancelled':
                return 'bg-red-100 text-red-800 border-red-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const filteredReservations = reservations.filter(reservation => {
        if (filter === 'all') return true;
        return reservation.status === filter;
    });

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
            <Header bgColor="bg-orange-500" />

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="p-6 sm:p-10">
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
                            <h1 className="text-3xl font-bold text-orange-600 mb-4 sm:mb-0">Your Reservation History</h1>
                        </div>

                        {loading ? (
                            <Loading />
                        ) : error ? (
                            <div className="text-center py-10">
                                <p className="text-red-600 mb-4">{error}</p>
                                <button
                                    onClick={handleRefresh}
                                    className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors duration-200"
                                >
                                    Retry
                                </button>
                            </div>
                        ) : filteredReservations.length === 0 ? (
                            <div className="text-center py-10">
                                <p className="text-gray-600 mb-4">You have no reservations yet.</p>
                                <a href="/make-reservation" className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors duration-200">
                                    Make a Reservation
                                </a>
                            </div>
                        ) : (
                            <AnimatePresence>
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {filteredReservations.map((reservation) => (
                                        <motion.div
                                            key={reservation.id}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3 }}
                                            className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
                                        >
                                            <div className="p-5">
                                                <div className="flex justify-between items-center mb-4">
                                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(reservation.status)}`}>
                                                        {reservation.status}
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        {format(new Date(reservation.createdAt), 'dd/MM/yyyy HH:mm', { locale: enUS })}
                                                    </span>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center">
                                                        <Calendar className="mr-2 text-orange-500" size={18} />
                                                        <span className="text-gray-700">
                                                            {format(new Date(reservation.date), 'd MMMM, yyyy', { locale: enUS })}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Clock className="mr-2 text-orange-500" size={18} />
                                                        <span className="text-gray-700">{reservation.time}</span>
                                                    </div>
                                                </div>

                                                <div className="flex justify-between mt-4">
                                                    <motion.button
                                                        whileHover={{ scale: 1.03 }}
                                                        whileTap={{ scale: 0.97 }}
                                                        onClick={() => handleViewDetails(reservation.id)}
                                                        className="inline-flex items-center justify-center px-4 py-2 bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 transition-colors duration-200"
                                                    >
                                                        <Info className="mr-2" size={18} />
                                                        View Details
                                                    </motion.button>
                                                    {reservation.status.toLowerCase() === 'pending' && (
                                                        <motion.button
                                                            onClick={() => handleTableChange(reservation.id)}
                                                            className="inline-flex items-center justify-center px-4 py-2 bg-pink-100 text-pink-700 rounded-md hover:bg-pink-200 transition-colors duration-200"
                                                        >
                                                            <Edit className="mr-2" size={18} />
                                                            Change table
                                                        </motion.button>
                                                    )}
                                                </div>

                                            </div >
                                        </motion.div >
                                    ))}
                                </div >
                            </AnimatePresence >
                        )}
                    </div >
                </div >
            </main >
            <TableSelectionDrawer
                isOpen={isTableDrawerOpen}
                onClose={() => setIsTableDrawerOpen(false)}
                date={reservationDate}
                time={reservationTime}
                onTableSelected={handleTableSelected}
                reservationId={selectedId}
            />
                                
            <ReservationDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                reservationId={selectedId}
                onCancel={() => {
                    setIsDrawerOpen(false);
                    handleRefresh();
                }}
            />

            <Footer />

        </div>
    );
};

export default dynamic(() => Promise.resolve(ReservationHistory), { ssr: false });
