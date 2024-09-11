import React from 'react';
import { Clock } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';

const Step1 = ({ date, setDate, setStep, availableDates }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
        <Clock className="mr-2 text-orange-500" />
        Choose Your Date
      </h2>
      <Calendar
        mode="single"
        selected={date}
        onSelect={(newDate) => {
          setDate(newDate);
          setStep(2);
        }}
        className="rounded-lg border-2 border-orange-300 shadow-lg p-4"
        disabled={(date) => !availableDates.some(d => d.toDateString() === date.toDateString())}
      />
    </div>
  );
};

export default Step1;