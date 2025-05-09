"use client";

import { useState } from "react";

export default function CreateEvacuationModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    address: "",
    capacity: "",
    contact: "",
    status: "",
    adminId: "", // make sure this is set correctly
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/evacuation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Evacuation center created successfully!");
        onClose();
        setFormData({ name: "", type: "", address: "", capacity: "", contact: "", status: "", adminId: "" });
      } else {
        const error = await res.json();
        alert(error.message || "Failed to create evacuation.");
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred while submitting.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md">
        <h2 className="text-xl font-semibold mb-4">Create Evacuation</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required className="w-full p-2 border rounded" />
          <input name="type" value={formData.type} onChange={handleChange} placeholder="Type" required className="w-full p-2 border rounded" />
          <input name="address" value={formData.address} onChange={handleChange} placeholder="Address" required className="w-full p-2 border rounded" />
          <input name="capacity" value={formData.capacity} onChange={handleChange} placeholder="Capacity" required className="w-full p-2 border rounded" />
          <input name="contact" value={formData.contact} onChange={handleChange} placeholder="Contact" required className="w-full p-2 border rounded" />
          <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded" required>
            <option value="" disabled>Select status</option>
            <option value="Available">Available</option>
            <option value="Full">Full</option>
            <option value="Maintenance">Maintenance</option>
          </select>

          <input name="adminId" value={formData.adminId} onChange={handleChange} placeholder="Admin ID" required className="w-full p-2 border rounded" />
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}
