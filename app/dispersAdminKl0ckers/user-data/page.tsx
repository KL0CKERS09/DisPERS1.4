'use client';

import React, { useEffect, useState } from 'react';

export interface Entry {
  _id: string;
  firstName: string;
  lastName: string;
  age: number;
  phone: string;
  address: string;
  email: string;
  username: string;
  password: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  profilePicture?: string;
}

const defaultProfilePicture = "/defaultProfile.png";

const ManagementTable: React.FC = () => {
  const [data, setData] = useState<Entry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(''); // 👈 Search state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/admin/user-management');
        const json = await res.json();
        console.log(json);
        setData(json);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const getStatusBadge = (status: string) => {
    let baseClasses = 'px-2 py-0.5 rounded text-xs font-semibold';
    switch (status) {
      case 'pending':
        return <span className={`${baseClasses} bg-gray-300 text-gray-700`}>pending</span>;
      case 'verified':
        return <span className={`${baseClasses} bg-blue-100 text-blue-700`}>verified</span>;
      case 'rejected':
        return <span className={`${baseClasses} bg-red-100 text-red-700`}>rejected</span>;
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-600`}>{status}</span>;
    }
  };

  const openModal = (entry: Entry) => {
    setSelectedEntry(entry);
  };

  const filteredData = data.filter(entry =>
    `${entry.firstName} ${entry.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-[80%] mx-auto overflow-x-auto p-4 bg-white rounded-md shadow-md mt-[5em]">
      <div className='flex justify-between'>
      <h1 className='text-2xl font-bold mb-4'>
        Review Users
      </h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      </div>

      <table className="min-w-full border-collapse border border-gray-300 bg-white rounded-md">
        <thead>
          <tr className="bg-gray-100 text-gray-700 font-semibold">
            <th className="border px-4 py-2 text-left">ID Number</th>
            <th className="border px-4 py-2 text-left">Name</th>
            <th className="border px-4 py-2 text-left">Type</th>
            <th className="border px-4 py-2 text-left">Contact</th>
            <th className="border px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((entry, index) => (
            <tr key={entry._id} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{entry.firstName} {entry.lastName}</td>
              <td className="border px-4 py-2">{entry.role}</td>
              <td className="border px-4 py-2">{entry.phone}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => openModal(entry)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                >
                  Review
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 👤 Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-gray-700/30 bg-opacity-50 flex justify-center items-center z-99">
          <div className="bg-white p-8 rounded-md w-1/3">
            <h2 className="text-xl font-semibold mb-4">User Details</h2>
            <div className="flex justify-center mb-4">
              <img
                src={selectedEntry.profilePicture || defaultProfilePicture}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover"
              />
            </div>
            <div className="mb-4"><strong>Name:</strong> {selectedEntry.firstName} {selectedEntry.lastName}</div>
            <div className="mb-4"><strong>Role:</strong> {selectedEntry.role}</div>
            <div className="mb-4"><strong>Email:</strong> {selectedEntry.email}</div>
            <div className="mb-4"><strong>Phone:</strong> {selectedEntry.phone}</div>
            <div className="mb-4"><strong>Address:</strong> {selectedEntry.address}</div>
            <button
              onClick={() => setSelectedEntry(null)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagementTable;
