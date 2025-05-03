'use client';

import React, { useState } from 'react';

interface Props {
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddAlertForm({ onClose, onSuccess }: Props) {
    const [newAlert, setNewAlert] = useState({
        title: '',
        description: '',
        severity: '',
        location: '',
        status: 'active',
        img: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewAlert(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setNewAlert(prev => ({ ...prev, img: reader.result as string }));
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/alerts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newAlert),
        });
        if (res.ok) {
            onSuccess();
            onClose();
        } else {
            alert('Failed to create alert.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
            <h2 className="text-xl font-bold mb-4">Add New Alert</h2>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Left Column */}
                <div className="w-[30em] flex flex-col gap-5 ">
                    <input
                        name="title"
                        onChange={handleChange}
                        required
                        className="w-full border p-2 rounded"
                        placeholder="Title"
                    />
                    <textarea
                        name="description"
                        onChange={handleChange}
                        required
                        className="w-full border p-2 rounded"
                        placeholder="Description"
                    />
                    <input
                        name="location"
                        onChange={handleChange}
                        required
                        className="w-full border p-2 rounded"
                        placeholder="Location"
                    />
                    <select
                        name="severity"
                        onChange={handleChange}
                        required
                        className="w-full border p-2 rounded"
                        defaultValue=""
                    >
                        <option value="" disabled>Select Severity</option>
                        <option value="Low">Low</option>
                        <option value="Moderate">Moderate</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                    </select>

                    <select
                        name="status"
                        value={newAlert.status}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    >
                        <option value="active">Active</option>
                        <option value="resolved">Resolved</option>
                    </select>
                </div>

                {/* Right Column */}
                <div className="w-[20em]  flex flex-col items-center justify-between gap-4">

                    <div className='w-full'>
                        {/* Hidden file input */}
                        <input
                            type="file"
                            id="imageUpload"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />

                        {/* Clickable image preview box */}
                        <label htmlFor="imageUpload" className="w-full cursor-pointer">
                            <div className="border-2 border-dashed border-gray-400 rounded-md w-full h-48 flex items-center justify-center overflow-hidden bg-gray-50 hover:bg-gray-100">
                                {newAlert.img ? (
                                    <img
                                        src={newAlert.img}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-gray-500">Click to upload image</span>
                                )}
                            </div>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
                    >
                        Submit Alert
                    </button>
                </div>
            </div>
        </form>

    );
}
