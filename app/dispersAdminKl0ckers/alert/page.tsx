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
  const [expanded, setExpanded] = useState(false);
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
    fetch('/api/alerts')
      .then((res) => res.json())
      .then((data) => setAlerts([...data.alerts].reverse())) // Show newest first
      .catch(console.error);
  }, []);


  const openViewModal = (alert: Alert) => {
    setSelectedAlert(alert);
    setModalMode('view');
  };

  const openEditModal = (alert: Alert) => {
    setSelectedAlert(alert);
    setUpdatedAlert(alert); // Pre-fill the form with the current alert data
    setModalMode('edit');
  };

  const closeModal = () => {
    setSelectedAlert(null);
    setModalMode(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this alert?')) return;

    try {
      const res = await fetch(`/api/alerts/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete alert');
      setAlerts(alerts.filter((a) => a._id !== id));
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

    const alertToUpdate = { ...updatedAlert, status: updatedAlert.status };

    try {
      const res = await fetch(`/api/alerts/${alertToUpdate._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: alertToUpdate.status,
          img: alertToUpdate.img,
        }),
      });

      if (!res.ok) throw new Error('Failed to update alert');

      const { updated } = await res.json();

      setAlerts((prevAlerts) =>
        prevAlerts.map((alert) =>
          alert._id === updated._id ? updated : alert
        )
      );

      closeModal();
    } catch (err) {
      console.error('Error updating alert:', err);
    }
  };


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUpdatedAlert((prevAlert) => ({
          ...prevAlert,
          img: reader.result as string,
        }));
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

      <ul
        className={`${style.shadowInner} ${expanded ? `h-fit overflow-visible ${style.hideBefore}` : 'max-h-[500px] overflow-hidden'
          } ${style.resizingGrid} gap-5 transition-all duration-300 ease-in-out`}
      >
        {alerts.length > 0 ? (
          alerts.map((alert) => (
            <li
              key={alert._id}
              className={`${style['li-indiv']} max-w-[300px] relative bg-white flex border-1 border-gray-300 flex-col items-center justify-start rounded-xl overflow-hidden hover:scale-[1.05] transition-[500ms] cursor-pointer`}
              onClick={() => openViewModal(alert)}
            >
              <div className="relative w-full bg-blue-400 min-h-[15em] max-h-[15em] overflow-hidden">
                <Image
                  src={alert.img}
                  alt={alert.title}
                  width={300}
                  height={200}
                  className="object-cover h-full w-full"
                />
                <div className="absolute top-2 right-2 flex space-x-2 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(alert);
                    }}
                    className="bg-yellow-400 text-black text-xs px-2 py-1 rounded shadow hover:bg-yellow-500"
                  >
                    Update
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(alert._id!);
                    }}
                    className="bg-red-500 text-white text-xs px-2 py-1 rounded shadow hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="w-[80%] py-5">
                <h1 className="text-black/70 text-xl font-bold min-h-[3em] flex items-center">
                  {alert.title}
                </h1>
                <p className="text-black/70 text-xs min-h-[2em] max-h-[2em] overflow-hidden">{alert.description}</p>
                <hr className="w-full text-black/30 my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-black/40">{new Date(alert.createdAt!).toLocaleDateString()}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded font-semibold ${alert.status === 'active'
                        ? 'bg-red-100 text-red-800'
                        : alert.status === 'resolved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                  >
                    {alert.status}
                  </span>

                </div>
              </div>
            </li>
          ))
        ) : (
          <p className="text-center w-full text-gray-600">No alerts found.</p>
        )}
      </ul>

      <div className="w-full flex justify-center mt-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className={`transition-transform duration-300 flex flex-col items-center ${style.button}`}
        >
          {/* Font Awesome Arrow Icon */}
          {expanded ? (
            <FaChevronUp className={`transition-transform duration-300 ${style.expandBtn}`} size={30} />
          ) : (
            <FaChevronDown className={`transition-transform duration-300 ${style.expandBtn}`} size={30} />
          )}
          <span className="text-gray-600 hover:font-bold">See More</span>
        </button>
      </div>

      {modalMode && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 space-y-4">
            <button className="ml-auto text-gray-500 hover:text-gray-800" onClick={closeModal}>✕</button>

            {modalMode === 'view' && selectedAlert && (
              <>
                <h2 className="text-xl font-bold">{selectedAlert.title}</h2>
                <Image
                  src={selectedAlert.img}
                  alt={selectedAlert.title}
                  width={400}
                  height={200}
                  className="rounded"
                />
                <p><strong>Description:</strong> {selectedAlert.description}</p>
                <p><strong>Location:</strong> {selectedAlert.location}</p>
                <p><strong>Severity:</strong> {selectedAlert.severity}</p>
                <p
                  className={`rounded font-semibold ${selectedAlert.status === 'rctive'
                      ? 'text-red-500'
                      : selectedAlert.status === 'resolved'
                        ? 'text-green-500'
                        : 'text-gray-500'
                    }`}
                >
                  <strong>Status:</strong> {selectedAlert.status}
                </p>


                <p><strong>Date:</strong> {new Date(selectedAlert.createdAt!).toLocaleString()}</p>
              </>
            )}

            {modalMode === 'edit' && selectedAlert && (
              <form onSubmit={handleEditAlert} className="space-y-4">
                <h2 className="text-xl font-bold">Edit Alert</h2>
                <input
                  name="title"
                  value={updatedAlert.title}
                  onChange={handleUpdateAlertChange}
                  required
                  className="w-full border p-2 rounded"
                  placeholder="Title"
                />
                <textarea
                  name="description"
                  value={updatedAlert.description}
                  onChange={handleUpdateAlertChange}
                  required
                  className="w-full border p-2 rounded"
                  placeholder="Description"
                />
                <input
                  name="location"
                  value={updatedAlert.location}
                  onChange={handleUpdateAlertChange}
                  required
                  className="w-full border p-2 rounded"
                  placeholder="Location"
                />
                <input
                  name="severity"
                  value={updatedAlert.severity}
                  onChange={handleUpdateAlertChange}
                  required
                  className="w-full border p-2 rounded"
                  placeholder="Severity"
                />
                <input
                  type="file"
                  onChange={handleImageUpload}
                  className="w-full border p-2 rounded"
                />
                {updatedAlert.img && (
                  <div className="mt-4">
                    <img
                      src={updatedAlert.img}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded"
                    />
                  </div>
                )}
                <select
                  name="status"
                  value={updatedAlert.status}
                  onChange={handleUpdateAlertChange}
                  className="w-full border p-2 rounded"
                >
                  <option value="active">Active</option>
                  <option value="resolved">Resolved</option>
                </select>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </form>
            )}
          </div>
        </div>
      )}
      {addModalOpen && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-1050 px-4">
          <div className="bg-white rounded-xl w-full max-w-[50em] p-6 space-y-4">
            <button className="ml-auto text-gray-500 hover:text-gray-800" onClick={() => setAddModalOpen(false)}>✕</button>
            <AddAlertForm
              onClose={() => setAddModalOpen(false)}
              onSuccess={() => {
                fetch('/api/alerts')
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
