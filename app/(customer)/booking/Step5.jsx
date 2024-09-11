import React from 'react';
import { Utensils, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const Step5 = ({ searchTerm, setSearchTerm, dishes, selectedItems, handleMenuItemToggle }) => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                <Utensils className="mr-2 text-orange-500" />
                Pre-order Menu
            </h2>
            <div className="flex items-center space-x-2 mb-4">
                <Search className="text-orange-500" />
                <Input
                    type="text"
                    placeholder="Search menu items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow border-orange-300 focus:ring-orange-500"
                />
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-4">
                {dishes.filter(item =>
                    item.name.toLowerCase().includes(searchTerm.toLowerCase())
                ).map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-orange-50 transition-all duration-300">
                        <Checkbox
                            id={`item-${item.id}`}
                            checked={selectedItems.includes(item.id)}
                            onCheckedChange={() => handleMenuItemToggle(item.id)}
                            className="border-orange-300 text-orange-500"
                        />
                        <Label htmlFor={`item-${item.id}`} className="flex-grow cursor-pointer">
                            <span className="font-medium">{item.name}</span>
                            <span className="text-sm text-gray-500 ml-2">({item.category})</span>
                        </Label>
                        <span className="text-sm font-semibold text-orange-600">${item.price.toFixed(2)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Step5;