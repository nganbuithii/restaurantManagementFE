import Image from 'next/image';

const BannerSection = () => {
    return (
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
                    Book a Table
                </button>
            </div>
        </div>
    </section>
    );
};

export default BannerSection;