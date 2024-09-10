'use client'
import Header from "@/components/header";
import Image from "next/image";
import Footer from "@/components/footer";
import { useCallback, useEffect, useState } from "react";
import { calculateTotalPages } from "@/lib/paginationUtils";
import API, { endpoints } from "@/app/configs/API";
import AboutSection from './About';
import BannerSection from './BannerSection';
import BestSeller from "./BestSeller";

export default function Menus() {
    const [menus, setMenus] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [dishes, setDishes] = useState([]);
    const [dishesPage, setDishesPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(1);

    const fetchDishes = useCallback(async (page) => {
        setIsLoading(true);
        try {
            const response = await API.get(endpoints.getAllDishes, {
                params: { page: page },
            });
            if (page === 1) {
                setDishes(response.data.data.data);
            } else {
                setDishes((prevDishes) => {
                    // Ensure no duplicates
                    const newDishes = response.data.data.data;
                    const existingDishIds = new Set(prevDishes.map(dish => dish.id));
                    const filteredNewDishes = newDishes.filter(dish => !existingDishIds.has(dish.id));
                    return [...prevDishes, ...filteredNewDishes];
                });
            }
            setCurrentPage(response.data.data.currentPage);
            setTotalPages(Math.ceil(response.data.data.total / response.data.data.itemsPerPage));
        } catch (error) {
            console.error("Failed to fetch dishes:", error);
            setError("Failed to load dishes. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    }, []);
    

    const fetchMenus = useCallback(async () => {
        try {
            const response = await API.get(endpoints.getAllMenus, {
                params: {
                    page: currentPage,
                }
            });
            setMenus(response.data.data.data);

            const total = response.data.data.total;
            const itemsPerPage = response.data.data.itemsPerPage;
            const calculatedTotalPages = calculateTotalPages(total, itemsPerPage);

            setTotalPages(calculatedTotalPages);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    }, [currentPage]);

    useEffect(() => {
        fetchMenus();
        fetchDishes(dishesPage);
    }, [dishesPage, fetchMenus, fetchDishes]);
    
    const handleLoadMore = () => {
        if (dishesPage < totalPages) {
            const nextPage = dishesPage + 1;
            setDishesPage(nextPage);
            fetchDishes(nextPage);
        }
    };
    

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative h-screen flex items-center justify-center">
                    <Image
                        src="/images/menu1.jpg"
                        alt="Hero background"
                        layout="fill"
                        objectFit="cover"
                        className="brightness-50"
                    />
                    <div className="relative z-10 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                            DISCOVER THE TASTE OF PERFECTION
                        </h1>
                        <p className="text-xl text-white mb-8">
                            Experience culinary excellence at its finest
                        </p>
                        <button className="bg-orange-500 text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-orange-600 transition duration-300">
                            Explore Our Menu
                        </button>
                    </div>
                </section>

                {/* About Section */}
                <AboutSection />

                {/* Menu Section */}
                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">OUR MENU</h2>
                        <div className="flex flex-row mb-6 flex-wrap justify-center">
                            {menus.map(menu => (
                                <p key={menu.id} className="text-xl font-semibold mx-4 mb-4">{menu.name}</p>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {dishes.map(dish => (
                                <div key={dish.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
                                    <div className="flex-grow">
                                        <Image
                                            src={dish.images[0]?.url || "/images/placeholder.png"}
                                            alt={dish.name}
                                            width={400}
                                            height={300}
                                            objectFit="cover"
                                        />
                                    </div>
                                    <div className="p-6 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-xl font-semibold mb-2">{dish.name}</h3>
                                            <p className="text-gray-600 mb-4">{dish.description || 'No description available'}</p>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-2xl font-bold text-orange-500">
                                                ${dish.price.toLocaleString()}
                                            </span>
                                            <button className="bg-orange-500 text-white py-2 px-4 rounded-full hover:bg-orange-600 transition duration-300">
                                                Order Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="text-center py-8">
                            {dishesPage < totalPages && (
                                <button
                                    onClick={handleLoadMore}
                                    className="bg-orange-500 text-white py-2 px-4 rounded-full hover:bg-orange-600 transition duration-300"
                                >
                                    {isLoading ? "Loading..." : "Load More"}
                                </button>
                            )}
                        </div>
                    </div>
                </section>

                <BestSeller />

                <BannerSection />
            </main>
            <Footer />
        </div>
    );
}
