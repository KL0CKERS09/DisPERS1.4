'use client';

import React from 'react';
import Image from 'next/image';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  alert: any;
}

export default function AlertModal({ isOpen, onClose, alert }: AlertModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[990] flex items-center justify-center bg-black/50">
      <div className="bg-[#1e1e1e] text-white w-[90%] max-w-md p-5 rounded-xl relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white text-xl hover:text-red-500"
        >
          &times;
        </button>

        <div className="text-red-500 font-semibold text-sm mb-2"> ALERT</div>
        <h2 className="text-2xl font-bold mb-4">{alert.title || 'Flash Flood Warning'}</h2>

        <div className="w-full h-40 bg-gray-300 mb-4 rounded">
          <Image
            src={alert.img || 'https://via.placeholder.com/400x200'}
            alt={alert.title}
            width={400}
            height={200}
            className="w-full h-full object-cover rounded"
          />
        </div>

        <div className="mb-2">
          <strong className="text-red-400">Severity Level</strong>
          <p className="text-sm text-gray-300">{alert.severity}</p>
        </div>
        <div className="mb-2">
          <strong className="text-yellow-400">Location</strong>
          <p className="text-sm text-gray-300">{alert.location || 'Main Street and surrounding areas'}</p>
        </div>
        <div className="mb-2">
          <strong className="text-blue-400">Current Status</strong>
          <p className="text-sm text-gray-300">{alert.status}</p>
        </div>

        <div className="bg-[#2b2b2b] p-3 rounded-md mt-4 text-sm">
          <strong className="block mb-2 text-white">Description</strong>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            <li>{alert.description}</li>
          </ul>
        </div>

        <div className="text-xs text-gray-500 mt-4 flex justify-between">
          <span>{alert.createdAt}</span>
          <a href={`tel:911`} className="text-blue-400 hover:underline">Emergency Contact: 911</a>
        </div>
      </div>
    </div>
  );
}
