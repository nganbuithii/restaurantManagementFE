import React, { useCallback, useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import API, { endpoints } from '@/app/configs/API';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/navigation';

const Testimonials = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const swiperRef = useRef(null);

  const fetchFeedback = useCallback(async (page) => {
    setIsLoading(true);
    try {
      const response = await API.get(endpoints.getAllFeedbacks, {
        params: { page: page },
      });
      setFeedbacks(response.data.data.data);
      setCurrentPage(response.data.data.currentPage);
      setTotalPages(Math.ceil(response.data.data.total / response.data.data.itemsPerPage));
    } catch (error) {
      console.error("Failed to fetch feedback:", error);
      setError("Failed to load feedback. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedback(currentPage);
  }, [fetchFeedback, currentPage]);

  const handlePrevClick = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const handleNextClick = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slideNext();
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
    <section className="py-24 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-4xl font-bold text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          What Our Guests Say
        </motion.h2>
        {isLoading && <div className="text-center">Loading...</div>}
        {!isLoading && !error && (
          <div className="relative">
            <button
              onClick={handlePrevClick}
              disabled={currentPage === 1}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={24} />
            </button>
            <Swiper
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              spaceBetween={20}
              slidesPerView={1}
              navigation={false}
              modules={[Navigation, Autoplay]}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              className="mySwiper"
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
                  slidesPerView: 3,
                  spaceBetween: 30,
                },
              }}
            >
              {feedbacks.map((feedback) => (
                <SwiperSlide key={feedback.id}>
                  <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
                    <p className="text-lg mb-6">&quot;{feedback.content}&quot;</p>
                    <div className="flex items-center">
                      <div
                        className="w-12 h-12 rounded-full bg-gray-600 mr-4"
                        style={{
                          backgroundImage: `url(${feedback.user.avatar})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      ></div>
                      <div>
                        <h4 className="font-semibold">{feedback.user.fullName}</h4>
                        <p className="text-gray-400">{feedback.user.username}</p>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <button
              onClick={handleNextClick}
              disabled={currentPage === totalPages}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}
        <div className="text-center mt-6 text-gray-400 font-medium">
          Page {currentPage} of {totalPages}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
