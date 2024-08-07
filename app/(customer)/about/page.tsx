// app/about/page.tsx

import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import Image from 'next/image';


const AboutPage = () => {
  return (
    <>

      <Header />
      {/* <svg viewBox="0 0 1440 320" className="absolute top-0 left-0 w-full h-auto z-20 opacity-80">
        <path fill="orange" fillOpacity="1" d="M0,224L48,192C96,160,192,96,288,74.7C384,53,480,75,576,80C672,85,768,75,864,96C960,117,1056,171,1152,197.3C1248,224,1344,224,1392,224L1440,224L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
      </svg> */}
      <section className="flex flex-col md:flex-row items-center bg-orange-500 min-h-screen py-16 px-4">
        <div className="flex-shrink-0 mb-8 md:mb-0 md:mr-8">
          <Image src="/images/login.png" alt="About Us" width={300} height={300} className="object-cover rounded-lg shadow-lg" />
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold text-white mb-4">About Us</h1>
          <p className="text-lg text-white mb-6 max-w-lg mx-auto md:mx-0">
            From they fine job he give of rich he. They age and drae mrs like improving and distrusts may instantly was household applauded incomemode. Why kept very ever home mrs. Considered sympathize ten uncommonly occasional assistant suficient not. Letter of on becone he tended active enable to. Vicinity rrlation sensible social suprise screened.
          </p>
          <Button className="bg-white text-orange-500 py-2 px-6 rounded-full shadow-lg hover:bg-gray-200 transition duration-300">Read More</Button>
        </div>
      </section>
    </>
  );
}

export default AboutPage;
