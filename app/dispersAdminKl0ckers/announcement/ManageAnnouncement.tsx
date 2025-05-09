"use client";

import { useState, useEffect } from "react";
import axios from "axios";

type FormData = {
    title: string;
    description: string;
    location: string;
    type: "Info" | "Emergency" | "Event";
    img: string;
};

type Announcement = {
    _id: string;
    title: string;
    description: string;
    location: string;
    type: "Info" | "Emergency" | "Event";
    img: string;
    createdAt: string;
};

type Status = {
    message: string;
    isError: boolean;
};

export default function AdminAnnouncementPage() {
    const [showModal, setShowModal] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [form, setForm] = useState<FormData>({
        title: "",
        description: "",
        location: "",
        type: "Info",
        img: "",
    });
    const [status, setStatus] = useState<Status>({ message: "", isError: false });
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [announcementsPerPage] = useState(10);

    const fetchAnnouncements = async () => {
        try {
            const res = await axios.get("/api/announcement");
            const reversedAnnouncements = res.data.announcements?.reverse() || [];
            setAnnouncements(reversedAnnouncements);
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this announcement?")) return;
        try {
            await axios.delete(`/api/admin-announcement/${id}`);
            fetchAnnouncements();
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    const handleUpdate = async (id: string) => {
        setIsLoading(true);
        try {
            const res = await axios.put(`/api/admin-announcement/${id}`, form);
            if (res.status === 200) {
                setStatus({ message: "Announcement updated!", isError: false });
                setForm({ title: "", description: "", location: "", type: "Info", img: "" });
                setShowModal(false);
                fetchAnnouncements();
            } else {
                setStatus({ message: "Failed to update announcement.", isError: true });
            }
        } catch (err) {
            console.error("Update error:", err);
            setStatus({ message: "Server error. Please try again later.", isError: true });
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setStatus({ message: "File too large (max 2MB).", isError: true });
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setForm((prev) => ({ ...prev, img: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus({ message: "", isError: false });

        if (!form.title || !form.description || !form.location || !form.type || !form.img) {
            setStatus({ message: "All fields are required.", isError: true });
            return;
        }

        setIsLoading(true);

        if (selectedAnnouncement) {
            handleUpdate(selectedAnnouncement._id);
        } else {
            try {
                const res = await axios.post("/api/admin-announcement", form);
                if (res.status === 201) {
                    setStatus({ message: "Announcement posted!", isError: false });
                    setForm({ title: "", description: "", location: "", type: "Info", img: "" });
                    setShowModal(false);
                    fetchAnnouncements();
                } else {
                    setStatus({ message: "Failed to post announcement.", isError: true });
                }
            } catch (err) {
                console.error(err);
                setStatus({ message: "Server error. Please try again later.", isError: true });
            } finally {
                setIsLoading(false);
            }
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedAnnouncement(null);
        setForm({ title: "", description: "", location: "", type: "Info", img: "" });
        setStatus({ message: "", isError: false });
    };

    const indexOfLast = currentPage * announcementsPerPage;
    const currentAnnouncements = announcements.slice(indexOfLast - announcementsPerPage, indexOfLast);
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Manage Announcements</h1>
                <button
                    onClick={() => {
                        setSelectedAnnouncement(null);
                        setShowModal(true);
                    }}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700"
                >
                    + Create Announcement
                </button>
            </div>

            {/* Announcements */}
            <div className="grid gap-4">
                {currentAnnouncements.length > 0 ? (
                    currentAnnouncements.map((a) => (
                        <div
                            key={a._id}
                            className="bg-white p-4 rounded-xl shadow relative hover:shadow-lg transition"
                        >
                            <div
                                onClick={() => {
                                    setSelectedAnnouncement(a);
                                    setViewModalOpen(true);
                                }}
                                className="cursor-pointer"
                            >
                                <div className="flex justify-between items-center">
                                    <span className="text-sm bg-green-600 text-white px-3 py-1 rounded-full">
                                        {a.type}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {new Date(a.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <h2 className="text-xl font-semibold text-gray-800 mt-2">{a.title}</h2>
                                <p className="text-gray-600 mt-1">{a.description}</p>
                                <p className="text-sm text-gray-400 mt-1 italic">{a.location}</p>
                            </div>
                            <div className="absolute bottom-2 right-2 flex gap-2">
                                <button
                                    onClick={() => handleDelete(a._id)}
                                    className="bg-red-600 text-white text-sm px-3 py-1 rounded hover:bg-red-700"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedAnnouncement(a);
                                        setForm({ ...a });
                                        setShowModal(true);
                                    }}
                                    className="bg-yellow-600 text-white text-sm px-3 py-1 rounded hover:bg-yellow-700"
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center">No announcements found.</p>
                )}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-4">
                {Array.from({ length: Math.ceil(announcements.length / announcementsPerPage) }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => paginate(i + 1)}
                        className="px-3 py-1 mx-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

            {/* Modal for Create/Update */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
                    <div className="bg-white w-fit p-6 rounded-2xl shadow-xl relative h-[27em] flex flex-col">
                        <button
                            onClick={closeModal}
                            className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
                        >
                            ✕
                        </button>
                        <h2 className="text-xl font-bold mb-4 text-gray-800">
                            {selectedAnnouncement ? "Update Announcement" : "Create Announcement"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4 flex gap-[5em] h-full">
                            {status.message && (
                                <div className={`text-sm ${status.isError ? "text-red-600" : "text-green-600"}`}>
                                    {status.message}
                                </div>
                            )}
                            <div className="flex flex-col justify-around min-w-[25em] h-[100%]">
                                <input
                                    name="title"
                                    placeholder="Title"
                                    value={form.title}
                                    onChange={handleChange}
                                    className="w-full border p-3 rounded-md"
                                />
                                <textarea
                                    name="description"
                                    placeholder="Description"
                                    value={form.description}
                                    onChange={handleChange}
                                    className="w-full border p-3 rounded-md h-24 resize-none"
                                />
                                <input
                                    name="location"
                                    placeholder="Location"
                                    value={form.location}
                                    onChange={handleChange}
                                    className="w-full border p-3 rounded-md"
                                />
                                <select
                                    name="type"
                                    value={form.type}
                                    onChange={handleChange}
                                    className="w-full border p-3 rounded-md"
                                >
                                    <option value="Info">Info</option>
                                    <option value="Emergency">Emergency</option>
                                    <option value="Event">Event</option>
                                </select>
                            </div>
                            <div className="min-w-[25em] h-[100%] flex flex-col justify-between">
                                <label
                                    htmlFor="imgUpload"
                                    className="block w-full h-48 border-2 border-dashed border-gray-300 rounded-md cursor-pointer flex items-center justify-center overflow-hidden"
                                >
                                    {form.img ? (
                                        <img
                                            src={form.img}
                                            alt="Preview"
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <span className="text-gray-400">Click to upload image</span>
                                    )}
                                </label>
                                <input
                                    id="imgUpload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white py-3 rounded-md w-full hover:bg-blue-700"
                                    disabled={isLoading}
                                >
                                    {isLoading
                                        ? "Submitting..."
                                        : selectedAnnouncement
                                        ? "Update Announcement"
                                        : "Post Announcement"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Details Modal */}
            {viewModalOpen && selectedAnnouncement && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
                    <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative">
                        <button
                            onClick={() => setViewModalOpen(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
                        >
                            ✕
                        </button>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">{selectedAnnouncement.title}</h2>
                        <img
                            src={selectedAnnouncement.img}
                            alt="Announcement"
                            className="w-full rounded-lg mb-4 max-h-60 object-cover"
                        />
                        <p className="text-gray-600 mb-2"><strong>Description:</strong> {selectedAnnouncement.description}</p>
                        <p className="text-gray-600 mb-2"><strong>Location:</strong> {selectedAnnouncement.location}</p>
                        <p className="text-gray-600 mb-2"><strong>Type:</strong> {selectedAnnouncement.type}</p>
                        <p className="text-sm text-gray-400">
                            <strong>Date:</strong> {new Date(selectedAnnouncement.createdAt).toLocaleString()}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
