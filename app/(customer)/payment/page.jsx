'use client'
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Loading from '@/components/Loading';
import { useSelector } from 'react-redux';
import dynamic from "next/dynamic";

const PaymentPage = () => {
    const router = useRouter();
    const bookingInfo = useSelector((state) => state.booking);
    const [selectedPayment, setSelectedPayment] = useState(null);

    const paymentMethods = [
        { id: 'visa', src: '/images/payment-1.png', alt: 'Visa' },
        { id: 'mastercard', src: '/images/payment-2.png', alt: 'Mastercard' },
        { id: 'paypal', src: '/images/payment-3.png', alt: 'PayPal' },
        { id: 'amex', src: '/images/payment-4.png', alt: 'American Express' },
    ];

    if (!bookingInfo.date) return <Loading />;
    const handlePayment = async () => {
        if (!selectedPayment) {
            alert('Please select a payment method');
            return;
        }
    
            try {
                const response = await fetch(`http://localhost:3005/payment/create_payment_url?orderId=${bookingInfo.orderId}&amount=${bookingInfo.totalAmount}`); // Thay đổi URL nếu cần
                const data = await response.json();
                const paymentUrl = data.paymentUrl;
    
                // Redirect to VNPay payment URL
                if (data.paymentUrl) {
                    window.location.href = paymentUrl; 
                } else {
                    alert('Failed to get payment URL from server');
                }
            } catch (error) {
                console.log("error", error)
                // alert('Error processing payment: ' + error.message);
            }
        
    };
    
    
    return (
        <>
            <Header bgColor="bg-white" />
            <div className="min-h-screen bg-gray-100 pt-28 pb-12">
                <Card className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
                    <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Left column - Payment methods */}
                            <div className="w-full md:w-1/2">
                                <h2 className="text-2xl font-semibold mb-6">How would you like to pay?</h2>
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    {paymentMethods.map((method) => (
                                        <div
                                            key={method.id}
                                            className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                                                selectedPayment === method.id
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

                            {/* Right column - Order summary */}
                            <div className="w-full md:w-1/2 bg-gray-50 rounded-lg p-6">
                                <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span>Date:</span>
                                        <span>{bookingInfo.date}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Time:</span>
                                        <span>{bookingInfo.time}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Table:</span>
                                        <span>Table {bookingInfo.table.id} ({bookingInfo.table.seats} seats)</span>
                                    </div>
                                    {bookingInfo.preOrderItems.length > 0 && (
                                        <>
                                            <h3 className="font-semibold">Pre-ordered Items:</h3>
                                            {bookingInfo.preOrderItems.map((item, index) => (
                                                <div key={index} className="flex justify-between">
                                                    <span>{item.name}</span>
                                                    <span>${item.price.toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                    <div className="border-t pt-4">
                                        <div className="flex justify-between font-semibold text-lg">
                                            <span>Total</span>
                                            <span>${bookingInfo.totalAmount.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    onClick={handlePayment}
                                    className="w-full mt-8 bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-3 rounded-lg text-lg font-semibold transition-colors duration-200"
                                >
                                    Continue to secure payment
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

export default dynamic(() => Promise.resolve(PaymentPage), { ssr: false })