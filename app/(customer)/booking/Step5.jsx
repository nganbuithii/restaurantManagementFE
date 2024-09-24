import React, { useState, useEffect, useCallback } from 'react';
import { Search, ChevronUp, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import API, { endpoints } from '@/app/configs/API';
import { useInView } from 'react-intersection-observer';

const Step5 = ({ selectedItems, setSelectedDishes }) => {
    const [dishes, setDishes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [quantities, setQuantities] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const { ref, inView } = useInView({
        triggerOnce: false,
        threshold: 1,
    });

    const fetchDishes = useCallback(async () => {
        try {
            const response = await API.get(endpoints.getAllDishes, {
                params: {
                    page: currentPage,
                    search: searchTerm 
                }
            });
            const newDishes = response.data.data.data;
            setDishes(prevDishes => currentPage === 1 ? newDishes : [...prevDishes, ...newDishes]);

            const total = response.data.data.total;
            const itemsPerPage = response.data.data.itemsPerPage;
            setTotalPages(Math.ceil(total / itemsPerPage));
        } catch (error) {
            console.error("Failed to fetch dishes:", error);
        }
    }, [currentPage, searchTerm]);

    useEffect(() => {
        fetchDishes();
    }, [fetchDishes]);

    useEffect(() => {
        if (inView && currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    }, [inView, currentPage, totalPages]);

    useEffect(() => {
        const initialQuantities = selectedItems.reduce((acc, id) => {
            acc[id] = acc[id] || 1;
            return acc;
        }, {});
        setQuantities(initialQuantities);
    }, [selectedItems]);

    const handleItemToggle = (itemId) => {
        setSelectedDishes(prev => {
            const isSelected = prev.selectedItems.includes(itemId);
            const updatedItems = isSelected
                ? prev.selectedItems.filter(id => id !== itemId)
                : [...prev.selectedItems, itemId];

            const newQuantities = { ...prev.quantities };
            if (!isSelected) {
                newQuantities[itemId] = 1;
            } else {
                delete newQuantities[itemId];
            }

            return {
                selectedItems: updatedItems,
                quantities: newQuantities
            };
        });
    };

    const handleQuantityChange = (itemId, change) => {
        setQuantities(prev => ({
            ...prev,
            [itemId]: Math.max(1, (prev[itemId] || 1) + change)
        }));
    };

    useEffect(() => {
        setSelectedDishes(prev => ({
            ...prev,
            quantities
        }));
    }, [quantities, setSelectedDishes]);

    useEffect(() => {
        setDishes([]);
        setCurrentPage(1);
    }, [searchTerm]);

    return (
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6 space-y-6">
                <h2 className="text-3xl font-light text-gray-800">Pre-order Menu</h2>
                <div className="relative">
                    <Input
                        type="text"
                        placeholder="Search menu items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border-none bg-gray-100 rounded-full focus:ring-2 focus:ring-blue-400"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {dishes.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg transition-all duration-300 hover:bg-gray-100">
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
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            onClick={() => handleQuantityChange(item.id, -1)}
                                            variant="ghost"
                                            size="sm"
                                            className="p-0 h-6 w-6 rounded-full"
                                        >
                                            <ChevronDown className="h-4 w-4" />
                                        </Button>
                                        <span className="text-sm font-medium w-6 text-center">{quantities[item.id] || 1}</span>
                                        <Button
                                            onClick={() => handleQuantityChange(item.id, 1)}
                                            variant="ghost"
                                            size="sm"
                                            className="p-0 h-6 w-6 rounded-full"
                                        >
                                            <ChevronUp className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div ref={ref}></div> 
            </div>
        </div>
    );
};

export default Step5;
