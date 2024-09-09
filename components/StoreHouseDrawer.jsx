import React, { useState, useEffect } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useSelector } from 'react-redux';
import { FaTimes, FaWarehouse, FaTruck, FaBoxes, FaClipboardList, FaPlus } from 'react-icons/fa';
import { authApi, endpoints } from '@/app/configs/API';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

export default function StoreHouseDrawer({ isOpen, onClose, onCreated }) {
    const [type, setType] = useState('IN');
    const [supplierId, setSupplierId] = useState('');
    const [suppliers, setSuppliers] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [ingredientQuantities, setIngredientQuantities] = useState({});

    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        const fetchSupplierAndIngredients = async () => {
            try {
                const supplierResponse = await authApi(token).get(endpoints.getAllSupliers);
                setSuppliers(supplierResponse.data.data.data);

                const ingredientResponse = await authApi(token).get(endpoints.createIngredient);
                setIngredients(ingredientResponse.data.data.data);
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error('Failed to load data. Please try again.', { containerId: 'B' });
            }
        };

        if (isOpen) {
            fetchSupplierAndIngredients();
        }
    }, [isOpen, token]);

    const handleTypeChange = (value) => setType(value);
    const handleSupplierChange = (value) => setSupplierId(value);

    const handleIngredientChange = (ingredientId) => {
        setSelectedIngredients(prev => {
            const newSelected = prev.includes(ingredientId)
                ? prev.filter(id => id !== ingredientId)
                : [...prev, ingredientId];

            const newQuantities = { ...ingredientQuantities };
            if (newSelected.includes(ingredientId)) {
                newQuantities[ingredientId] = '';
            } else {
                delete newQuantities[ingredientId];
            }
            setIngredientQuantities(newQuantities);

            return newSelected;
        });
    };

    const handleQuantityChange = (ingredientId, value) => {
        setIngredientQuantities(prev => ({
            ...prev,
            [ingredientId]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            const numericSupplierId = Number(supplierId);
            
            const details = selectedIngredients.map(ingredientId => ({
                ingredientId: Number(ingredientId),
                quantity: Number(ingredientQuantities[ingredientId]) || 0
            }));

            await authApi(token).post(endpoints.getAllSlips, {
                type,
                supplierId: numericSupplierId,
                details
            });

            toast.success('Warehouse slip created successfully!', { containerId: 'B' });
            onCreated();
            onClose();
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Something went wrong';
            toast.error(`Error: ${errorMessage}`, { containerId: 'B' });
            console.error("Error creating warehouse slip:", error);
        }
    };

    return (
        <Drawer open={isOpen} onClose={onClose}>
            <DrawerContent className="bg-gradient-to-br from-blue-50 to-orange-100">
                <DrawerHeader className="bg-white shadow-md sticky top-0 z-10 p-6">
                    <DrawerTitle className="text-3xl font-bold text-orange-800 flex items-center">
                        <FaWarehouse className="mr-4 text-orange-600" />
                        New Warehouse Slip
                    </DrawerTitle>
                    <Button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 transition duration-300">
                        <FaTimes />
                    </Button>
                </DrawerHeader>
                <div className="p-6 space-y-8">
                    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
                        <div className="flex space-x-4">
                            <div className="w-1/2">
                                <Label htmlFor="type" className="text-sm font-medium text-gray-600 flex items-center mb-2">
                                    <FaBoxes className="mr-2 text-orange-600" />
                                    Type
                                </Label>
                                <Select onValueChange={handleTypeChange} value={type}>
                                    <SelectTrigger id="type" className="w-full bg-orange-50 border-orange-300 text-orange-800 focus:ring-orange-500 focus:border-orange-500">
                                        <SelectValue placeholder="Select Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="IN">IN</SelectItem>
                                        <SelectItem value="OUT">OUT</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="w-1/2">
                                <Label htmlFor="supplier" className="text-sm font-medium text-gray-600 flex items-center mb-2">
                                    <FaTruck className="mr-2 text-orange-600" />
                                    Supplier
                                </Label>
                                <Select onValueChange={handleSupplierChange} value={supplierId}>
                                    <SelectTrigger id="supplier" className="w-full bg-orange-50 border-orange-300 text-orange-800 focus:ring-orange-500 focus:border-orange-500">
                                        <SelectValue placeholder="Select Supplier" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {suppliers.map((supplier) => (
                                            <SelectItem key={supplier.id} value={supplier.id.toString()}>
                                                {supplier.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        
                        <div>
                            <Label className="text-sm font-medium text-gray-600 flex items-center mb-3">
                                <FaClipboardList className="mr-2 text-orange-600" />
                                Ingredients
                            </Label>
                            <div className="bg-orange-50 rounded-lg p-4 max-h-60 overflow-y-auto space-y-2">
                                {ingredients.map((ingredient) => (
                                    <div key={ingredient.id} className="flex items-center bg-white p-3 rounded-md shadow-sm hover:shadow-md transition-shadow duration-300">
                                        <Checkbox
                                            id={`ingredient-${ingredient.id}`}
                                            checked={selectedIngredients.includes(ingredient.id.toString())}
                                            onCheckedChange={() => handleIngredientChange(ingredient.id.toString())}
                                            className="mr-3 text-orange-600 focus:ring-orange-500 rounded"
                                        />
                                        <label htmlFor={`ingredient-${ingredient.id}`} className="text-orange-800 font-medium cursor-pointer flex-grow">
                                            {ingredient.name}
                                        </label>
                                        {selectedIngredients.includes(ingredient.id.toString()) && (
                                            <Input
                                                type="number"
                                                value={ingredientQuantities[ingredient.id] || ''}
                                                onChange={(e) => handleQuantityChange(ingredient.id.toString(), e.target.value)}
                                                className="w-24 ml-2 bg-orange-50 border-orange-300 focus:ring-orange-500 focus:border-orange-500"
                                                placeholder="Qty"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <DrawerFooter className="bg-white shadow-md sticky bottom-0 z-10 p-6">
                    <Button onClick={handleSubmit} className="w-full bg-orange-600 text-white hover:bg-orange-700 transition duration-300 text-lg py-3 rounded-lg">
                        <FaPlus className="mr-2" /> Create Warehouse Slip
                    </Button>
                </DrawerFooter>
            </DrawerContent>
            <ToastContainer position="top-right" autoClose={3000} containerId="B" />
        </Drawer>
    );
}