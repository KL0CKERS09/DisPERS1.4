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
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-lg p-6">
            <button className="ml-auto text-gray-500" onClick={closeModal}>✕</button>
            <h2 className="text-xl font-bold mb-2">{selectedAlert.title}</h2>
            <Image src={selectedAlert.img} alt={selectedAlert.title} width={400} height={200} className="rounded" />
            <p><strong>Description:</strong> {selectedAlert.description}</p>
            <p><strong>Location:</strong> {selectedAlert.location}</p>
            <p><strong>Severity:</strong> {selectedAlert.severity}</p>
            <p><strong>Status:</strong> {selectedAlert.status}</p>
            <p><strong>Date:</strong> {new Date(selectedAlert.createdAt).toLocaleString()}</p>
          </div>
        </div>
      )}
    </section>
  );
}
