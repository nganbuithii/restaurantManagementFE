'use client';
import { ChangeEvent, useState } from 'react';
import Footer from "@/components/footer";
import Header from "@/components/header";
import { Button } from '@/components/ui/button';

export default function BookingTable() {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedTable, setSelectedTable] = useState(null);

    const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => setSelectedDate(e.target.value);
    const handleTimeChange = (e: ChangeEvent<HTMLInputElement>) => setSelectedTime(e.target.value);
    // const handleTableSelect = (table: string) => setSelectedTable(table);
    return (
        <>
            <Header />
            <main>
                <section className="flex flex-col items-center p-8 bg-gray-100 bg-cover bg-center opacity-90" style={{ backgroundImage: "url('/images/booking1.jpg')" }}>
                    <h1 className="text-4xl font-extrabold mb-6 text-white drop-shadow-lg">Book a Table</h1>
                    <div className="relative w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
                        <div className="mb-6">
                            <label className="block mb-2 text-lg font-semibold">
                                Select Date
                                <input 
                                    type="date" 
                                    className="w-full p-3 border border-gray-300 rounded-lg mt-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    required 
                                />
                            </label>
                            <label className="block mb-2 text-lg font-semibold">
                                Select Time
                                <input 
                                    type="time" 
                                    className="w-full p-3 border border-gray-300 rounded-lg mt-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    value={selectedTime}
                                    onChange={handleTimeChange}
                                    required 
                                />
                            </label>
                        </div>

                        {/* Color Legend */}
                        <div className="mb-6 text-sm text-gray-600">
                            <p className="mb-2 flex items-center">
                                <span className="inline-block w-5 h-5 bg-yellow-300 mr-2 rounded-full"></span>
                                <span>Yellow: Available</span>
                            </p>
                            <p className="flex items-center">
                                <span className="inline-block w-5 h-5 bg-gray-300 mr-2 rounded-full"></span>
                                <span>Gray: Reserved</span>
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-6 mb-6">
                            <div className={`relative p-4 border border-gray-300 rounded-lg ${selectedTable === 'Table 1' ? 'bg-gray-300' : 'bg-yellow-300'}`}>
                                <button 
                                    className={`w-full h-full rounded-lg text-lg font-semibold ${selectedTable === 'Table 1' ? 'text-gray-700' : 'text-gray-900'} hover:bg-yellow-400 transition duration-300`}
                                    // onClick={() => handleTableSelect('Table 1')}
                                >
                                    Table 1
                                </button>
                            </div>
                            <div className={`relative p-4 border border-gray-300 rounded-lg ${selectedTable === 'Table 2' ? 'bg-gray-300' : 'bg-yellow-300'}`}>
                                <button 
                                    className={`w-full h-full rounded-lg text-lg font-semibold ${selectedTable === 'Table 2' ? 'text-gray-700' : 'text-gray-900'} hover:bg-yellow-400 transition duration-300`}
                                    // onClick={() => handleTableSelect('Table 2')}
                                >
                                    Table 2
                                </button>
                            </div>
                            {/* Add more tables here */}
                        </div>

                        {selectedTable && (
                            <div className="mt-6">
                                <p className="text-lg font-semibold mb-2">Selected Table Information</p>
                                <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                                    <p className="text-lg font-semibold">{selectedTable}</p>
                                    <p className="text-gray-600">Seats: 4</p>
                                    <p className="text-gray-600">Available</p>
                                </div>
                            </div>
                        )}

                        {selectedTable && (
                            <div className="mt-6">
                                <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
                                <form>
                                    <label className="block mb-2 text-lg font-semibold">
                                        Name
                                        <input type="text" className="w-full p-3 border border-gray-300 rounded-lg mt-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" required />
                                    </label>
                                    <label className="block mb-2 text-lg font-semibold">
                                        Date
                                        <input type="date" className="w-full p-3 border border-gray-300 rounded-lg mt-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={selectedDate} readOnly />
                                    </label>
                                    <label className="block mb-2 text-lg font-semibold">
                                        Time
                                        <input type="time" className="w-full p-3 border border-gray-300 rounded-lg mt-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={selectedTime} readOnly />
                                    </label>
                                    <Button className='bg-orange-500 hover:bg-orange-600 w-full py-3 text-lg font-semibold rounded-lg transition duration-300'>Book Table</Button>
                                </form>
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
