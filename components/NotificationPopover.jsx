'use client'
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, Check } from 'lucide-react';
import { fetchNotifications, markAllAsRead } from '@/app/store/NotificationSlice';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationPopover = () => {
    const dispatch = useDispatch();
    const { notifications, unreadCount } = useSelector((state) => state.notifications);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            dispatch(fetchNotifications());
        }
    }, [isOpen, dispatch]);

    const formatTime = (seconds) => {
        const now = new Date();
        const date = new Date(seconds * 1000);
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

        if (diffInHours < 24) {
            return `${diffInHours}h ago`;
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };

    const handleMarkAllAsRead = () => {
        // dispatch(markAllAsRead());
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" className="relative p-2">
                    <Bell className="h-5 w-5 text-gray-600" />
                    <AnimatePresence>
                        {unreadCount > 0 && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-orange-500 rounded-full"
                            >
                                {unreadCount}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0">
                <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                    <div className="p-4 bg-orange-100 border-b border-orange-200">
                        <h2 className="text-lg font-semibold text-orange-800">Notifications</h2>
                    </div>
                    <ScrollArea className="h-[300px]">
                        <AnimatePresence>
                            {notifications.length > 0 ? (
                                <ul className="divide-y divide-orange-100">
                                    {notifications.map((notification) => (
                                        <motion.li
                                            key={notification.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className="p-4 hover:bg-orange-50 transition duration-150 ease-in-out"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="flex-shrink-0">
                                                    <div className="w-10 h-10 rounded-full bg-orange-200 flex items-center justify-center">
                                                        <Bell className="h-5 w-5 text-orange-500" />
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                                                    <p className="text-xs text-gray-500 mt-1">{notification.body}</p>
                                                    <p className="text-xs text-orange-400 mt-1">{formatTime(notification.createdAt._seconds)}</p>
                                                </div>
                                                {!notification.isRead && (
                                                    <div className="flex-shrink-0">
                                                        <span className="inline-block w-2 h-2 rounded-full bg-orange-500"></span>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.li>
                                    ))}
                                </ul>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="p-4 text-center text-gray-500"
                                >
                                    No notifications
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </ScrollArea>
                    <div className="p-4 bg-orange-50 border-t border-orange-100">
                        <Button
                            onClick={handleMarkAllAsRead}
                            variant="outline"
                            className="w-full flex items-center justify-center bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                        >
                            <Check className="mr-2 h-4 w-4" /> Mark all as read
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default NotificationPopover;