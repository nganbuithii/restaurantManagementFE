import React from 'react';
import { FileText } from 'lucide-react';
import { format } from 'date-fns';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const Step6 = ({ date, selectedTime, selectedTable, wantToPreOrder, selectedItems, dishes }) => {
    const calculateTotal = () => {
        return selectedItems.reduce((total, id) => {
            const item = dishes.find(dish => dish.id === id);
            return total + (item ? item.price : 0);
        }, 0);
    };

    const totalPrice = calculateTotal();

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                <FileText className="mr-2 text-orange-500" />
                Booking Invoice
            </h2>
            <Card className="bg-white shadow-lg">
                <CardHeader className="bg-orange-500 text-white">
                    <CardTitle className="text-2xl">Reservation Details</CardTitle>
                    <CardDescription className="text-orange-100">
                        Thank you for choosing our restaurant
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <p className="text-sm text-gray-600">Reservation Date</p>
                            <p className="text-lg font-semibold">{format(date, 'MMMM d, yyyy')}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Reservation Time</p>
                            <p className="text-lg font-semibold">{selectedTime}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Table Number</p>
                            <p className="text-lg font-semibold">Table {selectedTable.id}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Number of Seats</p>
                            <p className="text-lg font-semibold">{selectedTable.seats} seats</p>
                        </div>
                    </div>

                    {wantToPreOrder && (
                        <>
                            <h3 className="text-xl font-semibold mb-4 text-orange-600">Pre-ordered Items</h3>
                            <div className="bg-orange-50 p-4 rounded-lg mb-4">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-orange-200">
                                            <th className="text-left py-2">Item</th>
                                            <th className="text-right py-2">Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedItems.map(id => {
                                            const item = dishes.find(dish => dish.id === id);
                                            return item ? (
                                                <tr key={id} className="border-b border-orange-100">
                                                    <td className="py-2">{item.name}</td>
                                                    <td className="text-right py-2">${item.price.toFixed(2)}</td>
                                                </tr>
                                            ) : null;
                                        })}
                                    </tbody>
                                    <tfoot>
                                        <tr className="font-semibold">
                                            <td className="py-2">Total</td>
                                            <td className="text-right py-2">${totalPrice.toFixed(2)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </>
                    )}

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">Please arrive 10 minutes before your reservation time.</p>
                        <p className="text-sm text-gray-600">We look forward to serving you!</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Step6;