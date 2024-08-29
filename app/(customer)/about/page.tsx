import Footer from '@/components/footer';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <section className="relative bg-gradient-to-b from-orange-400 to-orange-600 py-20 px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0">
            <svg
              className="absolute inset-0 h-full w-full"
              preserveAspectRatio="xMidYMid slice"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 1463 360"
            >
              <path
                className="text-orange-500 text-opacity-40"
                fill="currentColor"
                d="M-82.673 72l1761.849 472.086-134.327 501.315-1761.85-472.086z"
              />
              <path
                className="text-orange-700 text-opacity-40"
                fill="currentColor"
                d="M-217.088 544.086L1544.761 72l134.327 501.316-1761.849 472.086z"
              />
            </svg>
          </div>
          <div className="relative max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center">
              <div className="lg:w-1/2 lg:pr-8 mb-10 lg:mb-0">
                <Image
                  src="/images/login.png"
                  alt="About Us"
                  width={500}
                  height={500}
                  className="rounded-lg shadow-2xl object-cover"
                />
              </div>
              <div className="lg:w-1/2 text-center lg:text-left">
                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
                  About Us
                </h1>
                <p className="mt-6 text-xl text-white">
                  From they fine job he give of rich he. They age and draw mrs like. Improving end distrusts may instantly was household applauded incommode. Why kept very ever home mrs. Considered sympathize ten uncommonly occasional assistance sufficient not. Letter of on become he tended active enable to.
                </p>
                <div className="mt-10">
                  <Button
                    className="bg-white text-orange-500 py-3 px-8 rounded-full text-lg font-semibold shadow-lg 
                            transition duration-300 ease-in-out
                            hover:bg-orange-100 hover:text-orange-600 hover:shadow-xl
                            focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-opacity-50"
                  >
                    Read More
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default AboutPage;