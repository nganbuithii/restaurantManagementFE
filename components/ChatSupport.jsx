import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API, { endpoints } from '@/app/configs/API';

const ChatSupport = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const messagesEndRef = useRef(null);

    const toggleChat = () => setIsOpen(!isOpen);

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

            let botMessage = 'Xin lỗi, tôi không thể xử lý yêu cầu của bạn lúc này.';
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
                { text: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.', sender: 'bot', isAI: false }
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
                className="fixed bottom-4 right-4 z-50"
            >
                <button
                    onClick={toggleChat}
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg transition duration-300"
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
                        className="fixed bottom-20 right-4 w-80 sm:w-96 bg-white rounded-lg shadow-xl overflow-hidden z-50"
                    >
                        <div className="bg-blue-500 text-white p-4 flex justify-between items-center">
                            <h3 className="font-semibold">Chat Support</h3>
                            <button onClick={toggleChat} aria-label="Close chat">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="h-80 overflow-y-auto p-4 bg-gray-100">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`mb-4 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
                                >
                                    <span
                                        className={`inline-block p-2 rounded-lg ${message.sender === 'user'
                                                ? 'bg-blue-500 text-white'
                                                : message.isAI
                                                    ? 'bg-yellow-200 text-gray-800'
                                                    : 'bg-green-200 text-gray-800'
                                            }`}
                                    >
                                        {message.sender === 'bot' && (
                                            <span className="font-semibold block mb-1">
                                                {message.isAI ? 'AI:' : 'Bot:'}
                                            </span>
                                        )}
                                        {message.text}
                                    </span>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={sendMessage} className="p-4 bg-white">
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    placeholder="Nhập câu hỏi của bạn..."
                                    className="flex-grow p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600 transition duration-300"
                                    aria-label="Send message"
                                >
                                    <Send size={20} />
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
