import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import API, { authApi, endpoints } from '@/app/configs/API';
import { Calendar, Clock, Users, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReservationDetails } from '@/app/store/reservationSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';

const TableSelectionDrawer = ({ isOpen, onClose, date, time, onTableSelected, reservationId }) => {
    const [availableTables, setAvailableTables] = useState([]);
    const [allTables, setAllTables] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [selectedTable, setSelectedTable] = useState(null);
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);
    const { details, loading, error } = useSelector((state) => state.reservation);

    useEffect(() => {
        if (isOpen && reservationId) {
            dispatch(fetchReservationDetails(reservationId));
        }
    }, [isOpen, dispatch, reservationId]);

    useEffect(() => {
        const fetchTables = async () => {
            setIsLoading(true);
            try {
                const [availableResponse, allTablesResponse] = await Promise.all([
                    API.post(endpoints.table_available, { date: format(date, 'yyyy-MM-dd'), time }),
                    API.get(endpoints.getTables)
                ]);
                setAvailableTables(availableResponse.data.data);
                setAllTables(allTablesResponse.data.data.data);
            } catch (err) {
                console.error("Error fetching tables:", err);
            } finally {
                setIsLoading(false);
            }
        };
        if (isOpen) {
            fetchTables();
        }
    }, [isOpen, date, time]);

    const handleCloseConfirmDialog = () => {
        setShowConfirmDialog(false);
        setSelectedTable(null);
    };

    const handleConfirmTableChange = () => {
        if (selectedTable) {
            confirmTableChange(selectedTable);
        }
        setShowConfirmDialog(false);
    };

    const handleTableSelect = (table) => {
        if (availableTables.some(availableTable => availableTable.id === table.id)) {
            if (details.table && details.table.id !== table.id) {
                setSelectedTable(table);
                setShowConfirmDialog(true);
            } else {
                confirmTableChange(table);
            }
        }
    };

    const confirmTableChange = async (table) => {
        try {
            await authApi(token).patch(endpoints.getReservationById(reservationId), {
                tableId: table.id
            });
            toast.success("Table change successful", { 
                containerId: 'B',
                onClose: () => {
                    onTableSelected(table);
                    onClose();
                }
            });
            console.log("Table update successful");
        } catch (error) {
            toast.error("Error: Failed to change table", { containerId: 'B' });
            console.error("Error changing table:", error);
        }
    };

    const renderTable = (table) => {
        const isAvailable = availableTables.some(availableTable => availableTable.id === table.id);
        const isSelected = details.table && details.table.id === table.id;
        const baseStyle = "w-24 h-24 rounded-lg shadow-md transition-all duration-300 flex flex-col items-center justify-center ";
        let tableStyle = "";

        if (isSelected) {
            tableStyle = "bg-orange-300 cursor-pointer text-gray-800";
        } else if (isAvailable) {
            tableStyle = "bg-white hover:bg-orange-100 cursor-pointer text-gray-800";
        } else {
            tableStyle = "bg-gray-200 cursor-not-allowed text-gray-500";
        }

        return (
            <div
                key={table.id}
                className={`${baseStyle} ${tableStyle}`}
                onClick={() => handleTableSelect(table)}
            >
                <span className="text-lg font-semibold">Table {table.number}</span>
                <div className="flex items-center mt-2">
                    <Users size={16} className="mr-1" />
                    <span>{table.seats}</span>
                </div>
            </div>
        );
    };

    if (isLoading) return <div className="flex justify-center items-center h-64">Loading...</div>;

    if (error) return (
        <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
    );

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
                <div className="bg-white w-full max-w-md h-full overflow-y-auto p-6 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    >
                        <X size={24} />
                    </button>
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Select Table</h2>
                    <div className="flex items-center mb-6 text-gray-600">
                        <Calendar className="mr-2" />
                        <span className="mr-4">{format(date, 'dd/MM/yyyy')}</span>
                        <Clock className="mr-2" />
                        <span>{time}</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {allTables.map(renderTable)}
                    </div>
                </div>
            </div>
            <DeleteConfirmationDialog
                isOpen={showConfirmDialog}
                onClose={handleCloseConfirmDialog}
                onConfirm={handleConfirmTableChange}
                title="Confirm Table Change"
                description={`Are you sure you want to switch to Table ${selectedTable?.number}?`}
            />
            <ToastContainer containerId="B" position="top-right" autoClose={3000} />
        </>
    );
};

export default TableSelectionDrawer;
