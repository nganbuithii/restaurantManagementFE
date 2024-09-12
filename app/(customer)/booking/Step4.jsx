import React from 'react';
import { Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Step4 = ({ handlePreOrderDecision }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
        <Utensils className="mr-2 text-orange-500" />
        Would you like to pre-order?
      </h2>
      <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
        <Button
          onClick={() => handlePreOrderDecision(true)}
          className="py-8 px-6 text-lg transition-all duration-300 bg-orange-500 hover:bg-orange-600"
        >
          Yes, I would like to pre-order
        </Button>
        <Button
          variant="outline"
          onClick={() => handlePreOrderDecision(false)}
          className="py-8 px-6 text-lg transition-all duration-300 border-orange-500 text-orange-500 hover:bg-orange-50"
        >
          No, I will order at the restaurant
        </Button>
      </div>
    </div>
  );
};

export default Step4;