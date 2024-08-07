import Header from "@/components/header";
import Image from "next/image";
import "./styles.css";
import 'animate.css';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaFacebookSquare, FaInstagramSquare } from "react-icons/fa";
import { IoLogoYoutube } from "react-icons/io";
import Footer from "@/components/footer";

export default function HomePage() {
    return (
        <>
            <Header />
            {/* <svg viewBox="0 0 1440 320" className="absolute top-0 left-0 w-full h-auto z-20 opacity-80">
                <path fill="orange" fillOpacity="1" d="M0,224L48,192C96,160,192,96,288,74.7C384,53,480,75,576,80C672,85,768,75,864,96C960,117,1056,171,1152,197.3C1248,224,1344,224,1392,224L1440,224L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
            </svg> */}
            <main className="bg-white min-h-screen flex flex-row justify-center">

                <section className="relative flex flex-col items-center justify-center text-center py-16 px-4 md:py-24 md:px-8">
                    <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url('/path-to-background-image.png')` }}></div>
                    <div className="relative z-10">
                        <h1 className="text-5xl font-bold mb-6">We provide the best food for you</h1>
                        <p className="text-lg mb-8 max-w-xl mx-auto">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                        <div className="flex justify-center space-x-4">
                            <button className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800">Menu</button>
                            <button className="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600">Book a table</button>
                        </div>
                    </div>
                </section>
                <section className="relative flex flex-col md:flex-row items-center justify-center md:space-x-4 px-4 py-8">
                    <div className="food relative w-full overflow-hidden ">
                        <Image src="/images/home1.png" alt="Food" width={600} height={600} className="object-cover rounded-lg" />
                    </div>
                    <div className="absolute food-home w-full h-full flex items-end justify-center pb-10">
                        <Image src="/images/food-home1.png" alt="Food" width={200} height={200} className="object-cover rounded-lg" />
                    </div>
                    <div className="absolute food-home1 w-full h-full flex items-end justify-center pb-10">
                        <Image src="/images/food-home.png" alt="Food" width={200} height={200} className="object-cover rounded-lg" />
                    </div>
                    <div className="absolute food-home2 w-full h-full flex items-end justify-center pb-10">
                        <Image src="/images/food-home2.png" alt="Food" width={200} height={200} className="object-cover rounded-lg" />
                    </div>
                </section>
            </main>
            <section className="bg-orange-300 min-h-screen flex flex-row justify-center">
                <h2>Trusted by 10000+ companies around the world</h2>
                <h1>FOOD MENU</h1>
                <div>
                    <h2>Main dish</h2>
                </div>
                <Button>MORE</Button>
            </section>
            <section className="bg-gray-100 py-16 px-4 text-center">
                <h1 className="text-3xl font-bold mb-4">Our Special Dishes</h1>
                <p className="text-lg mb-8 max-w-2xl mx-auto">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Curabitur pretium tincidunt lacus.</p>
                <div className="flex justify-center space-x-4">
                    <div className="transition-transform duration-300 transform hover:scale-105 w-64  shadow-md rounded-lg overflow-hidden">
                        <Image src="/images/food-home.png" alt="Special Dish 1" width={256} height={256} className="object-cover w-full h-48" />
                        <div className="p-4">
                            <h2 className="text-xl font-semibold">Dish 1</h2>
                            <p className="text-sm text-gray-600">Description of dish 1.</p>
                        </div>
                    </div>
                    <div className="transition-transform duration-300 transform hover:scale-105 w-64  shadow-md rounded-lg overflow-hidden">
                        <Image src="/images/food-home2.png" alt="Special Dish 2" width={256} height={256} className="object-cover w-full h-48" />
                        <div className="p-4">
                            <h2 className="text-xl font-semibold">Dish 2</h2>
                            <p className="text-sm text-gray-600">Description of dish 2.</p>
                        </div>
                    </div>
                    <div className="transition-transform duration-300 transform hover:scale-105 w-64  shadow-md rounded-lg overflow-hidden">
                        <Image src="/images/food-home1.png" alt="Special Dish 3" width={256} height={256} className="object-cover w-full h-48" />
                        <div className="p-4">
                            <h2 className="text-xl font-semibold">Dish 3</h2>
                            <p className="text-sm text-gray-600">Description of dish 3.</p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="bg-orange-300 min-h-screen flex flex-col items-center py-16 px-4">
                <h2 className="text-4xl font-bold mb-8 text-white">Our Special Chef</h2>
                <div className="flex flex-wrap justify-center gap-6 mb-8">
                    <div className="w-80 h-80 relative">
                        <Image src="/images/home1.png" alt="Chef" width={300} height={300} className="object-cover rounded-lg shadow-lg" />
                    </div>
                    <div className="w-80 h-80 relative">
                        <Image src="/images/home1.png" alt="Chef" width={300} height={300} className="object-cover rounded-lg shadow-lg" />
                    </div>
                    <div className="w-80 h-80 relative">
                        <Image src="/images/home1.png" alt="Chef" width={300} height={300} className="object-cover rounded-lg shadow-lg" />
                    </div>
                    <div className="w-80 h-80 relative">
                        <Image src="/images/home1.png" alt="Chef" width={300} height={300} className="object-cover rounded-lg shadow-lg" />
                    </div>
                    <div className="w-80 h-80 relative">
                        <Image src="/images/home1.png" alt="Chef" width={300} height={300} className="object-cover rounded-lg shadow-lg" />
                    </div>
                </div>
                <Button className="bg-white text-orange-500 py-2 px-6 rounded-full shadow-lg hover:bg-gray-200 transition duration-300">See More</Button>
            </section>
            <section className="flex justify-center flex-col md:flex-row items-center bg-orange-500 min-h-screen py-16 px-4">
                <div className="flex-shrink-0 mb-8 md:mb-0 md:mr-8">
                    <Image src="/images/login.png" alt="About Us" width={600} height={600} className="object-cover rounded-lg shadow-lg" />
                </div>
                <div className="text-center md:text-left">
                    <h1 className="text-4xl font-bold text-white mb-4">About Us</h1>
                    <p className="text-lg text-white mb-6 max-w-lg mx-auto md:mx-0">
                        From they fine job he give of rich he. They age and drae mrs like improving and distrusts may instantly was household applauded incomemode. Why kept very ever home mrs. Considered sympathize ten uncommonly occasional assistant suficient not. Letter of on becone he tended active enable to. Vicinity rrlation sensible social suprise screened.
                    </p>
                    <Button className="bg-white text-orange-500 py-2 px-6 rounded-full shadow-lg hover:bg-gray-200 transition duration-300">Read More</Button>
                </div>
            </section>
            <Footer />




        </>
    );
}
