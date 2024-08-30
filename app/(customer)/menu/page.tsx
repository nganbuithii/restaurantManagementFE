'use client'
import Header from "@/components/header";
import Image from "next/image";
import Footer from "@/components/footer";

export default function HomePage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative h-screen flex items-center justify-center">
                    <Image 
                        src="/images/menu1.jpg" 
                        alt="Hero background" 
                        layout="fill" 
                        objectFit="cover" 
                        className="brightness-50"
                    />
                    <div className="relative z-10 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                            DISCOVER THE TASTE OF PERFECTION
                        </h1>
                        <p className="text-xl text-white mb-8">
                            Experience culinary excellence at its finest
                        </p>
                        <button className="bg-orange-500 text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-orange-600 transition duration-300">
                            Explore Our Menu
                        </button>
                    </div>
                </section>

                {/* About Section */}
                <section className="py-20 bg-gray-100">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
                            MEALS RIGHT FROM THE OVEN
                        </h2>
                        <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto mb-12">
                            We believe that every meal is an experience to be cherished. Our restaurant is a culinary haven where tradition meets innovation.
                        </p>
                        <div className="flex flex-wrap -mx-4">
                            <div className="w-full md:w-1/2 px-4 mb-8 md:mb-0">
                                <Image 
                                    src="/images/menu2.jpg" 
                                    alt="About Us" 
                                    width={600} 
                                    height={400} 
                                    objectFit="cover" 
                                    className="rounded-lg shadow-lg"
                                />
                            </div>
                            <div className="w-full md:w-1/2 px-4 flex flex-col justify-center">
                                <h3 className="text-2xl font-bold mb-4">ABOUT OKEN</h3>
                                <p className="text-gray-700 mb-6">
                                    Whether you are in the mood for a hearty meal or a light bite, our menu is designed to provide a memorable dining experience. Our dedicated team is committed to delivering exceptional service and ensuring that every visit to Oken is a delightful one.
                                </p>
                                <button className="bg-orange-500 text-white py-2 px-6 rounded-full inline-block hover:bg-orange-600 transition duration-300">
                                    Learn More
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Menu Section */}
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">OUR MENU</h2>
                        <div className="flex flex-wrap -mx-4">
                            {[1, 2, 3, 4].map((item) => (
                                <div key={item} className="w-full md:w-1/2 lg:w-1/3 px-4 mb-8">
                                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                        <Image 
                                            src="/images/food-home1.png" 
                                            alt={`Dish ${item}`} 
                                            width={400} 
                                            height={300} 
                                            objectFit="cover"
                                        />
                                        <div className="p-6">
                                            <h3 className="text-xl font-semibold mb-2">Gà chiên mắm</h3>
                                            <p className="text-gray-600 mb-4">Gà chiên với mắm, hành tỏi ớt</p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-2xl font-bold text-orange-500">$50</span>
                                                <button className="bg-orange-500 text-white py-2 px-4 rounded-full hover:bg-orange-600 transition duration-300">
                                                    Order Now
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Best Seller Section */}
                <section className="py-20 bg-gray-100">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">BEST SELLER DISHES</h2>
                        <div className="flex flex-wrap -mx-4">
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="w-full md:w-1/3 px-4 mb-8">
                                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                                        <Image 
                                            src="/images/menu2.jpg" 
                                            alt={`Best Seller ${item}`} 
                                            width={120} 
                                            height={120} 
                                            className="rounded-full mx-auto mb-4"
                                        />
                                        <h3 className="text-xl font-semibold mb-2">Pancake Cake</h3>
                                        <p className="text-gray-600 mb-4">$18.00</p>
                                        <div className="flex justify-center space-x-4">
                                            <button className="bg-green-500 text-white py-2 px-4 rounded-full hover:bg-green-600 transition duration-300">
                                                Add to Cart
                                            </button>
                                            <button className="bg-orange-500 text-white py-2 px-4 rounded-full hover:bg-orange-600 transition duration-300">
                                                Order Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Cheers Section */}
                <section className="relative h-96">
                    <Image 
                        src="/images/cheers.png" 
                        alt="Cheers" 
                        layout="fill" 
                        objectFit="cover" 
                        className="brightness-75"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Celebrate with Us</h2>
                            <p className="text-xl text-white mb-8">Experience unforgettable moments at Oken</p>
                            <button className="bg-orange-500 text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-orange-600 transition duration-300">
                                Make a Reservation
                            </button>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}