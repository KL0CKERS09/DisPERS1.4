import Image from "next/image";
import Link from "next/link";
import {
    FaFacebookF,
    FaTwitter,
    FaInstagram,
    FaMapMarkerAlt,
    FaEnvelope,
} from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-[#F4B183] text-gray-800 pt-10 py-10 px-6 md:px-16">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-15">
                <div className="flex flex-col gap-[1em]">
                    <Image
                        src="/barangay-bagong-silangan-logo.png"
                        alt="Barangay Bagong Silangan Logo"
                        width={100} 
                        height={100} 
                        className="mb-4 scale-[1.6]"
                    />
                    <p className="text-sm mb-4">
                        Your trusted community alert system providing real-time emergency
                        notifications and critical updates to keep you informed and safe.
                    </p>
                    <div className="flex gap-4 text-orange-700">
                        <FaFacebookF />
                        <FaTwitter />
                        <FaInstagram />
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold mb-4">Quick Links</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/main">Home</Link></li>
                        <li><Link href="/main/about">About Us</Link></li>
                        <li><Link href="/main/contact">Contact</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold mb-4">Contact Info</h3>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                            <FaMapMarkerAlt /> M4X6+46F, Bonifacio, Brgy, Quezon City, Metro Manila
                        </li>
                        <li className="flex items-center gap-2">
                            <FaEnvelope /> DisPERS100484@gmail.com
                        </li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-orange-300 mt-10 pt-4 text-sm flex flex-col md:flex-row justify-center items-center text-gray-700">
                <p>© 2025 DisPERS. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;