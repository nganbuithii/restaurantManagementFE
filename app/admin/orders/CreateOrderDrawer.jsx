import React, { useCallback, useState, useEffect } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import API, { authApi, endpoints } from "@/app/configs/API";
import { useSelector } from "react-redux";
import { Search, X } from 'lucide-react';
import { FaTimes } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const CreateOrderDrawer = ({ isOpen, onClose, onOrderCreated }) => {
    const [discountPrice, setDiscountPrice] = useState('0');
    const [status, setStatus] = useState('PENDING');
    const token = useSelector((state) => state.auth.token);
    const [searchTerm, setSearchTerm] = useState('');
    const [subtotal, setSubtotal] = useState(0);

    const [dishes, setDishes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [selectedItems, setSelectedItems] = useState({});

    const handleQuantityChange = useCallback((dishId, quantity, price) => {
        const newQuantity = Math.max(0, parseInt(quantity) || 0);
        setSelectedItems(prevItems => {
            const updatedItems = {
                ...prevItems,
                [dishId]: { price, quantity: newQuantity }
            };
            // Calculate new subtotal
            const newSubtotal = Object.values(updatedItems).reduce((total, item) => total + (item.price * item.quantity), 0);
            setSubtotal(newSubtotal);
            return updatedItems;
        });
    }, []);

    const fetchDishes = useCallback(async () => {
        if (loading || !hasMore) return;
        
        try {
            setLoading(true);
            const response = await API.get(endpoints.getAllDishes, {
                params: { page: currentPage, search: searchTerm }
            });
            
            const newDishes = response.data.data.data;
            setDishes(prevDishes => {
                const uniqueDishes = [...prevDishes];
                newDishes.forEach(dish => {
                    if (!uniqueDishes.find(d => d.id === dish.id)) {
                        uniqueDishes.push(dish);
                    }
                });
                return uniqueDishes;
            });
            
            const total = response.data.data.total;
            const itemsPerPage = response.data.data.itemsPerPage;
            setHasMore(currentPage * itemsPerPage < total);
        } catch (error) {
            console.error("Failed to fetch dishes:", error);
            toast.error('Failed to fetch dishes', { containerId: 'A' });
        } finally {
            setLoading(false);
        }
    }, [currentPage, searchTerm, loading, hasMore]);

    useEffect(() => {
        if (isOpen) {
            fetchDishes();
        }
    }, [fetchDishes, isOpen]);

    useEffect(() => {
        setDishes([]);
        setCurrentPage(1);
        setHasMore(true);
        if (isOpen) {
            fetchDishes();
        }
    }, [searchTerm, isOpen]);

    const handleScroll = useCallback((e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        if (scrollHeight - scrollTop <= clientHeight * 1.5 && !loading && hasMore) {
            setCurrentPage(prev => prev + 1);
        }
    }, [loading, hasMore]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const details = Object.entries(selectedItems)
            .filter(([_, item]) => item.quantity > 0)
            .map(([menuItemId, item]) => ({
                menuItemId: parseInt(menuItemId),
                quantity: item.quantity
            }));

        if (details.length === 0) {
            toast.error('Please select at least one item', { containerId: 'A' });
            return;
        }

        try {
            const response = await authApi(token).post(endpoints.getAllOrders, {
                status,
                discountPrice: parseFloat(discountPrice),
                details
            });
            
            toast.success("Order created successfully!", { containerId: 'B' });
            onOrderCreated(response.data.data);
            onClose();
        } catch (error) {
            toast.error('Failed to create order. Please try again.', { containerId: 'B' });
            console.error("Failed to create order:", error);
        }
    };

    const calculateTotalPrice = () => {
        return Math.max(0, subtotal - parseFloat(discountPrice || 0));
    };
    
    return (
        <Drawer open={isOpen} onClose={onClose}>
            <DrawerContent className="h-[95vh] flex flex-col">
                <DrawerHeader className="flex justify-between items-center border-b pb-2">
                    <DrawerTitle>Create New Order</DrawerTitle>
                    <Button onClick={onClose} variant="ghost" size="icon">
                        <X className="h-4 w-4" />
                    </Button>
                </DrawerHeader>
                
                <div className="flex-grow flex overflow-hidden">
                    {/* Left side: Order details */}
                    <div className="w-1/2 p-4 flex flex-col">
                        <div className="mb-4">
                            <Label htmlFor="discountPrice">Discount Price</Label>
                            <Input
                                id="discountPrice"
                                type="number"
                                value={discountPrice}
                                onChange={(e) => setDiscountPrice(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <Label htmlFor="status">Status</Label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PENDING">PENDING</SelectItem>
                                    <SelectItem value="PROCESSING">PROCESSING</SelectItem>
                                    <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                                    <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex-grow bg-gray-100 p-4 rounded-lg flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span>Subtotal:</span>
                                    <span>${subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span>Discount:</span>
                                    <span>-${parseFloat(discountPrice || 0).toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center font-bold border-t pt-2">
                                <span>Total:</span>
                                <span>${calculateTotalPrice().toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Right side: Dishes list */}
                    <div className="w-1/2 border-l flex flex-col">
                        <div className="p-4">
                            <div className="relative mb-4">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search dishes..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                        </div>
                        <ScrollArea className="flex-grow" onScroll={handleScroll}>
                            <div className="p-4 space-y-4">
                                {dishes.map((dish, index) => (
                                    <Card key={`${dish.id}-${index}`}>
                                        <CardContent className="flex items-center justify-between p-4">
                                            <div>
                                                <h3 className="font-medium">{dish.name}</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    ${dish.price.toLocaleString()}
                                                </p>
                                                {selectedItems[dish.id]?.quantity > 0 && (
                                                    <p className="text-sm text-green-600">
                                                        Subtotal: ${(dish.price * selectedItems[dish.id].quantity).toLocaleString()}
                                                    </p>
                                                )}
                                            </div>
                                            <Input
                                                type="number"
                                                min="0"
                                                value={selectedItems[dish.id]?.quantity || 0}
                                                onChange={(e) => handleQuantityChange(dish.id, e.target.value, dish.price)}
                                                className="w-20"
                                            />
                                        </CardContent>
                                    </Card>
                                ))}
                                {loading && (
                                    <div className="py-4 text-center text-gray-500">
                                        Loading more dishes...
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
                
                <DrawerFooter className="border-t mt-auto">
                    <Button onClick={handleSubmit} className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 text-white ">Create Order</Button>
                </DrawerFooter>
            </DrawerContent>
            <ToastContainer containerId="B" position="top-right" autoClose={3000} />
        </Drawer>
    );
};

export default CreateOrderDrawer;