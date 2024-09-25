import React, { useCallback, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { authApi, endpoints } from '@/app/configs/API';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, Clock, User, Phone } from 'lucide-react';

import { useSelector } from 'react-redux';
import { Calendar, Clock, User, Phone } from 'lucide-react';
import Loading from '@/components/Loading'; // You can keep this if you still want a loading spinner.
import { Button } from '@/components/ui/button';
import { format, isValid, differenceInHours, parseISO } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Skeleton } from "@/components/ui/skeleton"; 
import { fetchReservationDetails } from '@/app/store/reservationSlice';



const ReservationDrawer = ({ isOpen, onClose, reservationId, onCancel }) => {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = useSelector((state) => state.auth.token);

    const fetchReservationDetails = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await authApi(token).get(endpoints.getReservationById(reservationId));
            setDetails(response.data.data.data);
        } catch (err) {
            console.error("API fetch error:", err);
            console.log("Lỗi api detail", err)
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [reservationId, token]);

    React.useEffect(() => {
        if (isOpen && reservationId) {
            fetchReservationDetails();
        }
    }, [isOpen, reservationId, fetchReservationDetails]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'CONFIRMED':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800 border-red-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Invalid Date';
        const date = parseISO(dateString);
        return isValid(date) ? format(date, 'dd/MM/yyyy') : 'Invalid Date';
    };

    const userFullName = details?.user?.fullName || 'N/A';
    const userPhone = details?.user?.phone || 'N/A';

    const canCancel = () => {
        if (!details || details.status !== 'PENDING') return false;
        const { date, time } = details;
        if (!date || !time) {
            console.error("Invalid date or time:", { date, time });
            return false;
        }
        const [hours, minutes] = time.split(':').map(Number);
        const reservationDate = parseISO(date);
        if (!isValid(reservationDate)) {
            console.error("Invalid date:", date);
            return false;
        }
        const reservationDateTime = new Date(reservationDate);
        reservationDateTime.setHours(hours, minutes);
        
        console.log("Reservation date:", reservationDateTime);
        const now = new Date();
        const hoursUntilReservation = differenceInHours(reservationDateTime, now);
        return hoursUntilReservation > 12;
    };

    const handleCancel = async () => {
        if (!canCancel()) {
            toast.error("You cannot cancel this reservation", { containerId: 'B' });
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await authApi(token).patch(endpoints.changeStatusReser(reservationId), {
                status: "CANCELLED" 
            });
            console.log("Reservation cancelled successfully:", response.data);
            toast.success("Reservation cancelled successfully", { containerId: 'B' });
            if (onCancel) onCancel(); 
            onClose(); 
        } catch (error) {
            console.error("Error cancelling reservation:", error);
            toast.error("Failed to cancel reservation", { containerId: 'B' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="sm:max-w-md">
                <SheetHeader>
                    <SheetTitle className="text-2xl font-bold text-orange-800">Reservation Details</SheetTitle>
                </SheetHeader>
                {loading && (
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                    </div>
                )}
                {error && <p className="text-center text-red-500 py-4">{error}</p>}
                {details && (
                    <div className="mt-6">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-semibold text-gray-700">Reservation #{details.id}</span>
                            <Badge className={`${getStatusColor(details.status)} px-3 py-1 rounded-full text-xs font-medium border`}>
                                {details.status}
                            </Badge>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center text-gray-600">
                                <Calendar className="mr-2" size={18} />
                                <p className="text-sm">
                                    <span className="font-medium">Date:</span> {formatDate(details.date)}
                                </p>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <Clock className="mr-2" size={18} />
                                <p className="text-sm">
                                    <span className="font-medium">Time:</span> {details.time || 'No information'}
                                </p>
                            </div>
                        </div>
                        <Separator className="my-6" />
                        <SheetDescription className="text-lg font-semibold mb-4">Customer Information</SheetDescription>
                        <div className="space-y-4">
                            <div className="flex items-center text-gray-600">
                                <User className="mr-2" size={18} />
                                <p className="text-sm">
                                    <span className="font-medium">Name:</span> {userFullName}
                                </p>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <Phone className="mr-2" size={18} />
                                <p className="text-sm">
                                    <span className="font-medium">Phone:</span> {userPhone}
                                </p>
                            </div>
                        </div>
                        <Separator className="my-6" />
                        <SheetDescription className="text-lg font-semibold mb-4">Order Details</SheetDescription>
                        <div className="space-y-4">
                            {details.order ? (
                                <div>
                                    <p className="text-sm"><span className="font-medium">Total Price:</span> {details.order.totalPrice} VND</p>
                                    <p className="text-sm"><span className="font-medium">Discount Price:</span> {details.order.discountPrice} VND</p>
                                    <p className="text-sm"><span className="font-medium">Items:</span></p>
                                    {details.order.details.map(item => (
                                        <div key={item.id} className="ml-4">
                                            <p className="text-sm">
                                                {item.quantity} x {item.menuItem.name} - {item.menuItem.price} VND
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-600">No order details available.</p>
                            )}
                        </div>
                        <div className="mt-8">
                            <Button 
                                variant="outline" 
                                className={`w-full ${canCancel() ? 'bg-red-500 text-white hover:bg-red-600' : ''}`}
                                disabled={!canCancel()}
                                onClick={handleCancel} 
                            >
                                {canCancel() ? 'Cancel Reservation' : 'Cannot Cancel Reservation'}
                            </Button>
                        </div>
                    </div>
                )}
            </SheetContent>
            <ToastContainer containerId="B" position="top-right" autoClose={3000} />
        </Sheet>
    );
};

export default ReservationDrawer;
