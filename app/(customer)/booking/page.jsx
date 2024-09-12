'use client'
import React, { useState, useCallback, useEffect } from 'react';
import { format, addDays } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Footer from "@/components/footer";
import Header from "@/components/header";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dynamic from "next/dynamic";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Search, Clock, Table, Utensils, CheckCircle, FileText } from 'lucide-react';
import API, { authApi, endpoints } from '@/app/configs/API';
import { useDispatch, useSelector } from 'react-redux';
import Step1 from "./Step1"
import Step2 from "./Step2"
import Step3 from "./Step3"
import Step4 from "./Step4"
import Step5 from "./Step5"
import Step6 from "./Step6"
import { useRouter } from 'next/navigation';
import { setBookingInfo } from '@/app/store/bookingSlice';

const timeSlots = [
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'
];

function ModernBookingTable() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [date, setDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedTable, setSelectedTable] = useState(null);
    const [step, setStep] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [wantToPreOrder, setWantToPreOrder] = useState(null);
    const [tables, setTables] = useState([]);
    const [dishes, setDishes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const token = useSelector((state) => state.auth.token);


    const availableDates = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i));

    const handlePreOrderDecision = (decision) => {
        setWantToPreOrder(decision);
        setStep(decision ? 5 : 6);
    };

    const handleMenuItemToggle = (itemId) => {
        setSelectedItems(prev =>
            prev.includes(itemId)
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        );
    };

    const fetchTables = useCallback(async () => {
        try {
            const response = await API.get(endpoints.getTables, {
                params: {
                    page: currentPage,
                }
            });
            console.log("GET SUCCESS");
            setTables(response.data.data.data);
        } catch (error) {
            console.error("Failed to fetch tables:", error);
        }
    }, [currentPage]);

    const fetchDishes = useCallback(async () => {
        console.log("fetch dishes");
        try {
            const response = await API.get(endpoints.getAllDishes, {
                params: { page: currentPage }
            });
            setDishes(response.data.data.data);

            const total = response.data.data.total;
            const itemsPerPage = response.data.data.itemsPerPage;
            setTotalPages(Math.ceil(total / itemsPerPage));
            
        } catch (error) {
            console.error("Failed to fetch dishes:", error);
        }
    }, [currentPage]);

    useEffect(() => {
        fetchTables();
        fetchDishes();
    }, [fetchTables, fetchDishes]);

    const filteredMenuItems = dishes.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <Step1
                        date={date}
                        setDate={setDate}
                        setStep={setStep}
                        availableDates={availableDates}
                    />
                );
            case 2:
                return (
                    <Step2
                        selectedTime={selectedTime}
                        setSelectedTime={setSelectedTime}
                        setStep={setStep}
                        timeSlots={timeSlots}
                    />
                );
            case 3:
                return (
                    <Step3
                        tables={tables}
                        selectedTable={selectedTable}
                        setSelectedTable={setSelectedTable}
                        setStep={setStep}
                        renderTableShape={renderTableShape}
                    />
                );
            case 4:
                return (
                    <Step4
                        handlePreOrderDecision={handlePreOrderDecision}
                    />
                );
                case 5:
                    return (
                        <Step5
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            dishes={dishes}
                            selectedItems={selectedItems}
                            handleMenuItemToggle={handleMenuItemToggle}
                        />
                    );
                case 6:
                    return (
                        <Step6
                            date={date}
                            selectedTime={selectedTime}
                            selectedTable={selectedTable}
                            wantToPreOrder={wantToPreOrder}
                            selectedItems={selectedItems}
                            dishes={dishes}
                        />
                    );
            default:
                return null;
        }
    };

    const renderTableShape = (shape, isSelected) => {
        const baseStyle = "w-16 h-16 border-2 transition-all duration-300 " +
            (isSelected ? "border-orange-500 bg-orange-100" : "border-gray-300 bg-white");

        switch (shape) {
            case 'circle':
                return <div className={`${baseStyle} rounded-full`}></div>;
            case 'rectangle':
                return <div className={`${baseStyle} rounded w-24`}></div>;
            case 'square':
                return <div className={`${baseStyle} rounded`}></div>;
            case 'oval':
                return <div className={`${baseStyle} rounded-full w-24`}></div>;
            default:
                return <div className={baseStyle}></div>;
        }
    };
    const calculateTotalAmount = () => {
        return selectedItems.reduce((total, itemId) => {
            const dish = dishes.find(d => d.id === itemId);
            return total + (dish ? dish.price : 0);
        }, 0);
    };

    const handConfirm = async () => {
        const reservationData = {
            tableId: selectedTable?.id,
            time: selectedTime,
            date: format(date, 'yyyy-MM-dd'),
        };
    
        if (wantToPreOrder) {
            reservationData.menuItemIds = selectedItems;
        }
    
        try {
            console.log("Sending reservation data:", reservationData);
            const response = await authApi(token).post(endpoints.getAllReservations, reservationData);
            console.log("Booking table success:", response.data);
        
            // Tính tổng tiền
            const totalAmount = calculateTotalAmount();
            dispatch(setBookingInfo({
                date: format(date, 'MMMM d, yyyy'),
                time: selectedTime,
                table: selectedTable,
                preOrderItems: wantToPreOrder ? selectedItems.map(id => {
                    const dish = dishes.find(d => d.id === id);
                    return { id: dish.id, name: dish.name, price: dish.price };
                }) : [],
                totalAmount: totalAmount
            }));
            toast.success("Booking reservation successfully", { containerId: 'A' });
            setTimeout(() => {
                if (totalAmount > 0) {
                    router.push('/payment');
                } else {
                    router.push('/');
                }
            }, 3000);

        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(` ${error.response.data.message || 'No detail error'}`, {
                    containerId: 'A'
                });
            } else {
                toast.error('Error booking reservation', { containerId: 'A' });
                console.log(error)
            }

            setTimeout(() => {
                // router.push('/');
            }, 3000);
        }
    }
    

    return (
        <>
            <Header bgColor="bg-orange-500" />
            <div className="min-h-screen bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300 pt-28 pb-12">
                <Card className="max-w-4xl mx-auto shadow-2xl">
                    <CardHeader className="bg-orange-500 text-white rounded-t-lg">
                        <CardTitle className="text-3xl font-bold text-center">Book Your Table</CardTitle>
                        <CardDescription className="text-center text-orange-100">
                            Follow the steps to reserve your perfect dining experience
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        {renderStepContent()}
                    </CardContent>
                    <CardFooter className="flex justify-between bg-gray-50 rounded-b-lg">
                        {step > 1 && step !== 6 && (
                            <Button variant="outline" onClick={() => setStep(step - 1)} className="border-orange-500 text-orange-500 hover:bg-orange-50">
                                Back
                            </Button>
                        )}
                        {step < 6 ? (
                            <Button
                                onClick={() => setStep(step + 1)}
                                disabled={(step === 1 && !date) || (step === 2 && !selectedTime) || (step === 3 && !selectedTable) || (step === 4 && wantToPreOrder === null)}
                                className="bg-orange-500 hover:bg-orange-600 text-white"
                            >
                                {step === 5 ? "Finish Pre-order" : "Continue"}
                            </Button>
                        ) : (
                            <Button onClick={() => handConfirm()} className="bg-green-500 hover:bg-green-600 text-white">
                                Confirm Booking
                            </Button>
                        )}
                    </CardFooter>
                </Card>
                <ToastContainer containerId="A" position="top-right" autoClose={3000} />
            </div>
            <Footer />
        </>
    );
}

export default dynamic(() => Promise.resolve(ModernBookingTable), { ssr: false })