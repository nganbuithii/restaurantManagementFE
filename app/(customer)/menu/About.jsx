import Image from 'next/image';

const AboutSection = () => {
    return (
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
    );
};

export default AboutSection;