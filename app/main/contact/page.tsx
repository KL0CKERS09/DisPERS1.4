"use client";
import { FaFacebookF, FaInstagram, FaTwitter, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { MdPhoneAndroid } from "react-icons/md";


export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col items-center px-6 py-16">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Methods */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <FaFacebookF className="text-blue-600 text-xl" />
              <a href="https://facebook.com/yourpage" target="_blank" rel="noopener noreferrer" className="text-lg hover:underline">
                facebook.com/dispersbagongsilangan
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <FaInstagram className="text-pink-500 text-xl" />
              <a href="https://instagram.com/yourpage" target="_blank" rel="noopener noreferrer" className="text-lg hover:underline">
                instagram.com/dispersbagongsilangan
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <FaTwitter className="text-black text-xl" />
              <a href="https://x.com/yourpage" target="_blank" rel="noopener noreferrer" className="text-lg hover:underline">
                x.com/dispersbagongsilangan
              </a>
            </div>


            <div className="flex items-center space-x-4">
              <MdPhoneAndroid className="text-green-600 text-xl" />
              <p className="text-lg">+1 234 567 8900</p>
            </div>

            <div className="flex items-center space-x-4">
              <FaPhoneAlt className="text-blue-500 text-xl" />
              <p className="text-lg">(123) 456-7890</p>
            </div>

            <div className="flex items-center space-x-4">
              <FaEnvelope className="text-red-500 text-xl" />
              <a href="barangaysilangandispers@gmail.com" className="text-lg hover:underline">
              barangaysilangandispers@gmail.com
              </a>
            </div>
          </div>

          {/* Illustration or Message Box */}
          <div className="bg-gray-50 rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">We’d love to hear from you!</h2>
            <p className="text-gray-600">
              Whether you have a question about features, pricing, or anything else, our team is ready to answer all your questions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
