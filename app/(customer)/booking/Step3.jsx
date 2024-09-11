import React from 'react';
import { Table } from 'lucide-react';

const Step3 = ({ tables, selectedTable, setSelectedTable, setStep, renderTableShape }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
        <Table className="mr-2 text-orange-500" />
        Choose Your Table
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {tables.map((table) => (
          <div
            key={table.id}
            className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
              selectedTable === table
                ? 'bg-orange-100 border-2 border-orange-500 shadow-md'
                : 'bg-white border border-gray-200 hover:border-orange-300 hover:shadow-md'
            }`}
            onClick={() => {
              setSelectedTable(table);
              setStep(4);
            }}
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
};

export default Step3;