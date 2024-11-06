'use client';
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import Header from '@/components/header';
import Footer from '@/components/footer';
import dynamic from "next/dynamic";
import { useSelector } from 'react-redux';
import API, { authApi, endpoints } from '@/app/configs/API';
import withLoading from '../../../hoc/withLoading';

const PaymentPage = () => {
    const token = useSelector((state) => state.auth.token);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [isLoading, setIsLoading] = useState(false); 
    const { preOrderItems, totalAmount } = useSelector((state) => state.booking);

    const paymentMethods = [
        { id: 'visa', src: '/images/payment-1.png', alt: 'Visa' },
        { id: 'mastercard', src: '/images/payment-2.png', alt: 'Mastercard' },
        { id: 'paypal', src: '/images/payment-3.png', alt: 'PayPal' },
        { id: 'amex', src: '/images/payment-4.png', alt: 'American Express' },
    ];

    const handlePayment = async () => {
        if (!selectedPayment) {
            alert('Please select a payment method');
            return;
        }

        try {
            setIsLoading(true); 

            if (preOrderItems.length === 0) {
                alert("No items in the order.");
                return;
            }

            console.log("TEST", preOrderItems)
            const orderData = {
                status: "PENDING",
                discountPrice: 0,
                details: preOrderItems.map((item) => {
                    const menuItemId = Number(item.id);

                    if (!menuItemId) {
                        throw new Error("Invalid menuItemId for item: " + JSON.stringify(item));
                    }
                    return {
                        menuItemId: menuItemId,
                        quantity: item.quantity
                    };
                }),
            };

            const orderResponse = await authApi(token).post(endpoints.getAllOrders, orderData);
            const orderId = orderResponse.data.data.id;

            const paymentData = {
                orderId: orderId,
                amount: totalAmount,
            };

            const vnpayResponse = await API.post(endpoints.get_vnpay, paymentData);
            const { paymentUrl } = vnpayResponse.data;

            if (paymentUrl) {
                window.location.href = paymentUrl;  
            } else {
                alert('Failed to get payment URL from server');
            }
        } catch (error) {
            console.log("Order Error:", error.response ? error.response.data : error.message);
            alert('Failed to create order: ' + (error.response ? JSON.stringify(error.response.data) : error.message));
        } finally {
            setIsLoading(false); 
        }
    };




    return (
        <>
            <Header bgColor="bg-white" />
            <div className="min-h-screen bg-gray-100 pt-28 pb-12">
                <Card className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
                    <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Cột trái - Phương thức thanh toán */}
                            <div className="w-full md:w-1/2">
                                <h2 className="text-2xl font-semibold mb-6">How would you like to pay?</h2>
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    {paymentMethods.map((method) => (
                                        <div
                                            key={method.id}
                                            className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${selectedPayment === method.id
                                                ? 'border-blue-500 shadow-md'
                                                : 'border-gray-200 hover:border-blue-300'
                                                }`}
                                            onClick={() => setSelectedPayment(method.id)}
                                        >
                                            <Image
                                                src={method.src}
                                                alt={method.alt}
                                                width={100}
                                                height={60}
                                                className="object-contain mx-auto"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Cột phải - Tóm tắt đơn hàng */}
                            <div className="w-full md:w-1/2 bg-gray-50 rounded-lg p-6">
                                <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
                                <div className="space-y-4">
                                    <div className="mt-4 border-t pt-4">
                                        <div className="flex justify-between items-center">
                                            <span>Pre-order Items:</span>
                                        </div>
                                        <ul className="list-disc pl-5 mt-2">
                                            {preOrderItems.map((item) => (
                                                <li key={item.id} className="text-sm text-gray-700">
                                                    {item.name} - Quantity: {item.quantity}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="border-t pt-4">
                                        <div className="flex justify-between font-semibold text-lg">
                                            <span>Total Amount</span>
                                            <div>
                                                <span className="text-green-600">${totalAmount.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    onClick={handlePayment}
                                    className="w-full mt-8 bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-3 rounded-lg text-lg font-semibold transition-colors duration-200 hover:from-yellow-600 hover:to-orange-700"
                                    disabled={isLoading} // Disable button while loading
                                >
                                    {isLoading ? 'Processing...' : 'Continue to secure payment'}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <Footer />
        </>
    );
};

export default dynamic(() => Promise.resolve(withLoading(PaymentPage)), { ssr: false });
