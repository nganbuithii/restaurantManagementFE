'use client'

import React, { useState } from 'react';
import { format, addDays } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Footer from "@/components/footer";
import Header from "@/components/header";
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
import { Search } from 'lucide-react';

const timeSlots = [
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'
];

const tables = [
    { id: 1, seats: 2, shape: 'circle' },
    { id: 2, seats: 4, shape: 'rectangle' },
    { id: 3, seats: 6, shape: 'rectangle' },
    { id: 4, seats: 2, shape: 'circle' },
    { id: 5, seats: 4, shape: 'square' },
    { id: 6, seats: 8, shape: 'oval' },
];

const menuItems = [
    { id: 1, name: 'Spaghetti Carbonara', category: 'Main Course', price: 12.99 },
    { id: 2, name: 'Margherita Pizza', category: 'Main Course', price: 10.99 },
    { id: 3, name: 'Caesar Salad', category: 'Appetizer', price: 8.99 },
    { id: 4, name: 'Tiramisu', category: 'Dessert', price: 6.99 },
    { id: 5, name: 'Grilled Salmon', category: 'Main Course', price: 15.99 },
    { id: 6, name: 'Vegetable Soup', category: 'Appetizer', price: 7.99 },
];

export default function BookingTable() {
    const [date, setDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedTable, setSelectedTable] = useState(null);
    const [step, setStep] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [wantToPreOrder, setWantToPreOrder] = useState(null);

    const availableDates = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i));

    const handleDateSelect = (newDate) => {
        setDate(newDate);
        setStep(2);
    };

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
        setStep(3);
    };

    const handleTableSelect = (table) => {
        setSelectedTable(table);
        setStep(4);
    };

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

    const filteredMenuItems = menuItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const renderTableShape = (shape, isSelected) => {
        const baseStyle = "w-16 h-16 border-2 transition-all duration-300 " +
            (isSelected ? "border-blue-500 bg-blue-100" : "border-gray-300 bg-white");

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

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-700">Step 1: Choose a Date</h2>
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={handleDateSelect}
                            className="rounded-md border shadow"
                            disabled={(date) => !availableDates.some(d => d.toDateString() === date.toDateString())}
                        />
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-700">Step 2: Select a Time</h2>
                        <div className="grid grid-cols-3 gap-3">
                            {timeSlots.map((time) => (
                                <Button
                                    key={time}
                                    onClick={() => handleTimeSelect(time)}
                                    variant={selectedTime === time ? "default" : "outline"}
                                >
                                    {time}
                                </Button>
                            ))}
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-700">Step 3: Choose a Table</h2>
                        <div className="grid grid-cols-3 gap-4">
                            {tables.map((table) => (
                                <div
                                    key={table.id}
                                    className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                                        selectedTable === table ? 'bg-blue-100 border-2 border-blue-500' : 'bg-white border border-gray-200'
                                    }`}
                                    onClick={() => handleTableSelect(table)}
                                >
                                    <div className="flex justify-center mb-2">
                                        {renderTableShape(table.shape, selectedTable === table)}
                                    </div>
                                    <p className="text-center font-medium">Table {table.id}</p>
                                    <p className="text-center text-sm text-gray-600">{table.seats} seats</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-700">Step 4: Would you like to pre-order?</h2>
                        <div className="flex justify-center space-x-4">
                            <Button onClick={() => handlePreOrderDecision(true)}>Yes, I would like to pre-order</Button>
                            <Button variant="outline" onClick={() => handlePreOrderDecision(false)}>No, I will order at the restaurant</Button>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-700">Step 5: Pre-order Menu</h2>
                        <div className="flex items-center space-x-2 mb-4">
                            <Search className="text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search menu items..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex-grow"
                            />
                        </div>
                        <div className="space-y-2">
                            {filteredMenuItems.map((item) => (
                                <div key={item.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`item-${item.id}`}
                                        checked={selectedItems.includes(item.id)}
                                        onCheckedChange={() => handleMenuItemToggle(item.id)}
                                    />
                                    <Label htmlFor={`item-${item.id}`} className="flex-grow">
                                        {item.name}
                                        <span className="text-sm text-gray-500 ml-2">({item.category})</span>
                                    </Label>
                                    <span className="text-sm font-medium">${item.price.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 6:
                return (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-700">Booking Summary</h2>
                        <div className="bg-gray-100 p-4 rounded-lg">
                            <p><strong>Date:</strong> {format(date, 'MMMM d, yyyy')}</p>
                            <p><strong>Time:</strong> {selectedTime}</p>
                            <p><strong>Table:</strong> Table {selectedTable.id} ({selectedTable.seats} seats)</p>
                            {wantToPreOrder && (
                                <div>
                                    <p><strong>Pre-ordered Items:</strong></p>
                                    <ul className="list-disc list-inside">
                                        {selectedItems.map(id => {
                                            const item = menuItems.find(item => item.id === id);
                                            return <li key={id}>{item.name} - ${item.price.toFixed(2)}</li>
                                        })}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>
           <Header bgColor="bg-orange-500" />
            <div className="min-h-screen bg-gradient-to-r from-blue-100 to-indigo-100  pt-28">
                <Card className="max-w-4xl mx-auto">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold text-center text-gray-800">Book a Table</CardTitle>
                        <CardDescription className="text-center text-gray-600">
                            Follow the steps to reserve your perfect dining experience
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {renderStepContent()}
                    </CardContent>
                    <CardFooter className="flex justify-between  ">
                        {step > 1 && step !== 6 && (
                            <Button variant="outline" onClick={() => setStep(step - 1)}>
                                Back
                            </Button>
                        )}
                        {step < 6 ? (
                            <Button onClick={() => setStep(step + 1)} disabled={
                                (step === 1 && !date) ||
                                (step === 2 && !selectedTime) ||
                                (step === 3 && !selectedTable) ||
                                (step === 4 && wantToPreOrder === null)
                            }>
                                {step === 5 ? "Finish Pre-order" : "Continue"}
                            </Button>
                        ) : (
                            <Button onClick={() => console.log('Booking completed')}>
                                Confirm Booking
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </div>
            <Footer />
        </>
    );
}