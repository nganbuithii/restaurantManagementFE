import React from 'react';
import { Clock } from 'lucide-react';

const Step2 = ({ selectedTime, setSelectedTime, setStep, timeSlots }) => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-light text-gray-800 flex items-center justify-center">
        <Clock className="mr-2 text-gray-600" size={24} />
        Select Your Time
      </h2>
      <div className="grid grid-cols-4 gap-4">
        {timeSlots.map((time) => (
          <button
            key={time}
            onClick={() => {
              setSelectedTime(time);
              setStep(3);
            }}
            className={`py-3 text-sm transition-all duration-300 rounded-md ${
              selectedTime === time 
                ? 'bg-gradient-to-r from-orange-400 to-red-500  text-white' 
                : 'bg-white text-gray-800 border border-gray-200 hover:border-gray-400'
            }`}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Step2;