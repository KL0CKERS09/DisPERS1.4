"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

type Alert = {
  _id: string;
  title: string;
  description: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  img: string;
  createdAt: string;
  status: "active" | "resolved";
  location: string;
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  useEffect(() => {
    fetch(`/api/admin-alert?page=${page}&limit=20`)
      .then((res) => res.json())
      .then((data) => {
        setAlerts(data.alerts);
        setTotal(data.total);
      })
      .catch(console.error);
  }, [page]);

  const openViewModal = (alert: Alert) => {
    setSelectedAlert(alert);
  };

  const closeModal = () => {
    setSelectedAlert(null);
  };

  return (
    <section className="w-full flex flex-col items-center p-8 space-y-6">
      <div className="flex justify-between items-center w-full max-w-6xl">
        <h1 className="text-2xl font-bold">Alerts</h1>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {alerts.length > 0 ? (
          alerts.map((alert) => (
            <li
              key={alert._id}
              className="bg-white rounded-xl overflow-hidden shadow-md cursor-pointer hover:scale-105 transition-transform"
              onClick={() => openViewModal(alert)}
            >
              <div className="relative h-48 w-full">
                <Image src={alert.img} alt={alert.title} layout="fill" objectFit="cover" />
              </div>
              <div className="p-4">
                <h2 className="font-bold text-lg mb-1">{alert.title}</h2>
                <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{new Date(alert.createdAt).toLocaleDateString()}</span>
                  <span className={`px-2 py-1 rounded ${alert.status === 'active' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                    {alert.status}
                  </span>
                </div>
              </div>
            </li>
          ))
        ) : (
          <p>No alerts found.</p>
        )}
      </ul>

      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="self-center">Page {page}</span>
        <button
          onClick={() => setPage((p) => (p * 20 < total ? p + 1 : p))}
          disabled={page * 20 >= total}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {selectedAlert && (
        <div className="fixed inset-0 z-[990] flex items-center justify-center bg-black/50">
        <div className="bg-[#1e1e1e] text-white w-[90%] max-w-md p-5 rounded-xl relative shadow-lg">
          <button
            onClick={closeModal}
            className="absolute top-3 right-3 text-white text-xl hover:text-red-500"
          >
            &times;
          </button>
  
          <div className="text-red-500 font-semibold text-sm mb-2"> ALERT</div>
          <h2 className="text-2xl font-bold mb-4">{selectedAlert.title || 'Flash Flood Warning'}</h2>
  
          <div className="w-full h-40 bg-gray-300 mb-4 rounded">
            <Image
              src={selectedAlert.img || 'https://via.placeholder.com/400x200'}
              alt={selectedAlert.title}
              width={400}
              height={200}
              className="w-full h-full object-cover rounded"
            />
          </div>
  
          <div className="mb-2">
            <strong className="text-red-400">Severity Level</strong>
            <p className="text-sm text-gray-300">{selectedAlert.severity}</p>
          </div>
          <div className="mb-2">
            <strong className="text-yellow-400">Location</strong>
            <p className="text-sm text-gray-300">{selectedAlert.location || 'Main Street and surrounding areas'}</p>
          </div>
          <div className="mb-2">
            <strong className="text-blue-400">Current Status</strong>
            <p className="text-sm text-gray-300">{selectedAlert.status}</p>
          </div>
  
          <div className="bg-[#2b2b2b] p-3 rounded-md mt-4 text-sm">
            <strong className="block mb-2 text-white">Description</strong>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              <li>{selectedAlert.description}</li>
            </ul>
          </div>
  
          <div className="text-xs text-gray-500 mt-4 flex justify-between">
            <span>{new Date(selectedAlert.createdAt).toLocaleString()}</span>
            <a href={`tel:911`} className="text-blue-400 hover:underline">Emergency Contact: 911</a>
          </div>
        </div>
      </div>
      )}
    </section>
  );
}
