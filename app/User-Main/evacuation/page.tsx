'use client';

import React, { useEffect, useState } from 'react';

import UserCard from "../current-user/page"

interface EvacuationArea {
  evacuationName: string;
  evacuationType: string;
  evacuationAddress: string;
  evacuationCapacity: number;
  evacuationStatus: string;
  evacuationContact: string;
}

const statusColor = {
  Available: 'text-green-500',
  Full: 'text-red-500',
  Maintenance: 'text-orange-500',
};

export default function EvacuationAreas() {
  const [evacuations, setEvacuations] = useState<EvacuationArea[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/evacuation');
      const data = await res.json();
      setEvacuations(data.evacuations);
    };

    fetchData();
  }, []);

  const filteredEvacuations = evacuations.filter(evac => {
    const matchesSearch = evac.evacuationName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'All' || evac.evacuationStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
        <UserCard/>
        <div className="w-[80%] mx-auto p-4 mt-[5em] min-h-[100vh] my-6 rounded shadow-lg overflow-hidden">
      <div className=" h-full bg-blue-800 text-white px-6 py-4 flex flex-wrap justify-between items-center">
        <h2 className="text-xl font-bold">Evacuation Areas</h2>
        <div className="flex gap-2 mt-2 sm:mt-0">
          <input
            type="text"
            placeholder="Search evacuation areas..."
            className="px-4 py-2 rounded text-white border-1 border-white bg-white/10 focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="px-3 py-1 rounded text-black bg-white focus:outline-none"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Available">Available</option>
            <option value="Full">Full</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      <div className="bg-white p-4">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2">Name</th>
              <th className="text-left px-4 py-2">Type</th>
              <th className="text-left px-4 py-2">Address</th>
              <th className="text-left px-4 py-2">Capacity</th>
              <th className="text-left px-4 py-2">Status</th>
              <th className="text-left px-4 py-2">Contact</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvacuations.map((evac, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-4 py-2">{evac.evacuationName}</td>
                <td className="px-4 py-2">{evac.evacuationType}</td>
                <td className="px-4 py-2">{evac.evacuationAddress}</td>
                <td className="px-4 py-2">{evac.evacuationCapacity}</td>
                <td className={`px-4 py-2 font-medium ${statusColor[evac.evacuationStatus as keyof typeof statusColor] || ''}`}>
                  {evac.evacuationStatus}
                </td>
                <td className="px-4 py-2">{evac.evacuationContact}</td>
              </tr>
            ))}
            {filteredEvacuations.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  No evacuation areas found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
}
