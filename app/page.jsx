'use client'
import Footer from "@/components/footer";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import Head from "next/head";
import Image from "next/image";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";

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
                            <h1 className="text-4xl text-black">
                                Welcome, {user ? user.username : "Guest"}
                            </h1>
                            <h1 className="text-6xl font-extrabold text-white mb-6 animate__animated animate__fadeInDown">Exquisite Dining Experience</h1>
                            <p className="text-xl text-white mb-8 animate__animated animate__fadeInUp">Indulge in culinary perfection crafted by world-renowned chefs</p>
                            <div className="flex justify-center space-x-4">
                                <Button className="bg-white text-black px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-200 transition duration-300 animate__animated animate__fadeInLeft">Explore Menu</Button>
                                <Button className="bg-orange-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-orange-600 transition duration-300 animate__animated animate__fadeInRight">Reserve Table</Button>
                            </div>
                        </div>
                    </section>

                    {/* Featured Dishes */}
                    <section className="py-24 bg-white">
                        <div className="container mx-auto px-4">
                            <h2 className="text-4xl font-bold text-center mb-16">Our Signature Dishes</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                                {[1, 2, 3].map((dish) => (
                                    <div key={dish} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-300">
                                        <Image src={`/images/food-${dish}.jpg`} alt={`Signature Dish ${dish}`} width={600} height={400} className="w-full h-64 object-cover" />
                                        <div className="p-6">
                                            <h3 className="text-2xl font-semibold mb-2">Gourmet Delight {dish}</h3>
                                            <p className="text-gray-600 mb-4">A tantalizing fusion of flavors that will excite your palate.</p>
                                            <Button className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition duration-300">Learn More</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

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

                    {/* Chef Showcase */}
                    <section className="py-24 bg-orange-100">
                        <div className="container mx-auto px-4">
                            <h2 className="text-4xl font-bold text-center mb-16">Meet Our Master Chefs</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                                {[1, 2, 3].map((chef) => (
                                    <div key={chef} className="text-center">
                                        <div className="relative mb-6 mx-auto w-64 h-64 rounded-full overflow-hidden shadow-lg">
                                            <Image src={`/images/chef-${chef}.jpg`} alt={`Chef ${chef}`} width={100} height={100}  style={{ objectFit: 'cover' }} 
                                            />
                                        </div>
                                        <h3 className="text-2xl font-semibold mb-2">Chef Name {chef}</h3>
                                        <p className="text-gray-600">Specialty Cuisine</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Testimonials */}
                    <section className="py-24 bg-gray-900 text-white">
                        <div className="container mx-auto px-4">
                            <h2 className="text-4xl font-bold text-center mb-16">What Our Guests Say</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                {[1, 2].map((testimonial) => (
                                    <div key={testimonial} className="bg-gray-800 p-8 rounded-lg shadow-lg">
                                        <p className="text-lg mb-6">&quot;An extraordinary dining experience that tantalizes all senses. The attention to detail in every dish is remarkable.&quot;</p>
                                        <div className="flex items-center">
                                            <div className="w-12 h-12 rounded-full bg-gray-600 mr-4"></div>
                                            <div>
                                                <h4 className="font-semibold">Guest Name</h4>
                                                <p className="text-gray-400">Food Critic</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </main>
                <Footer />
            </div>
        </>
    );
}
export default dynamic(() => Promise.resolve(Home), { ssr: false })