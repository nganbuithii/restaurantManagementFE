import React from 'react';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Step2 = ({ selectedTime, setSelectedTime, setStep, timeSlots }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
        <Clock className="mr-2 text-orange-500" />
        Select Your Time
      </h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {timeSlots.map((time) => (
          <Button
            key={time}
            onClick={() => {
              setSelectedTime(time);
              setStep(3);
            }}
            variant={selectedTime === time ? "default" : "outline"}
            className="py-6 text-lg transition-all duration-300 hover:bg-orange-100 hover:border-orange-500"
          >
            {time}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Step2;