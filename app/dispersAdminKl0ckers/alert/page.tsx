'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import style from './styles/alert.module.scss';
import AddAlertForm from './addAlert/page';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface Alert {
  _id?: string;
  title: string;
  description: string;
  severity: string;
  location: string;
  status: string;
  img: string;
  createdAt?: string;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [updatedAlert, setUpdatedAlert] = useState<Alert>({
    title: '',
    description: '',
    severity: '',
    location: '',
    status: 'active',
    img: '',
  });

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
    setModalMode('view');
  };

  const openEditModal = (alert: Alert) => {
    setSelectedAlert(alert);
    setUpdatedAlert(alert);
    setModalMode('edit');
  };

  const closeModal = () => {
    setSelectedAlert(null);
    setModalMode(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this alert?')) return;
    try {
      const res = await fetch(`/api/admin-alert/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete alert');
      setAlerts((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateAlertChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUpdatedAlert((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin-alert/${updatedAlert._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: updatedAlert.status,
          img: updatedAlert.img,
        }),
      });
      if (!res.ok) throw new Error('Failed to update alert');
      const { updated } = await res.json();
      setAlerts((prevAlerts) =>
        prevAlerts.map((alert) => (alert._id === updated._id ? updated : alert))
      );
      closeModal();
    } catch (err) {
      console.error('Error updating alert:', err);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUpdatedAlert((prevAlert) => ({ ...prevAlert, img: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="w-full flex flex-col items-center p-8 space-y-6">
      <div className="flex justify-between items-center w-full max-w-6xl">
        <h1 className="text-2xl font-bold">Alert Management</h1>
        <button
          onClick={() => setAddModalOpen(true)}
          className="bg-[#4E709D] text-white px-4 py-2 rounded hover:bg-[#5a88c3]"
        >
          + Add New Alert
        </button>
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
                <div className="absolute top-2 right-2 flex space-x-2 z-10">
                  <button onClick={(e) => { e.stopPropagation(); openEditModal(alert); }} className="bg-yellow-400 px-2 py-1 rounded text-xs">Update</button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(alert._id!); }} className="bg-red-500 text-white px-2 py-1 rounded text-xs">Delete</button>
                </div>
              </div>
              <div className="p-4">
                <h2 className="font-bold text-lg mb-1">{alert.title}</h2>
                <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{new Date(alert.createdAt!).toLocaleDateString()}</span>
                  <span className={`px-2 py-1 rounded ${alert.status === 'active' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>{alert.status}</span>
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

      {modalMode && selectedAlert && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-lg p-6">
            <button className="ml-auto text-gray-500" onClick={closeModal}>✕</button>
            {modalMode === 'view' ? (
              <>
                <h2 className="text-xl font-bold mb-2">{selectedAlert.title}</h2>
                <Image src={selectedAlert.img} alt={selectedAlert.title} width={400} height={200} className="rounded" />
                <p><strong>Description:</strong> {selectedAlert.description}</p>
                <p><strong>Location:</strong> {selectedAlert.location}</p>
                <p><strong>Severity:</strong> {selectedAlert.severity}</p>
                <p><strong>Status:</strong> {selectedAlert.status}</p>
                <p><strong>Date:</strong> {new Date(selectedAlert.createdAt!).toLocaleString()}</p>
              </>
            ) : (
              <form onSubmit={handleEditAlert} className="space-y-4">
                <h2 className="text-xl font-bold">Edit Alert</h2>
                <input name="title" value={updatedAlert.title} onChange={handleUpdateAlertChange} className="w-full border p-2 rounded" />
                <textarea name="description" value={updatedAlert.description} onChange={handleUpdateAlertChange} className="w-full border p-2 rounded" />
                <input name="location" value={updatedAlert.location} onChange={handleUpdateAlertChange} className="w-full border p-2 rounded" />
                <input name="severity" value={updatedAlert.severity} onChange={handleUpdateAlertChange} className="w-full border p-2 rounded" />
                <input type="file" onChange={handleImageUpload} className="w-full border p-2 rounded" />
                <select name="status" value={updatedAlert.status} onChange={handleUpdateAlertChange} className="w-full border p-2 rounded">
                  <option value="active">Active</option>
                  <option value="resolved">Resolved</option>
                </select>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save Changes</button>
              </form>
            )}
          </div>
        </div>
      )}

      {addModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6">
            <button className="ml-auto text-gray-500" onClick={() => setAddModalOpen(false)}>✕</button>
            <AddAlertForm
              onClose={() => setAddModalOpen(false)}
              onSuccess={() => {
                fetch(`/api/admin-alert?page=${page}&limit=20`)
                  .then(res => res.json())
                  .then(data => setAlerts(data.alerts));
              }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
