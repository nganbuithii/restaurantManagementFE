import React, { useCallback, useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { authApi, endpoints } from '@/app/configs/API';
import { useSelector } from 'react-redux';
import { Calendar, Clock, User, Phone, X, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, isValid, differenceInHours, parseISO } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Skeleton } from "@/components/ui/skeleton";
import DishSelectionDialog from './DishSelectionDialog'
const ReservationDrawer = ({ isOpen, onClose, reservationId, onCancel, onChooseDishes }) => {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = useSelector((state) => state.auth.token);
    const [isDishSelectionOpen, setIsDishSelectionOpen] = useState(false);

    const handleChooseDishes = () => {
        setIsDishSelectionOpen(true);
    };
    const handleDishSelectionSuccess = () => {
        setIsDishSelectionOpen(false);
        onClose(); 
    };
    const fetchReservationDetails = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await authApi(token).get(endpoints.getReservationById(reservationId));
            setDetails(response.data.data.data);
        } catch (err) {
            console.error("API fetch error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [reservationId, token]);

    useEffect(() => {
        if (isOpen && reservationId) {
            fetchReservationDetails();
        }
    }, [isOpen, reservationId, fetchReservationDetails]);

    const getStatusColor = (status) => {
        const statusColors = {
            PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            CONFIRMED: 'bg-green-100 text-green-800 border-green-300',
            CANCELLED: 'bg-red-100 text-red-800 border-red-300'
        };
        return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Invalid Date';
        const date = parseISO(dateString);
        return isValid(date) ? format(date, 'dd/MM/yyyy') : 'Invalid Date';
    };

    const canCancel = () => {
        if (!details || details.status !== 'PENDING') return false;
        const { date, time } = details;
        if (!date || !time) return false;

        const [hours, minutes] = time.split(':').map(Number);
        const reservationDate = parseISO(date);
        if (!isValid(reservationDate)) return false;

        const reservationDateTime = new Date(reservationDate);
        reservationDateTime.setHours(hours, minutes);

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
        try {
            await authApi(token).patch(endpoints.changeStatusReser(reservationId), { status: "CANCELLED" });
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

    const renderActionButtons = () => {
        const buttons = [];

        if (canCancel()) {
            buttons.push(
                <Button
                    key="cancel"
                    className="flex-1 bg-gradient-to-r from-orange-300 to-orange-400 text-white hover:from-orange-400 hover:to-orange-500 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg rounded-lg py-2 font-semibold text-sm"
                    onClick={handleCancel}
                >
                    <X className="mr-1 h-4 w-4" /> Cancel
                </Button>
            );
        }

        if (details?.status === 'PENDING' && !details?.order) {
            buttons.push(
                <Button
                    key="choose-dishes"
                    className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg rounded-lg py-2 font-semibold text-sm"
                    onClick={handleChooseDishes}
                >
                    <Utensils className="mr-1 h-4 w-4" /> Choose Dishes
                </Button>
            );
        }

        if (buttons.length === 0) {
            buttons.push(
                <Button
                    key="no-action"
                    className="w-full bg-gray-300 text-gray-600 cursor-not-allowed rounded-lg py-2 font-semibold text-sm"
                    disabled
                >
                    No Actions Available
                </Button>
            );
        }

        return (
            <div className="flex space-x-3 w-full">
                {buttons}
            </div>
        );
    };


    const renderContent = () => {
        if (loading) {
            return (
                <div className="space-y-4">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                </div>
            );
        }

        if (error) {
            return <p className="text-center text-red-500 py-4">{error}</p>;
        }

        if (!details) {
            return <p className="text-center text-gray-500 py-4">No reservation details available.</p>;
        }

        return (
            <>
                <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-gray-700">Reservation #{details.id}</span>
                    <Badge className={`${getStatusColor(details.status)} px-3 py-1 rounded-full text-xs font-medium border`}>
                        {details.status}
                    </Badge>
                </div>
                <div className="space-y-4">
                    <InfoItem icon={Calendar} label="Date" value={formatDate(details.date)} />
                    <InfoItem icon={Clock} label="Time" value={details.time || 'No information'} />
                </div>
                <Separator className="my-6" />
                <SheetDescription className="text-lg font-semibold mb-4">Customer Information</SheetDescription>
                <div className="space-y-4">
                    <InfoItem icon={User} label="Name" value={details.user?.fullName || 'N/A'} />
                    <InfoItem icon={Phone} label="Phone" value={details.user?.phone || 'N/A'} />
                </div>
                <Separator className="my-6" />
                <SheetDescription className="text-lg font-semibold mb-4">Order Details</SheetDescription>
                {renderOrderDetails()}
            </>
        );
    };

    const renderOrderDetails = () => {
        if (!details.order) {
            return <p className="text-sm text-gray-600">No order details available.</p>;
        }

        return (
            <div className="space-y-4">
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
        );
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="sm:max-w-md flex flex-col h-full">
                <SheetHeader>
                    <SheetTitle className="text-2xl font-bold text-orange-800">Reservation Details</SheetTitle>
                </SheetHeader>
                <div className="flex-grow overflow-y-auto py-4">
                    {renderContent()}
                </div>
                <SheetFooter className="mt-auto">
                    <div className="w-full space-y-2">
                        {renderActionButtons()}
                    </div>
                </SheetFooter>
            </SheetContent>
            <DishSelectionDialog
                isOpen={isDishSelectionOpen}
                onClose={() => setIsDishSelectionOpen(false)}
                reservationId={reservationId}
                onSuccess={handleDishSelectionSuccess}
                token={token} />
            <ToastContainer containerId="B" position="top-right" autoClose={3000} />
        </Sheet>
    );
};

const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-center text-gray-600">
        <Icon className="mr-2" size={18} />
        <p className="text-sm">
            <span className="font-medium">{label}:</span> {value}
        </p>
    </div>
);

export default ReservationDrawer;