import React from 'react';
import { FileText, Calendar, Clock, Users, Utensils } from 'lucide-react';
import { format } from 'date-fns';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const Step6 = ({ date, selectedTime, selectedTable, wantToPreOrder, selectedItems, dishes, quantities }) => {
    const calculateTotal = () => {
        return selectedItems.reduce((total, id) => {
            const dish = dishes.find(dish => dish.id === id);
            const quantity = quantities[id] || 1;
            return total + (dish ? dish.price * quantity : 0);
        }, 0);
    };

    const totalPrice = calculateTotal();

    return (
        <div className="max-w-4xl mx-auto  ">
            {/* <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <FileText className="mr-3 text-blue-600" />
                Reservation Invoice
            </h2> */}
            <Card className="bg-white overflow-hidden">
                <CardHeader className="bg-gradient-to-r  from-orange-400 to-red-500 text-white p-6">
                    <CardTitle className="text-2xl font-bold">Reservation Details</CardTitle>
                    <p className="text-blue-100 mt-2">
                        Thank you for choosing our restaurant
                    </p>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-2 gap-6 mb-8">
                        <div className="flex items-center space-x-3">
                            <Calendar className="text-orange-500" />
                            <div>
                                <p className="text-sm text-gray-500">Reservation Date</p>
                                <p className="text-lg font-semibold">{format(date, 'MMMM d, yyyy')}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Clock className="text-orange-500" />
                            <div>
                                <p className="text-sm text-gray-500">Reservation Time</p>
                                <p className="text-lg font-semibold">{selectedTime}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Utensils className="text-orange-500" />
                            <div>
                                <p className="text-sm text-gray-500">Table Number</p>
                                <p className="text-lg font-semibold">Table {selectedTable.id}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Users className="text-orange-500" />
                            <div>
                                <p className="text-sm text-gray-500">Number of Seats</p>
                                <p className="text-lg font-semibold">{selectedTable.seats} seats</p>
                            </div>
                        </div>
                    </div>

                    {wantToPreOrder && (
                        <>
                            <h3 className="text-xl font-bold mb-4 text-orange-600">Pre-ordered Items</h3>
                            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-2 text-gray-600">Item</th>
                                            <th className="text-center py-2 text-gray-600">Quantity</th>
                                            <th className="text-right py-2 text-gray-600">Price</th>
                                            <th className="text-right py-2 text-gray-600">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedItems.map(id => {
                                            const dish = dishes.find(dish => dish.id === id);
                                            const quantity = quantities[id] || 1;
                                            return (
                                                <tr key={id} className="border-b border-gray-100">
                                                    <td className="py-2">{dish.name}</td>
                                                    <td className="text-center py-2">{quantity}</td>
                                                    <td className="text-right py-2">${dish.price.toFixed(2)}</td>
                                                    <td className="text-right py-2">${(dish.price * quantity).toFixed(2)}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}

                    <div className="flex justify-between items-center bg-orange-50 p-4 rounded-lg">
                        <span className="text-xl font-bold text-orange-800">Total</span>
                        <span className="text-2xl font-bold text-orange-600">${totalPrice.toFixed(2)}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Step6;