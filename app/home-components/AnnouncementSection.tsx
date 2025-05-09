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
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [announcementsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);

    const fetchAnnouncements = async () => {
        try {
            const res = await axios.get("/api/admin-announcement");
            const reversedAnnouncements = res.data.announcements?.reverse() || [];
            setAnnouncements(reversedAnnouncements);
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);


    if (loading) return <div className="p-4">Loading report history...</div>;
    // Pagination logic
    const indexOfLastAnnouncement = currentPage * announcementsPerPage;
    const indexOfFirstAnnouncement = indexOfLastAnnouncement - announcementsPerPage;
    const currentAnnouncements = announcements.slice(indexOfFirstAnnouncement, indexOfLastAnnouncement);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Community Announcements</h1>
            </div>

            {/* Announcement List */}
            <div className="grid gap-4">
                {currentAnnouncements.length > 0 ? (
                    currentAnnouncements.map((a: Announcement) => (
                        <div
                            key={a._id}
                            className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition relative"
                        >
                            <div
                                className="cursor-pointer flex flex-col justify-between h-[100%] w-[100%]"
                                onClick={() => {
                                    setSelectedAnnouncement(a);
                                    setViewModalOpen(true);
                                }}
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
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center">Loading Announcement ...</p>
                )}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-4">
                {Array.from({ length: Math.ceil(announcements.length / announcementsPerPage) }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className="px-3 py-1 mx-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                    >
                        {index + 1}
                    </button>
                ))}
            </div>


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
