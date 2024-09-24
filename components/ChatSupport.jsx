import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API, { endpoints } from '@/app/configs/API';

const ChatSupport = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const messagesEndRef = useRef(null);

    const toggleChat = () => {
        setIsOpen(!isOpen);
        if (!isOpen && messages.length === 0) {
            setMessages([{ text: 'Hello Nabity Restaurant, what support do you need from us?', sender: 'bot', isAI: false }]);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (inputMessage.trim() === '') return;

        const newMessage = { text: inputMessage, sender: 'user' };
        setMessages(prevMessages => [...prevMessages, newMessage]);
        setInputMessage('');

        try {
            const response = await API.post(endpoints.chat, {
                message: inputMessage
            });

            const { statusCode, data } = response.data;

            let botMessage = 'Sorry, I cannot process your request at this time';
            let isAI = data.isAI || false;

            if (statusCode === 201 && data && data.botMessage) {
                botMessage = data.botMessage.message;
            }

            setMessages(prevMessages => [
                ...prevMessages,
                { text: botMessage, sender: 'bot', isAI: isAI }
            ]);
        } catch (error) {
            console.error('Error:', error);
            setMessages(prevMessages => [
                ...prevMessages,
                { text: 'Sorry, an error occurred. Please try again later.', sender: 'bot', isAI: false }
            ]);
        }
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <>
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="fixed bottom-6 right-6 z-50"
            >
                <button
                    onClick={toggleChat}
                    className="bg-orange-400 hover:bg-orange-500 text-white rounded-full p-3 shadow-lg transition duration-300"
                    aria-label="Open chat"
                >
                    <MessageCircle size={24} />
                </button>
            </motion.div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className="fixed bottom-20 right-6 w-72 bg-white rounded-lg shadow-xl overflow-hidden z-50 border border-orange-200"
                    >
                        <div className="bg-gradient-to-r from-orange-400 to-orange-300 text-white p-2 flex justify-between items-center">
                            <h3 className="font-semibold text-sm">Chat Support</h3>
                            <button onClick={toggleChat} className="hover:bg-orange-500 rounded-full p-1 transition duration-300" aria-label="Close chat">
                                <X size={16} />
                            </button>
                        </div>

                        <div className="h-64 overflow-y-auto p-3 bg-orange-50">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`mb-2 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
                                >
                                    <span
                                        className={`inline-block p-2 rounded-lg text-sm ${
                                            message.sender === 'user'
                                                ? 'bg-orange-400 text-white'
                                                : message.isAI
                                                    ? 'bg-yellow-100 text-gray-800'
                                                    : 'bg-white text-gray-800'
                                        }`}
                                    >
                                        {message.sender === 'bot' && message.isAI && (
                                            <span className="font-semibold block mb-1 text-xs text-orange-600">
                                                AI:
                                            </span>
                                        )}
                                        {message.text}
                                    </span>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={sendMessage} className="p-2 bg-white border-t border-orange-100">
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    placeholder="Enter your question..."
                                    className="flex-grow p-2 text-sm border border-orange-200 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-orange-300 transition duration-300"
                                />
                                <button
                                    type="submit"
                                    className="bg-orange-400 text-white p-2 rounded-r-lg hover:bg-orange-500 transition duration-300"
                                    aria-label="Send message"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatSupport;