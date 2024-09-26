import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, ChevronUp, ChevronDown, Loader2, X } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import API, { authApi, endpoints } from '@/app/configs/API';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { updateReservationDishes } from '@/app/store/reservationSlice';

const DishSelectionDialog = ({ isOpen, onClose, onSuccess, reservationId, token }) => {
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const dispatch = useDispatch();
    const { ref, inView } = useInView({
        triggerOnce: false,
        threshold: 1,
    });

    const fetchDishes = useCallback(async () => {
        setLoading(true);
        try {
            const response = await API.get(endpoints.getAllDishes, {
                params: {
                    page: currentPage,
                    search: searchTerm 
                },
                headers: { Authorization: `Bearer ${token}` }
            });
            const newDishes = response.data.data.data;
            setDishes(prevDishes => currentPage === 1 ? newDishes : [...prevDishes, ...newDishes]);

            const total = response.data.data.total;
            const itemsPerPage = response.data.data.itemsPerPage;
            setTotalPages(Math.ceil(total / itemsPerPage));
        } catch (error) {
            console.error("Failed to fetch dishes:", error);
            toast.error("Failed to fetch dishes", { containerId: 'B' });
        } finally {
            setLoading(false);
        }
    }, [currentPage, searchTerm, token]);

    useEffect(() => {
        if (isOpen) {
            fetchDishes();
        }
    }, [isOpen, fetchDishes]);

    useEffect(() => {
        if (inView && currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    }, [inView, currentPage, totalPages]);

    useEffect(() => {
        setDishes([]);
        setCurrentPage(1);
    }, [searchTerm]);

    const handleItemToggle = (itemId) => {
        setSelectedItems(prev => {
            const isSelected = prev.includes(itemId);
            return isSelected ? prev.filter(id => id !== itemId) : [...prev, itemId];
        });

        setQuantities(prev => {
            const newQuantities = { ...prev };
            if (newQuantities[itemId]) {
                delete newQuantities[itemId];
            } else {
                newQuantities[itemId] = 1;
            }
            return newQuantities;
        });
    };

    const handleQuantityChange = (itemId, change) => {
        setQuantities(prev => ({
            ...prev,
            [itemId]: Math.max(1, (prev[itemId] || 1) + change)
        }));
    };

    const handleSubmit = async () => {
        if (selectedItems.length === 0) {
            toast.warn("Please select at least one dish", { containerId: 'B' });
            return;
        }

        try {
            const orderData = {
                status: "PENDING",
                discountPrice: 0,
                details: selectedItems.map(itemId => ({
                    menuItemId: itemId,
                    quantity: quantities[itemId] || 1
                }))
            };

            const orderResponse = await authApi(token).post(endpoints.getAllOrders, orderData);
            console.log("Tạo đơn hàng thành công:", orderResponse.data.data);

            const orderId = orderResponse.data.data.id;

            // 2. Cập nhật Reservation với OrderID
            const updateReservationResponse = await authApi(token).patch(
                endpoints.getReservationById(reservationId),
                { orderId: orderId }
            );

            console.log("Cập nhật reservation thành công:", updateReservationResponse.data.data);

            dispatch(updateReservationDishes({ 
                reservationId, 
                orderId: orderId,
                menuItems: selectedItems.map(id => ({ id, quantity: quantities[id] || 1 }))
            }));

            toast.success("Dishes selection and order creation successful", { containerId: 'B' });
            setTimeout(() => {
                if (onSuccess) {
                    onSuccess(); 
                } else {
                    onClose(); 
                }
            }, 1000);
        } catch (error) {
            console.error("Error in dish selection process:", error);
            toast.error(error.response?.data?.message || "Failed to process dish selection", { containerId: 'B' });
        }
    };



    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
                <DialogHeader className="border-b pb-4">
                    <div className="flex justify-between items-center">
                        <DialogTitle className="text-2xl font-bold text-gray-800">Select Your Dishes</DialogTitle>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                        </Button>
                    </div>
                </DialogHeader>
                <div className="flex-grow overflow-hidden">
                    <div className="sticky top-0 bg-white z-10 py-4">
                        <div className="relative">
                            <Input
                                type="text"
                                placeholder="Search menu items..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        </div>
                    </div>
                    <ScrollArea className="h-[calc(100vh-300px)] pr-4">
                        <div className="space-y-4">
                            {dishes.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
                                    <div className="flex items-center space-x-4">
                                        <Checkbox
                                            checked={selectedItems.includes(item.id)}
                                            onCheckedChange={() => handleItemToggle(item.id)}
                                            className="w-5 h-5 rounded-full border-2 border-orange-500"
                                        />
                                        <div>
                                            <h3 className="font-medium text-gray-800">{item.name}</h3>
                                            <p className="text-sm text-gray-500">{item.category}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span className="font-semibold text-orange-600">${item.price.toFixed(2)}</span>
                                        {selectedItems.includes(item.id) && (
                                            <div className="flex items-center space-x-2 bg-gray-100 rounded-full p-1">
                                                <Button
                                                    onClick={() => handleQuantityChange(item.id, -1)}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="p-0 h-6 w-6 rounded-full hover:bg-gray-200"
                                                >
                                                    <ChevronDown className="h-4 w-4" />
                                                </Button>
                                                <span className="text-sm font-medium w-6 text-center">{quantities[item.id] || 1}</span>
                                                <Button
                                                    onClick={() => handleQuantityChange(item.id, 1)}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="p-0 h-6 w-6 rounded-full hover:bg-gray-200"
                                                >
                                                    <ChevronUp className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-center items-center h-20">
                                    <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                                </div>
                            )}
                            <div ref={ref}></div>
                        </div>
                    </ScrollArea>
                </div>
                <DialogFooter className="border-t pt-4">
                    <div className="w-full flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                            {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
                        </span>
                        <Button onClick={handleSubmit} className="bg-orange-500 hover:bg-orange-600 text-white">
                            Confirm Selection
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DishSelectionDialog;