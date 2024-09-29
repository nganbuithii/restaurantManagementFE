'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Loading from '@/components/Loading';
import { useSelector, useDispatch } from 'react-redux';
import dynamic from "next/dynamic";
import API, { endpoints } from '@/app/configs/API';
import VoucherDrawer from './VoucherDrawer';
import { setSelectedVoucher } from '@/app/store/bookingSlice';

const PaymentPage = () => {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);
    const router = useRouter();
    const bookingInfo = useSelector((state) => state.booking);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isVoucherDrawerOpen, setIsVoucherDrawerOpen] = useState(false);
    const [totalAmount, setTotalAmount] = useState(bookingInfo.totalAmount);
    const [originalAmount] = useState(bookingInfo.totalAmount);

    const selectedVoucher = useSelector((state) => state.booking.selectedVoucher);
    const handleApplyVoucher = useCallback((voucher) => {
        console.log('Applying voucher:', voucher);
        console.log('Original amount:', originalAmount);
    
        if (voucher && voucher.percent) {
            const remainingPercentage = 100 - voucher.percent;
            const discountedTotal = (originalAmount * remainingPercentage) / 100;
            console.log('Discounted total:', discountedTotal);
            setTotalAmount(discountedTotal > 0 ? discountedTotal : 0);
        } else {
            setTotalAmount(originalAmount);
        }
    
        console.log('New total amount:', totalAmount);
    }, [originalAmount, totalAmount]);
    useEffect(() => {
        if (selectedVoucher) {
            handleApplyVoucher(selectedVoucher);
        }
    }, [selectedVoucher, handleApplyVoucher]); 

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
            setIsLoading(true);
            const paymentData = {
                orderId: bookingInfo.orderId,
                amount: totalAmount,
                voucherCode: selectedVoucher?.code
            };
            const response = await API.post(endpoints.get_vnpay, paymentData);
            const { paymentUrl } = response.data;

            if (paymentUrl) {
                window.location.href = paymentUrl;
            } else {
                alert('Failed to get payment URL from server');
            }
        } catch (error) {
            console.log("error", error);
            alert('An error occurred while processing the payment');
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
                            {/* Left column - Payment methods and Voucher */}
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
                                    <div className="mt-4 border-t pt-4">
                                        <div className="flex justify-between items-center">
                                            <span>Voucher</span>
                                            <Button variant="outline" onClick={() => setIsVoucherDrawerOpen(true)}>
                                                {selectedVoucher ? selectedVoucher.code : 'Choose Voucher'}
                                            </Button>
                                        </div>
                                        {selectedVoucher && (
                                            <p className="text-sm text-green-600 mt-2">
                                                Discount Applied: {selectedVoucher.percent}%
                                            </p>
                                        )}
                                    </div>
                                    <div className="border-t pt-4">
                <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <div>
                        {selectedVoucher && (
                            <span className="line-through text-gray-500 mr-2">
                                ${originalAmount.toFixed(2)}
                            </span>
                        )}
                        <span className="text-green-600">${totalAmount.toFixed(2)}</span>
                    </div>
                </div>
            </div>
                                </div>
                                <Button
                                    onClick={handlePayment}
                                    className="w-full mt-8 bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-3 rounded-lg text-lg font-semibold transition-colors duration-200 hover:from-yellow-600 hover:to-orange-700"
                                >
                                    {isLoading ? 'Processing...' : 'Continue to secure payment'}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <Footer />

            {/* Voucher Drawer */}
            <VoucherDrawer
                isOpen={isVoucherDrawerOpen}
                onClose={() => setIsVoucherDrawerOpen(false)}
                onApply={handleApplyVoucher}
            />
        </>
    );
};

export default dynamic(() => Promise.resolve(PaymentPage), { ssr: false });