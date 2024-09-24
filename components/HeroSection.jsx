import React from 'react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
    return (
        <section className="relative h-screen flex items-center justify-center text-center bg-cover bg-center" style={{ backgroundImage: "url('/images/booking.jpg')" }}>
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative z-10 max-w-4xl mx-auto px-4">
                <h1 className="text-6xl font-extrabold text-white mb-6 animate__animated animate__fadeInDown">Exquisite Dining Experience</h1>
                <p className="text-xl text-white mb-8 animate__animated animate__fadeInUp">Indulge in culinary perfection crafted by world-renowned chefs</p>
                <div className="flex justify-center space-x-4">
                    <Button className="bg-white text-black px-8 py-6 rounded-full text-lg font-semibold hover:bg-gray-200 transition duration-300 animate__animated animate__fadeInLeft">Explore Menu</Button>
                    <Button className="bg-orange-500 text-white px-8 py-6 rounded-full text-lg font-semibold hover:bg-orange-600 transition duration-300 animate__animated animate__fadeInRight">Reserve Table</Button>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;