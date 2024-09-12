'use client'
import Footer from "@/components/footer";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import Head from "next/head";
import Image from "next/image";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import FeaturedDishes from '@/components/FeaturedDishes'
import Testimonials from '@/components/Testimonials'
import ChefShowcase from '@/components/ChefShowcase'
import ChatSupport  from '@/components/ChatSupport'
function Home() {
    const user = useSelector((state) => state.auth.user);
    console.log("User:", user);
    return (
        <>
            <Head>
                <title>Nabity Restaurant </title>
            </Head>

            <div className="bg-gray-50">
                <Header />
                <main>

                    {/* Hero Section */}
                    <section className="relative h-screen flex items-center justify-center text-center bg-cover bg-center" style={{ backgroundImage: "url('/images/booking.jpg')" }}>
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                        <div className="relative z-10 max-w-4xl mx-auto px-4">
                            {/* <h1 className="text-4xl text-black">
                                Welcome, {user ? user.username : "Guest"}
                            </h1> */}
                            <h1 className="text-6xl font-extrabold text-white mb-6 animate__animated animate__fadeInDown">Exquisite Dining Experience</h1>
                            <p className="text-xl text-white mb-8 animate__animated animate__fadeInUp">Indulge in culinary perfection crafted by world-renowned chefs</p>
                            <div className="flex justify-center space-x-4">
                                <Button className="bg-white text-black px-8 py-6 rounded-full text-lg font-semibold hover:bg-gray-200 transition duration-300 animate__animated animate__fadeInLeft">Explore Menu</Button>
                                <Button className="bg-orange-500 text-white px-8 py-6 rounded-full text-lg font-semibold hover:bg-orange-600 transition duration-300 animate__animated animate__fadeInRight">Reserve Table</Button>
                            </div>
                        </div>
                    </section>

                    {/* Featured Dishes */}
                    <FeaturedDishes />

                    {/* About Us */}
                    <section className="py-24 bg-gray-100">
                        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
                            <div className="md:w-1/2 mb-8 md:mb-0">
                                <Image src="/images/hanhtrinh.jpg" alt="About Us" width={600} height={600} className="rounded-lg shadow-2xl" />
                            </div>
                            <div className="md:w-1/2 md:pl-12">
                                <h2 className="text-4xl font-bold mb-6">Our Culinary Journey</h2>
                                <p className="text-lg text-gray-700 mb-8">
                                    Embark on a gastronomic adventure with us. Our passionate chefs create unforgettable dining experiences, blending traditional techniques with innovative flair. Every dish tells a story of quality, creativity, and culinary excellence.
                                </p>
                                <Button className="bg-black text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-800 transition duration-300">Discover Our Story</Button>
                            </div>
                        </div>
                    </section>

                    <ChefShowcase />

                    {/* Testimonials */}
                    <Testimonials />
                    <ChatSupport />
                </main>
                <Footer />
            </div>
        </>
    );
}
export default dynamic(() => Promise.resolve(Home), { ssr: false })