import React from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';

const Step1 = ({ date, setDate, setStep, availableDates }) => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div className="bg-gray-100 p-4 border-b">
        <h2 className="text-xl font-semibold text-center flex items-center justify-center">
          <Clock className="h-5 w-5 mr-2" />
          Choose Your Date
        </h2>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-1"><ChevronLeft className="h-5 w-5 text-gray-500" /></button>
          <span className="font-medium">{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
          <button onClick={nextMonth} className="p-1"><ChevronRight className="h-5 w-5 text-gray-500" /></button>
        </div>
        <div className="grid grid-cols-7 gap-2 text-center">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="text-xs font-medium text-gray-500">{day}</div>
          ))}
          {[...Array(42)].map((_, index) => {
            const dayNumber = index - firstDayOfMonth + 1;
            const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;
            const isSelected = date && dayNumber === date.getDate() && currentMonth.getMonth() === date.getMonth() && currentMonth.getFullYear() === date.getFullYear();
            const isAvailable = availableDates ? availableDates.some(d => d.getDate() === dayNumber && d.getMonth() === currentMonth.getMonth() && d.getFullYear() === currentMonth.getFullYear()) : true;

            return (
              <div
                key={index}
                onClick={() => isCurrentMonth && isAvailable && setDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dayNumber))}
                className={`p-2 rounded-full ${isCurrentMonth ? (isAvailable ? 'hover:bg-gray-200 cursor-pointer' : 'text-gray-300') : 'text-gray-200'} ${isSelected ? 'bg-orange-400 text-white' : ''}`}
              >
                {isCurrentMonth ? dayNumber : ''}
              </div>
            );
          })}
        </div>
        <button
          onClick={() => setStep(2)}
          className="mt-6 w-full bg-gradient-to-r from-orange-400 to-red-500 text-white font-medium py-2 px-4 rounded transition-colors duration-300"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Step1;