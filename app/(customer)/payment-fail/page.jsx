'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PaymentFailed = () => {
    const router = useRouter();

    const handleGoHome = () => {
        router.push('/'); 
    };

    return (
        <>
            <Header bgColor="bg-white" />
            <div className="min-h-screen bg-gray-100 pt-28 pb-12">
                <Card className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
                    <CardContent className="p-8 text-center">
                        <h1 className="text-3xl font-bold mb-4">Thanh Toán Thất Bại</h1>
                        <p className="text-lg mb-4">Rất tiếc, thanh toán của bạn đã không thành công. Vui lòng kiểm tra lại thông tin thanh toán hoặc thử lại sau.</p>
                        <p className="text-lg mb-8">Nếu bạn cần hỗ trợ, vui lòng liên hệ với chúng tôi.</p>
                        <Button
                            onClick={handleGoHome}
                            className="bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-6 rounded-lg text-lg font-semibold transition-colors duration-200"
                        >
                            Quay về trang chính
                        </Button>
                    </CardContent>
                </Card>
            </div>
            <Footer />
        </>
    );
};

export default PaymentFailed;
