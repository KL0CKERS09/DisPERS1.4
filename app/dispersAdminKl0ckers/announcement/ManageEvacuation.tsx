'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CreateEvacuationModal from "./CreateEvacuationModal";

interface EvacuationArea {
  _id: string;
  name: string;
  type: string;
  address: string;
  capacity: number;
  status: string;
  contact: string;
}

const statusColor = {
  Available: 'text-green-500',
  Full: 'text-red-500',
  Maintenance: 'text-orange-500',
};

export default function ManageEvacuation() {
  const [evacuations, setEvacuations] = useState<EvacuationArea[]>([]);
  const [editing, setEditing] = useState<EvacuationArea | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEvacuations();
  }, []);

  const fetchEvacuations = async () => {
    const res = await axios.get('/api/evacuation');
    setEvacuations(Array.isArray(res.data) ? res.data.reverse() : []);
  };

  const handleDelete = async (id: string) => {
    await axios.delete(`/api/evacuation/${id}`);
    fetchEvacuations();
  };

  const handleUpdate = async () => {
    if (!editing) return;
    await axios.put(`/api/evacuation/${editing._id}`, editing);
    setModalOpen(false);
    setEditing(null);
    fetchEvacuations();
  };

  const filteredEvacuations = evacuations.filter(
    evac =>
      evac.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evac.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 w-full">
      <div className='flex justify-between py-5'>
        <h2 className="text-2xl font-bold mb-4">Manage Evacuations</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700"
        >
          + Create Evacuation
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or address"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded shadow-sm"
        />
      </div>

      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left px-4 py-2">Name</th>
            <th className="text-left px-4 py-2">Type</th>
            <th className="text-left px-4 py-2">Address</th>
            <th className="text-left px-4 py-2">Capacity</th>
            <th className="text-left px-4 py-2">Status</th>
            <th className="text-left px-4 py-2">Contact</th>
            <th className="text-left px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEvacuations.map((evac) => (
            <tr key={evac._id} className="border-t">
              <td className="px-4 py-2">{evac.name}</td>
              <td className="px-4 py-2">{evac.type}</td>
              <td className="px-4 py-2">{evac.address}</td>
              <td className="px-4 py-2">{evac.capacity}</td>
              <td className={`px-4 py-2 ${statusColor[evac.status as keyof typeof statusColor]}`}>{evac.status}</td>
              <td className="px-4 py-2">{evac.contact}</td>
              <td className="px-4 py-2 flex gap-2">
                <button
                  className="bg-blue-500 text-white px-4 py-1 rounded"
                  onClick={() => {
                    setEditing(evac);
                    setModalOpen(true);
                  }}
                >Edit</button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(evac._id)}
                >Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {modalOpen && editing && (
        <div className="fixed inset-0 bg-black/30 z-500 bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-xl w-[90%] md:w-[600px]">
            <h3 className="text-xl font-bold mb-4">Edit Evacuation</h3>
            <div className="space-y-2">
              {['name', 'type', 'address', 'capacity', 'status', 'contact'].map((key) =>
                key === 'status' ? (
                  <select
                    key={key}
                    className="w-full px-3 py-2 border rounded"
                    value={(editing as any)[key]}
                    onChange={(e) =>
                      setEditing((prev) =>
                        prev ? { ...prev, [key]: e.target.value } : null
                      )
                    }
                  >
                    <option value="Available">Available</option>
                    <option value="Full">Full</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                ) : (
                  <input
                    key={key}
                    type={key === 'capacity' ? 'number' : 'text'}
                    placeholder={key}
                    className="w-full px-3 py-2 border rounded"
                    value={(editing as any)[key]}
                    onChange={(e) =>
                      setEditing((prev) =>
                        prev
                          ? {
                              ...prev,
                              [key]:
                                key === 'capacity'
                                  ? Number(e.target.value)
                                  : e.target.value,
                            }
                          : null
                      )
                    }
                  />
                )
              )}
            </div>
            <div className="flex justify-end mt-4 gap-2">
              <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setModalOpen(false)}>
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleUpdate}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <CreateEvacuationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
