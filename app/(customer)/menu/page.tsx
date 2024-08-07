import Header from "@/components/header";
import Image from "next/image";
import 'animate.css';
import Footer from "@/components/footer";

export default function HomePage() {
    return (
        <>
            <Header />
            {/* <svg viewBox="0 0 1440 320" className="absolute top-0 left-0 w-full h-auto z-20 opacity-80">
                <path fill="orange" fillOpacity="1" d="M0,224L48,192C96,160,192,96,288,74.7C384,53,480,75,576,80C672,85,768,75,864,96C960,117,1056,171,1152,197.3C1248,224,1344,224,1392,224L1440,224L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
            </svg> */}
            <main className="bg-white min-h-screen justify-center">
                <section className="w-full">
                    <div className="relative w-full h-80 flex items-center justify-center mx-auto rounded-2xl overflow-hidden">
                        <Image src="/images/menu1.jpg" alt="menu-1" layout="fill" objectFit="cover" />
                        <h1 className="absolute text-center text-orange-400 text-5xl font-bold">
                            DISCOVER THE TASTE OF PERTECTION
                        </h1>
                    </div>
                </section>
                <section className="mt-7">
                    <h1 className="font-bold text-center text-4xl">MEALS RIGHT FROM THE OVEN</h1>
                    <p className="font-bold text-gray-500 text-center ">
                        We believe that every meal is an experience to be cherished. Our restaurant is a culinary haven where tradition meet invonation.
                    </p>
                </section>
                <div className="flex flex-row justify-center">
                    <section className="py-8 bg-gray-50">
                        <div className="container mx-auto px-4">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Main dish</h3>
                            <div className="space-y-6">
                                <div className="flex items-start bg-white shadow-md rounded-lg overflow-hidden">
                                    <div className="flex-shrink-0 p-4">
                                        <Image src="/images/food-home1.png" alt="dish1" width={80} height={80} className="object-cover rounded-md" />
                                    </div>
                                    <div className="p-4 flex-1">
                                        <p className="text-lg font-bold text-gray-900">Gà chiên mắm</p>
                                        <p className="text-gray-600">Gà chiên với mắm, hành tỏi ớt ------ <span className="font-semibold text-green-600">$50</span></p>
                                    </div>
                                </div>

                                <div className="flex items-start bg-white shadow-md rounded-lg overflow-hidden">
                                    <div className="flex-shrink-0 p-4">
                                        <Image src="/images/food-home1.png" alt="dish2" width={80} height={80} className="object-cover rounded-md" />
                                    </div>
                                    <div className="p-4 flex-1">
                                        <p className="text-lg font-bold text-gray-900">Gà chiên mắm</p>
                                        <p className="text-gray-600">Gà chiên với mắm, hành tỏi ớt ------ <span className="font-semibold text-green-600">$50</span></p>
                                    </div>
                                </div>

                                <div className="flex items-start bg-white shadow-md rounded-lg overflow-hidden">
                                    <div className="flex-shrink-0 p-4">
                                        <Image src="/images/food-home1.png" alt="dish3" width={80} height={80} className="object-cover rounded-md" />
                                    </div>
                                    <div className="p-4 flex-1">
                                        <p className="text-lg font-bold text-gray-900">Gà chiên mắm</p>
                                        <p className="text-gray-600">Gà chiên với mắm, hành tỏi ớt ------ <span className="font-semibold text-green-600">$50</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="py-8 bg-gray-50">
                        <div className="container mx-auto px-4">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Main dish</h3>
                            <div className="space-y-6">
                                <div className="flex items-start bg-white shadow-md rounded-lg overflow-hidden">
                                    <div className="flex-shrink-0 p-4">
                                        <Image src="/images/food-home1.png" alt="dish1" width={80} height={80} className="object-cover rounded-md" />
                                    </div>
                                    <div className="p-4 flex-1">
                                        <p className="text-lg font-bold text-gray-900">Gà chiên mắm</p>
                                        <p className="text-gray-600">Gà chiên với mắm, hành tỏi ớt ------ <span className="font-semibold text-green-600">$50</span></p>
                                    </div>
                                </div>

                                <div className="flex items-start bg-white shadow-md rounded-lg overflow-hidden">
                                    <div className="flex-shrink-0 p-4">
                                        <Image src="/images/food-home1.png" alt="dish2" width={80} height={80} className="object-cover rounded-md" />
                                    </div>
                                    <div className="p-4 flex-1">
                                        <p className="text-lg font-bold text-gray-900">Gà chiên mắm</p>
                                        <p className="text-gray-600">Gà chiên với mắm, hành tỏi ớt ------ <span className="font-semibold text-green-600">$50</span></p>
                                    </div>
                                </div>

                                <div className="flex items-start bg-white shadow-md rounded-lg overflow-hidden">
                                    <div className="flex-shrink-0 p-4">
                                        <Image src="/images/food-home1.png" alt="dish3" width={80} height={80} className="object-cover rounded-md" />
                                    </div>
                                    <div className="p-4 flex-1">
                                        <p className="text-lg font-bold text-gray-900">Gà chiên mắm</p>
                                        <p className="text-gray-600">Gà chiên với mắm, hành tỏi ớt ------ <span className="font-semibold text-green-600">$50</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <section className="flex flex-col lg:flex-row items-stretch justify-center gap-8 bg-orange-400">
                    <div className="flex-1 max-w-lg flex flex-col justify-center lg:w-1/2 px-24 mt-7 mb-7">
                        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center lg:text-left">ABOUT OKEN</h1>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            Whether you're in the mood for a hearty meal or a light bite, our menu is designed to provide a memorable dining experience. Our dedicated team is committed to delivering exceptional service and ensuring that every visit to Oken is a delightful one. Explore our menu and discover your new favorite dish today!
                        </p>
                    </div>
                    <div className="flex-1 lg:w-1/2 relative ">
                        <Image src="/images/menu2.jpg" alt="menu" layout="fill" objectFit="cover" className=" shadow-lg" />
                    </div>
                </section>

                <section className="py-12 bg-gray-100">
                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">BEST SELLER DISHES</h1>
                    <div className="flex flex-wrap justify-center gap-8">
                        <div className="w-60 bg-white p-4 rounded-lg shadow-md flex flex-col items-center text-center">
                            <Image src="/images/menu2.jpg" alt="seller-1" width={70} height={70} className="rounded-full mb-4" />
                            <p className="text-lg font-semibold mb-2">Pancake Cake</p>
                            <p className="text-gray-600 mb-4">$18.00</p>
                            <div className="flex gap-4">
                                <button className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600">Add to Cart</button>
                                <button className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600">Order Now</button>
                            </div>
                        </div>
                        <div className="w-60 bg-white p-4 rounded-lg shadow-md flex flex-col items-center text-center">
                            <Image src="/images/menu2.jpg" alt="seller-1" width={70} height={70} className="rounded-full mb-4" />
                            <p className="text-lg font-semibold mb-2">Pancake Cake</p>
                            <p className="text-gray-600 mb-4">$18.00</p>
                            <div className="flex gap-4">
                                <button className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600">Add to Cart</button>
                                <button className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600">Order Now</button>
                            </div>
                        </div>
                        <div className="w-60 bg-white p-4 rounded-lg shadow-md flex flex-col items-center text-center">
                            <Image src="/images/menu2.jpg" alt="seller-1" width={70} height={70} className="rounded-full mb-4" />
                            <p className="text-lg font-semibold mb-2">Pancake Cake</p>
                            <p className="text-gray-600 mb-4">$18.00</p>
                            <div className="flex gap-4">
                                <button className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600">Add to Cart</button>
                                <button className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600">Order Now</button>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="w-full overflow-hidden mb-10">
                    <div className="relative w-full h-96">
                        <Image
                            src="/images/cheers.png"
                            alt="cheer"
                            layout="fill"
                            objectFit="cover"
                            className="absolute inset-0"
                        />
                    </div>
                </div>







            </main>




            <Footer />




        </>
    );
}
