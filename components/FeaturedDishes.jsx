import React, { useCallback, useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { Button } from "@/components/ui/button";
import API, { endpoints } from '@/app/configs/API';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

import 'swiper/css';
import 'swiper/css/navigation';

const FeaturedDishes = () => {
  const [dishes, setDishes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const swiperRef = useRef(null);

  const fetchDishes = useCallback(async (page) => {
    setIsLoading(true);
    try {
      const response = await API.get(endpoints.getAllDishes, {
        params: { page: page },
      });
      setDishes(response.data.data.data);
      setCurrentPage(response.data.data.currentPage);
      setTotalPages(Math.ceil(response.data.data.total / response.data.data.itemsPerPage));
    } catch (error) {
      console.error("Failed to fetch dishes:", error);
      setError("Failed to load dishes. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDishes(currentPage);
  }, [fetchDishes, currentPage]);

  const handlePrevClick = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
      if (swiperRef.current) {
        swiperRef.current.slideTo(0);
      }
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
      if (swiperRef.current) {
        swiperRef.current.slideTo(0);
      }
    }
  };

  if (error) return (
    <div className="text-center py-24 text-red-500 animate-pulse">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {error}
      </motion.div>
    </div>
  );

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-4xl font-bold text-center mb-12 text-gray-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Our Signature Dishes
        </motion.h2>
        <div className="relative">
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <motion.div
                className="w-16 h-16 border-t-4 border-orange-500 border-solid rounded-full animate-spin"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              ></motion.div>
            </div>
          ) : (
            <>
              <Button
                onClick={handlePrevClick}
                disabled={currentPage === 1}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white text-gray-800 p-2 rounded-full hover:bg-gray-100 transition duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={24} />
              </Button>
              <Swiper
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                }}
                spaceBetween={20}
                slidesPerView={1}
                navigation={false}
                modules={[Navigation, Autoplay]}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                className="mySwiper px-10"
                breakpoints={{
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                  768: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                  },
                  1024: {
                    slidesPerView: 4,
                    spaceBetween: 30,
                  },
                }}
              >
                {dishes.map((dish) => (
                  <SwiperSlide key={dish.id}>
                    <DishCard dish={dish} />
                  </SwiperSlide>
                ))}
              </Swiper>
              <Button
                onClick={handleNextClick}
                disabled={currentPage === totalPages}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white text-gray-800 p-2 rounded-full hover:bg-gray-100 transition duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={24} />
              </Button>
            </>
          )}
        </div>
        <div className="text-center mt-6 text-gray-600 font-medium">
          Page {currentPage} of {totalPages}
        </div>
      </div>
    </section>
  );
};

const DishCard = ({ dish }) => (
  <motion.div 
    className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl"
    whileHover={{ y: -5 }}
  >
    <div className="relative">
      <Image
        src={dish.images[0]?.url || "/images/default-food.jpg"}
        alt={dish.name}
        width={400}
        height={300}
        className="w-full h-48 object-cover"
      />
      <div className="absolute top-0 right-0 bg-orange-500 text-white px-3 py-1 rounded-bl-lg font-semibold text-sm">
        New
      </div>
    </div>
    <div className="p-4">
      <h3 className="text-xl font-bold mb-2 text-gray-800 truncate">{dish.name}</h3>
      <p className="text-gray-600 mb-3 text-sm line-clamp-2">
        {dish.description || "A tantalizing fusion of flavors that will excite your palate."}
      </p>
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold text-orange-500">${(dish.price / 100).toFixed(2)}</span>
        <Button className="bg-orange-500 text-white px-3 py-1 rounded-full hover:bg-orange-600 transition duration-300 text-sm font-semibold">
          Order Now
        </Button>
      </div>
    </div>
  </motion.div>
);

export default FeaturedDishes;