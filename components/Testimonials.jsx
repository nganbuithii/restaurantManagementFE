import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, MessageCircle, X } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import API, { authApi, endpoints } from '@/app/configs/API';
import 'swiper/css';
import 'swiper/css/navigation';
import 'react-toastify/dist/ReactToastify.css';

const Testimonials = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [newFeedback, setNewFeedback] = useState({ content: '', rating: 0 });
  const [replyTo, setReplyTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = useSelector((state) => state.auth.token);

  const fetchFeedbacks = useCallback(async (page) => {
    setIsLoading(true);
    try {
      const response = await API.get(endpoints.getAllFeedbacks, {
        params: { page },
      });
      setFeedbacks(response.data.data.data);
      setCurrentPage(response.data.data.currentPage);
      setTotalPages(Math.ceil(response.data.data.total / response.data.data.itemsPerPage));
    } catch (error) {
      console.error('Failed to fetch feedbacks:', error);
      setError('Failed to load feedbacks. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedbacks(currentPage);
  }, [fetchFeedbacks, currentPage]);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await authApi(token).post(endpoints.getAllFeedbacks, newFeedback);
      toast.success('Feedback submitted successfully', { containerId: 'A' });
      await fetchFeedbacks(currentPage);
      setNewFeedback({ content: '', rating: 0 });
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      toast.error('Failed to submit feedback. Please try again!', { containerId: 'A' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await authApi(token).post(endpoints.replyFeedback(replyTo), {
        content: replyContent,
      });
      toast.success('Reply submitted successfully', { containerId: 'A' });
      await fetchFeedbacks(currentPage);
      setReplyTo(null);
      setReplyContent('');
    } catch (error) {
      console.error('Failed to submit reply:', error);
      toast.error('Failed to submit reply. Please try again!', { containerId: 'A' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating, interactive = false) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        onClick={() => interactive && setNewFeedback({ ...newFeedback, rating: index + 1 })}
        className={`w-6 h-6 ${interactive ? 'cursor-pointer' : ''} transition-colors duration-200 ${
          index < rating ? 'text-yellow-400' : 'text-gray-400'
        }`}
        fill={index < rating ? 'currentColor' : 'none'}
      />
    ));
  };

  const FeedbackCard = ({ feedback }) => (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <p className="text-lg mb-4 italic">&quot;{feedback.content}&quot;</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div
            className="w-10 h-10 rounded-full bg-gray-600 mr-3 border-2 border-blue-400"
            style={{
              backgroundImage: `url(${feedback.user.avatar})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div>
            <h4 className="font-semibold">{feedback.user.fullName}</h4>
            <div className="flex items-center">
              {renderStars(feedback.rating)}
              <span className="ml-2 text-sm text-gray-400">{feedback.rating}/5</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setReplyTo(feedback.id)}
          className="flex items-center text-blue-400 hover:text-blue-300 transition duration-300"
        >
          <MessageCircle size={18} className="mr-1" />
          Reply
        </button>
      </div>
      {feedback.replies && feedback.replies.length > 0 && (
        <div className="mt-4 border-t border-gray-700 pt-4">
          <h5 className="font-semibold mb-2">Replies:</h5>
          {feedback.replies.map((reply) => (
            <div key={reply.id} className="mb-2 pl-4 border-l-2 border-gray-700">
              <p className="text-sm italic">{reply.content}</p>
              <p className="text-xs text-gray-400">- {reply.user.fullName}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (error) {
    return (
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
  }

  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-4xl font-bold text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          What Our Guests Say
        </motion.h2>
        
        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <>
            <Swiper
              spaceBetween={20}
              slidesPerView={1}
              navigation={{
                prevEl: '.swiper-button-prev',
                nextEl: '.swiper-button-next',
              }}
              modules={[Navigation, Autoplay]}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
              }}
            >
              {feedbacks.map((feedback) => (
                <SwiperSlide key={feedback.id}>
                  <FeedbackCard feedback={feedback} />
                </SwiperSlide>
              ))}
            </Swiper>
            
            <div className="flex justify-center mt-8">
              <button className="swiper-button-prev mr-4 bg-gray-700 p-2 rounded-full">
                <ChevronLeft size={24} />
              </button>
              <button className="swiper-button-next bg-gray-700 p-2 rounded-full">
                <ChevronRight size={24} />
              </button>
            </div>
            
            <div className="text-center mt-6 text-gray-400">
              Page {currentPage} of {totalPages}
            </div>
          </>
        )}

        <form onSubmit={handleFeedbackSubmit} className="mt-16 max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg shadow-xl">
          <h3 className="text-2xl font-semibold mb-6">Leave Your Feedback</h3>
          <div className="mb-6">
            <label htmlFor="feedback" className="block text-sm font-medium mb-2">Your Feedback</label>
            <textarea
              id="feedback"
              className="w-full p-3 bg-gray-700 text-white rounded-md shadow-inner focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-200"
              placeholder="Share your experience..."
              value={newFeedback.content}
              onChange={(e) => setNewFeedback({ ...newFeedback, content: e.target.value })}
              rows="4"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Your Rating</label>
            <div className="flex justify-center space-x-2">
              {renderStars(newFeedback.rating, true)}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md shadow hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>

        <AnimatePresence>
          {replyTo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Reply to Feedback</h3>
                  <button onClick={() => setReplyTo(null)} className="text-gray-400 hover:text-white">
                    <X size={24} />
                  </button>
                </div>
                <form onSubmit={handleReplySubmit}>
                  <textarea
                    className="w-full p-3 bg-gray-700 text-white rounded-md shadow-inner focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-200 mb-4"
                    placeholder="Write your reply..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    rows="4"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md shadow hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Reply'}
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <ToastContainer containerId="A" position="top-right" autoClose={3000} />
    </section>
  );
};

export default Testimonials;