'use client';
import { useState, useEffect } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import { FaTimes } from 'react-icons/fa';
import { authApi, endpoints } from '@/app/configs/API';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
            }
        };

        if (isOpen) {
            fetchSupplierAndIngredients();
        }
    }, [isOpen, token]);

    const handleTypeChange = (e) => setType(e.target.value);
    const handleSupplierChange = (e) => setSupplierId(e.target.value);

    const handleIngredientChange = (e) => {
        const { value, checked } = e.target;
        setSelectedIngredients(prev => {
            const newSelected = checked
                ? [...prev, value]
                : prev.filter(id => id !== value);

            // Initialize quantities for selected ingredients
            const newQuantities = { ...ingredientQuantities };
            if (checked) {
                newQuantities[value] = ''; // Initialize empty quantity field
            } else {
                delete newQuantities[value];
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
        <>
            <Drawer open={isOpen} onClose={onClose}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Add New Warehouse Slip</DrawerTitle>
                        <Button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300">
                            <FaTimes />
                        </Button>
                    </DrawerHeader>
                    <div className="p-6 mb-4">
                        <div className="mb-4">
                            <label className="block mb-2 font-semibold">Type:</label>
                            <select
                                value={type}
                                onChange={handleTypeChange}
                                className="block w-full border-gray-300 rounded-md shadow-sm"
                            >
                                <option value="IN">IN</option>
                                <option value="OUT">OUT</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block mb-2 font-semibold">Supplier:</label>
                            <select
                                value={supplierId}
                                onChange={handleSupplierChange}
                                className="block w-full border-gray-300 rounded-md shadow-sm"
                            >
                                <option value="">Select Supplier</option>
                                {suppliers.map((supplier) => (
                                    <option key={supplier.id} value={supplier.id}>
                                        {supplier.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block mb-2 font-semibold">Ingredients:</label>
                            {ingredients.map((ingredient) => (
                                <div key={ingredient.id} className="mb-2 flex items-center">
                                    <input
                                        type="checkbox"
                                        value={ingredient.id}
                                        checked={selectedIngredients.includes(String(ingredient.id))}
                                        onChange={handleIngredientChange}
                                        className="mr-2"
                                    />
                                    <label>{ingredient.name}</label>
                                </div>
                            ))}
                        </div>

                        {selectedIngredients.length > 0 && (
                            <div className="mb-4">
                                <label className="block mb-2 font-semibold">Quantity:</label>
                                {selectedIngredients.map((ingredientId) => (
                                    <div key={ingredientId} className="mb-2 flex items-center">
                                        <label className="w-1/3">
                                            {ingredients.find(ingredient => ingredient.id === Number(ingredientId))?.name}:
                                        </label>
                                        <Input
                                            type="number"
                                            value={ingredientQuantities[ingredientId] || ''}
                                            onChange={(e) => handleQuantityChange(ingredientId, e.target.value)}
                                            className="w-2/3"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <DrawerFooter>
                        <Button onClick={handleSubmit} className="bg-blue-500 text-white">
                            Submit
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
            <ToastContainer containerId="B" position="top-right" autoClose={3000} />
        </>
    );
}
