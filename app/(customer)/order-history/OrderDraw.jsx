import React, { useCallback, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { authApi, endpoints } from '@/app/configs/API';
import { useSelector } from 'react-redux';
import { ShoppingBag, Calendar, DollarSign, Package } from 'lucide-react';
import Loading from '@/components/Loading';
import { Button } from '@/components/ui/button';

const OrderDrawer = ({ isOpen, onClose, orderId }) => {
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = useSelector((state) => state.auth.token);
    const [canCancel, setCanCancel] = useState(false);


    const fetchOrderDetails = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await authApi(token).get(endpoints.getOrderById(orderId));
            setOrderDetails(response.data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [orderId, token]);
    React.useEffect(() => {
        if (isOpen && orderId) {
            fetchOrderDetails();
        }
    }, [isOpen, orderId, fetchOrderDetails]);
    const checkCancellationEligibility = (createdAt) => {
        const appointmentTime = new Date(createdAt);
        const now = new Date();
        const timeDifference = appointmentTime.getTime() - now.getTime();
        const hoursDifference = timeDifference / (1000 * 3600);
        setCanCancel(hoursDifference > 12);
    };

    const handleCancelAppointment = async () => {
        if (!canCancel) return;

        try {
            setLoading(true);
            // API call to cancel the appointment
            await authApi(token).post(endpoints.cancelOrder(orderId));
            // Handle successful cancellation (e.g., show a success message, close drawer, refresh order list)
            onClose();
            // You might want to trigger a refresh of the parent component here
        } catch (err) {
            setError("Failed to cancel the appointment. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'COMPLETED':
                return 'bg-green-100 text-green-800 border-green-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="sm:max-w-md">
                <SheetHeader>
                    <SheetTitle className="text-2xl font-bold text-orange-800">Order Details</SheetTitle>
                </SheetHeader>
                {loading && <p className="text-center py-4"><Loading /></p>}
                {error && <p className="text-center text-red-500 py-4">{error}</p>}
                {orderDetails && (
                    <div className="mt-6">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-semibold text-gray-700">Order #{orderDetails.id}</span>
                            <Badge className={`${getStatusColor(orderDetails.status)} px-3 py-1 rounded-full text-xs font-medium border`}>
                                {orderDetails.status}
                            </Badge>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center text-gray-600">
                                <Calendar className="mr-2" size={18} />
                                <p className="text-sm">
                                    <span className="font-medium">Ordered on:</span> {formatDate(orderDetails.createdAt)}
                                </p>
                            </div>
                            <div className="flex items-center text-orange-600">
                                <p className="text-lg font-bold">
                                    ${orderDetails.totalPrice.toLocaleString()}
                                </p>
                            </div>
                            {orderDetails.discountPrice > 0 && (
                                <p className="text-sm text-green-600 ml-6">
                                    <span className="font-medium">Discount:</span> ${orderDetails.discountPrice.toLocaleString()}
                                </p>
                            )}
                        </div>
                        <Separator className="my-6" />
                        <SheetDescription className="text-lg font-semibold mb-4">Order Items</SheetDescription>
                        <div className="space-y-4">
                            {orderDetails.details.map((item) => (
                                <div key={item.id} className="flex items-start">
                                    <Package className="mr-3 mt-1 text-gray-400" size={18} />
                                    <div>
                                        <p className="font-medium text-gray-800">{item.menuItemName}</p>
                                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
};

export default OrderDrawer;