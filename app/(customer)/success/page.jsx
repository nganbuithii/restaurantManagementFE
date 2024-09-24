'use client'
import React, { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import dynamic from "next/dynamic";
import { useSelector } from 'react-redux';
import { authApi, endpoints } from '@/app/configs/API';
const PaymentSuccess = () => {
    const router = useRouter();
    const token = useSelector((state) => state.auth.token);
    const bookingInfo = useSelector((state) => state.booking);
    const handleGoHome = () => {
        router.push('/');
    };
    const handleVnpayReturn = useCallback(async (query) => {
        try {
            const vnp_ResponseCode = query.vnp_ResponseCode;
            const vnp_TxnRef = query.vnp_TxnRef;
            const vnp_PayDate = query.vnp_PayDate;
            const vnp_TransactionStatus = query.vnp_TransactionStatus;

            const paymentData = {
                vnp_ResponseCode,
                vnp_TxnRef,
                vnp_PayDate,
                vnp_TransactionStatus
            };
            await authApi(token).post(endpoints.vnpay_return, paymentData);


        } catch (error) {
            console.error("Lỗi", error);
            alert('Đã xảy ra lỗi khi xử lý thanh toán');
            router.push('/payment-failed');
        }
    }, [token, router]);

    useEffect(() => {
        const url = endpoints.getReservationById(bookingInfo.id);
        console.log("URLLL", url)
        const handleQuery = async () => {
            const query = new URLSearchParams(window.location.search);
            const queryObj = Object.fromEntries(query);
            if (queryObj.vnp_Amount && queryObj.vnp_TransactionStatus && queryObj.vnp_SecureHash) {
                const vnp_TxnRef = queryObj.vnp_TxnRef;
                console.log("ID ORDER", vnp_TxnRef)
                const response = await authApi(token).patch(endpoints.getReservationById(bookingInfo.id), {
                    orderId: Number(vnp_TxnRef)
                });
                console.log("RESPONSE", response.data.data)
                // handleVnpayReturn(queryObj);
            }
        };

        handleQuery();
    }, [bookingInfo.id, token]);

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-yellow-50 to-orange-100">
            <Header bgColor="bg-transparent" />
            <main className="flex-grow flex items-center justify-center px-4 py-12">
                <Card className="w-full max-w-2xl bg-white shadow-2xl rounded-3xl overflow-hidden">
                    <CardContent className="p-8 sm:p-12">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold mb-4 text-gray-800">Thanh Toán Thành Công</h1>
                            <div className="mb-8">
                                <Image
                                    src="/images/success.webp"
                                    alt="Success illustration"
                                    width={200}
                                    height={200}
                                    className="mx-auto rounded-full shadow-lg"
                                />
                            </div>
                            <p className="text-xl text-gray-600 mb-8">Cảm ơn bạn đã thanh toán. Đơn hàng của bạn đã được xử lý thành công.</p>
                            <Button
                                onClick={handleGoHome}
                                className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white py-3 px-8 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
                            >
                                Quay về trang chính
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </main>
            <Footer />
        </div>
    );
};


export default dynamic(() => Promise.resolve(PaymentSuccess), { ssr: false });