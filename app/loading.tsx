'use client';

import Image from 'next/image';
import logo from '@/public/logoo 1.png'; 

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#ffd2ae] z-500">
      <Image src={logo} alt="DisPERS Logo" width={60} height={60} className="mb-4 animate-pulse" />
      <p className="text-gray-600 text-sm animate-pulse">Loading...</p>
    </div>
  );
}