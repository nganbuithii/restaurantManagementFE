import React, { useState } from 'react';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ShoppingCart, X } from 'lucide-react';

const DishDrawer = ({ isOpen, onClose, dish }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    if (!dish) return null;

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            (prevIndex + 1) % dish.images.length
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            (prevIndex - 1 + dish.images.length) % dish.images.length
        );
    };

    return (
        <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DrawerContent className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto h-screen flex flex-col bg-white">
                <div className="flex-grow overflow-y-auto">
                    <div className="p-4 space-y-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-bold text-orange-500">{dish.name}</h2>
                                <p className="text-sm text-gray-600 mt-1">{dish.description}</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full hover:bg-gray-100"
                                onClick={onClose}
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        <div className="relative w-full h-48 rounded-lg overflow-hidden">
                            <Image
                                src={dish.images[currentImageIndex].url}
                                alt={`${dish.name} - Image ${currentImageIndex + 1}`}
                                layout="fill"
                                objectFit="cover"
                            />
                            <div className="absolute inset-0 flex justify-between items-center px-2">
                                <Button onClick={prevImage} variant="ghost" size="icon" className="bg-black/20 hover:bg-black/40 text-white rounded-full h-8 w-8">
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>
                                <Button onClick={nextImage} variant="ghost" size="icon" className="bg-black/20 hover:bg-black/40 text-white rounded-full h-8 w-8">
                                    <ChevronRight className="h-5 w-5" />
                                </Button>
                            </div>
                            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-2 py-1 rounded-full text-xs">
                                {currentImageIndex + 1} / {dish.images.length}
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <p className="text-2xl font-bold text-orange-500">$ {dish.price.toLocaleString()}</p>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${dish.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {dish.isActive ? 'Available' : 'Not Available'}
                            </span>
                        </div>

                        <div>
                            <h3 className="font-semibold text-sm mb-2">Ingredients:</h3>
                            {dish.ingredients && dish.ingredients.length > 0 ? (
                                <ul className="grid grid-cols-2 gap-2">
                                    {dish.ingredients.map((item, index) => (
                                        <li key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
                                            <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                                            {item.ingredient.name}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 italic text-sm">Information is being updated</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="p-4 border-t">
                    <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center py-2 rounded-full transition-all duration-300">
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Add to Cart
                    </Button>
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default DishDrawer;
