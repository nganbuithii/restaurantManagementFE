'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FiSearch } from "react-icons/fi";
import { useRouter } from 'next/navigation';
import API, { endpoints } from '@/app/configs/API';
import Footer from '@/components/footer';
import Header from '@/components/header';

export default function SearchResults() {
    const [searchResults, setSearchResults] = useState({ data: [], total: 0, currentPage: 1, itemsPerPage: 10 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    useEffect(() => {
        const query = new URLSearchParams(window.location.search).get('query');
        if (query) {
            setSearchQuery(query);
            fetchSearchResults(query);
        }
    }, [router.query]);

    const fetchSearchResults = async (query) => {
        setLoading(true);
        try {
            const url = `${endpoints.getAllDishes}?search=${query}`;
            const response = await API.get(url);
            setSearchResults(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching search results:", error);
            setError('Failed to fetch search results');
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        return price.toLocaleString();
    };

    

    if (loading) return <div className="flex items-center justify-center min-h-screen bg-orange-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
    </div>;
    
    if (error) return <div className="container mx-auto px-4 py-8 text-red-600 text-center">{error}</div>;

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 to-red-50">
            <Header />
            <div className="container mx-auto px-4 py-12 mt-24">
                <div className="search-results container mx-auto">

                    <h2 className="text-3xl font-bold mb-6 text-center text-orange-800">Search Results for "{searchQuery}"</h2>
                    {searchResults.data && searchResults.data.length === 0 ? (
                        <p className="text-center text-gray-600 text-xl">No results found.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {searchResults.data.map((item) => (
                                <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden transform hover:scale-105 transition-all duration-300">
                                    <div className="relative">
                                        {item.isBestSeller && (
                                            <span className="absolute top-0 left-0 bg-red-500 text-white py-1 px-3 rounded-br-lg font-semibold z-10">Best Seller</span>
                                        )}
                                        {item.images?.length > 0 ? (
                                            <Image
                                                src={item.images[0].url}
                                                alt={item.name}
                                                width={400}
                                                height={300}
                                                className="w-full h-60 object-cover"
                                            />
                                        ) : (
                                            <Image
                                                src="/default-image.png"
                                                alt="No image available"
                                                width={400}
                                                height={300}
                                                className="w-full h-60 object-cover"
                                            />
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-2xl font-bold mb-2 text-orange-800">{item.name}</h3>
                                        <p className="text-gray-600 mb-3 font-medium">Price: <span className="text-orange-500">${formatPrice(item.price)}</span></p>
                                        {item.ingredients?.length > 0 && (
                                            <p className="text-sm text-gray-500 mb-3">
                                                Ingredients: {item.ingredients.map(ing => ing.name).join(', ')}
                                            </p>
                                        )}
                                        {!item.isActive && (
                                            <p className="text-red-500 text-sm mb-3">This item is currently unavailable.</p>
                                        )}
                                        <Link href={`/menu-item/${item.id}`}>
                                            <Button 
                                                className={`w-full ${!item.isActive 
                                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                                    : 'bg-orange-500 hover:bg-orange-600 text-white'} 
                                                transition-colors duration-300`} 
                                                disabled={!item.isActive}
                                            >
                                                View Details
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer/>
        </div>
    );
}