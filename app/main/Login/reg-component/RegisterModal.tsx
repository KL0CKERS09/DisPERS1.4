"use client";

import { useState } from "react";
import axios from "axios";
import { FaUser } from "react-icons/fa";

export default function RegisterModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    firstName: "",
    middleName: "", // Optional
    lastName: "",
    suffix: "", // Optional
    age: "",
    phone: "",
    address: "",
    email: "",
    username: "",
    password: "",
    role: "", // Role is empty by default
  });

  const [error, setError] = useState({
    email: "",
    phone: "",
    username: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if role is selected
    if (form.role === "") {
      alert("Please select a role.");
      return;
    }

    try {
      setError({
        email: "",
        phone: "",
        username: "",
      });

      const response = await axios.post("/api/register", form);
      alert("Registered successfully!");
      onClose();
    } catch (err: any) {
      if (err.response) {
        const { email, phone, username } = err.response.data;
        setError({
          email: email || "",
          phone: phone || "",
          username: username || "",
        });
      }
      console.error("Registration error:", err);
      alert("Registration failed.");
    }
  };

  return (
    <div className="fixed inset-0 bg-[#333]/30 bg-opacity-50 flex justify-center items-center z-[1000]">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-fit max-w-[800px]  relative scale-[.8]">
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-blue-600 p-4 rounded-full text-white shadow-md">
          <FaUser size={24} />
        </div>
        <h2 className="text-center text-xl font-bold mb-6 tracking-wider mt-4">REGISTER</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Display error for email */}
          {error.email && <div className="text-red-500 text-sm mb-2">{error.email}</div>}
          <div className="flex gap-2">
            <input
              name="firstName"
              placeholder="First Name"
              required
              onChange={handleChange}
              className="flex-1 p-2 rounded-md border"
            />
            <input
              name="middleName"
              placeholder="Middle Name (Optional)"
              onChange={handleChange}
              className="flex-1 p-2 rounded-md border"
            />
            <input
              name="lastName"
              placeholder="Last Name"
              required
              onChange={handleChange}
              className="flex-1 p-2 rounded-md border"
            />
          </div>
          <input
            name="suffix"
            placeholder="Suffix (Optional)"
            onChange={handleChange}
            className="w-full p-2 rounded-md border"
          />
          <input
            name="age"
            placeholder="Age"
            required
            onChange={handleChange}
            className="w-full p-2 rounded-md border"
          />
          {error.phone && <div className="text-red-500 text-sm mb-2">{error.phone}</div>}
          <input
            name="phone"
            placeholder="Phone Number"
            required
            onChange={handleChange}
            className="w-full p-2 rounded-md border"
          />
          {error.address && <div className="text-red-500 text-sm mb-2">{error.address}</div>}
          <input
            name="address"
            placeholder="Address"
            required
            onChange={handleChange}
            className="w-full p-2 rounded-md border"
          />
          {error.email && <div className="text-red-500 text-sm mb-2">{error.email}</div>}
          <input
            name="email"
            placeholder="Email"
            required
            type="email"
            onChange={handleChange}
            className="w-full p-2 rounded-md border"
          />
          {error.username && <div className="text-red-500 text-sm mb-2">{error.username}</div>}
          <input
            name="username"
            placeholder="Username"
            required
            onChange={handleChange}
            className="w-full p-2 rounded-md border"
          />
          <input
            name="password"
            placeholder="Password"
            required
            type="password"
            onChange={handleChange}
            className="w-full p-2 rounded-md border"
          />
          <select
            name="role"
            required
            onChange={handleChange}
            className="w-full p-2 rounded-md border"
          >
            <option value="">Select Role</option>
            <option value="Resident">Resident</option>
            <option value="Official">Official</option>
          </select>
          <div className="flex justify-between items-center mt-4">
            <button
              type="button"
              onClick={onClose}
              className="text-blue-700 text-sm hover:underline"
            >
              Already have an account?
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-full shadow-md hover:bg-blue-700"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
