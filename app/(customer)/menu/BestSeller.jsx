import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import API, { endpoints } from "@/app/configs/API";

const BestSeller = () => {
    const [dishes, setDishes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [dishesPage, setDishesPage] = useState(1);

    const fetchDishes = useCallback(async (page) => {
        setIsLoading(true);
        try {
            const response = await API.get(endpoints.getAllDishes, {
                params: {
                    page,
                    isBestSeller: true, 
                },
            });
            setDishes((prevDishes) => [...prevDishes, ...response.data.data.data]);
            setTotalPages(Math.ceil(response.data.data.total / response.data.data.itemsPerPage));
        } catch (error) {
            console.error("Failed to fetch dishes:", error);
            setError("Failed to load dishes. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDishes(dishesPage);
    }, [dishesPage, fetchDishes]);

    const handleLoadMore = () => {
        setDishesPage((prevPage) => {
            const nextPage = prevPage + 1;
            fetchDishes(nextPage);
            return nextPage;
        });
    };

    return (
        <section className="py-20 bg-gray-100">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">BEST SELLER DISHES</h2>
                <div className="flex flex-wrap -mx-4">
                    {dishes.map((dish) => (
                        <div key={dish.id} className="w-full md:w-1/3 px-4 mb-8">
                            <div className="bg-white rounded-lg shadow-md p-6 text-center flex flex-col h-full">
                                <div className="relative w-32 h-32 mx-auto mb-4">
                                    <Image
                                        src={dish.images[0]?.url || "/images/placeholder.png"}
                                        alt={dish.name}
                                        layout="fill"
                                        objectFit="cover"
                                        className="rounded-full"
                                    />
                                </div>
                                <h3 className="text-xl font-semibold mb-2 flex-grow">{dish.name}</h3>
                                <p className="text-gray-600 mb-4">${dish.price.toFixed(2)}</p>
                                <div className="flex justify-center space-x-4">
                                    <button className="bg-green-500 text-white py-2 px-4 rounded-full hover:bg-green-600 transition duration-300">
                                        Add to Cart
                                    </button>
                                    <button className="bg-orange-500 text-white py-2 px-4 rounded-full hover:bg-orange-600 transition duration-300">
                                        Order Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {dishesPage < totalPages && (
                    <div className="text-center py-8">
                        <button
                            onClick={handleLoadMore}
                            className="bg-orange-500 text-white py-2 px-4 rounded-full hover:bg-orange-600 transition duration-300"
                        >
                            {isLoading ? "Loading..." : "Load More"}
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default BestSeller;
