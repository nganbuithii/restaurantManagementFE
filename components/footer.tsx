import Image from "next/image";
import Link from "next/link";
import { FaFacebookSquare, FaInstagramSquare } from "react-icons/fa";
import { IoLogoYoutube } from "react-icons/io";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-8 px-4 md:px-8">
        <div className="container mx-auto flex flex-col md:flex-row justify-between space-y-8 md:space-y-0">
            <div className="flex flex-col space-y-4">
                <Image src="/images/2.png" alt="logo" width={100} height={100} className="rounded-full" />
                <p className="text-gray-400">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore. <a href="#" className="text-orange-400 hover:underline">Learn more</a></p>
                <p className="font-bold text-lg">OPENING HOURS</p>
                <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:space-x-6">
                    <div>
                        <p className="font-semibold">Monday - Friday</p>
                        <p>8:00 am - 9:00 pm</p>
                    </div>
                    <div>
                        <p className="font-semibold">Saturday</p>
                        <p>8:00 am - 11:00 pm</p>
                    </div>
                    <div>
                        <p className="font-semibold">Sunday</p>
                        <p>CLOSED</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col space-y-4">
                <h2 className="font-bold text-lg">NAVIGATION</h2>
                <Link href="#" className="hover:text-orange-400">Menu</Link>
                <Link href="#" className="hover:text-orange-400">About Us</Link>
                <Link href="#" className="hover:text-orange-400">Contact Us</Link>
                <Link href="#" className="hover:text-orange-400">Main Dishes</Link>
            </div>
            <div className="flex flex-col space-y-4">
                <h2 className="font-bold text-lg">DISHES</h2>
                <Link href="#" className="hover:text-orange-400">Asian Dishes</Link>
                <Link href="#" className="hover:text-orange-400">Chinese Food</Link>
                <Link href="#" className="hover:text-orange-400">Vietnamese Food</Link>
                <Link href="#" className="hover:text-orange-400">Korean Dishes</Link>
            </div>
            <div className="flex flex-col space-y-4">
                <h2 className="font-bold text-lg">FOLLOW US</h2>
                <div className="flex space-x-4">
                    <a href="#" className="text-2xl hover:text-blue-600"><FaFacebookSquare /></a>
                    <a href="#" className="text-2xl hover:text-red-600"><IoLogoYoutube /></a>
                    <a href="#" className="text-2xl hover:text-pink-600"><FaInstagramSquare /></a>
                </div>
            </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-400">
            <p>&copy; 2024 Design by NganBuiThi - information technology industry project</p>
        </div>
    </footer>
    )};