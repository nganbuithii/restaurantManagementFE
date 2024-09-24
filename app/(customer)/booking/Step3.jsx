import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import API, { endpoints } from '@/app/configs/API';
import { Calendar, Clock, Users } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function Step3({ selectedTable, setSelectedTable, setStep, renderTableShape, date, time }) {
  const [availableTables, setAvailableTables] = useState([]);
  const [allTables, setAllTables] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTables = async () => {
      setIsLoading(true);
      try {
        const [availableResponse, allTablesResponse] = await Promise.all([
          API.post(endpoints.table_available, { date: format(date, 'yyyy-MM-dd'), time: time }),
          API.get(endpoints.getTables)
        ]);
        setAvailableTables(availableResponse.data.data);
        setAllTables(allTablesResponse.data.data.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch tables. Please try again.');
        console.error("Error fetching tables:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTables();
  }, [date, time]);

  const handleTableSelect = (table) => {
    if (availableTables.some(availableTable => availableTable.id === table.id)) {
      setSelectedTable(table);
    }
  };

  const renderTable = (table) => {
    const isAvailable = availableTables.some(availableTable => availableTable.id === table.id);
    const isSelected = selectedTable?.id === table.id;
    const baseStyle = "w-24 h-24 rounded-lg shadow-md transition-all duration-300 flex flex-col items-center justify-center ";
    const availableStyle = isAvailable 
      ? "bg-white hover:bg-orange-100 cursor-pointer text-gray-800" 
      : "bg-gray-200 cursor-not-allowed text-gray-500";
    const selectedStyle = isSelected ? "ring-2 ring-orange-500 bg-orange-100" : "";

    return (
      <div
        key={table.id}
        className={`${baseStyle} ${availableStyle} ${selectedStyle}`}
        onClick={() => handleTableSelect(table)}
      >
        <span className="text-lg font-semibold">Bàn {table.number}</span>
        <div className="flex items-center mt-2">
          <Users size={16} className="mr-1" />
          <span>{table.seats}</span>
        </div>
      </div>
    );
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
    </div>
  );

  if (error) return (
    <Alert variant="destructive">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );

  return (
    <div className="bg-white p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Chọn bàn</h2>
      <div className="flex items-center mb-6 text-gray-600">
        <Calendar className="mr-2" />
        <span className="mr-4">{format(date, 'dd/MM/yyyy')}</span>
        <Clock className="mr-2" />
        <span>{time}</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {allTables.map(renderTable)}
      </div>
      {/* {selectedTable && (
        <div className="mt-6 p-4 bg-orange-100 rounded-lg">
          <p className="text-lg font-semibold text-orange-800">
            Bạn đã chọn: Bàn {selectedTable.number} ({selectedTable.seats} chỗ ngồi)
          </p>
        </div>
      )} */}
    </div>
  );
}

export default Step3;