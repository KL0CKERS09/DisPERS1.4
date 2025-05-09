"use client";

import { useState } from "react";
import ManageAnnouncement from "./ManageAnnouncement";
import ManageEvacuation from "./ManageEvacuation";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"announcement" | "evacuation">("announcement");

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setActiveTab("announcement")}
          className={`px-6 py-2 rounded-lg text-white font-semibold shadow transition ${
            activeTab === "announcement" ? "bg-blue-600" : "bg-gray-400 hover:bg-gray-500"
          }`}
        >
          Manage Announcements
        </button>
        <button
          onClick={() => setActiveTab("evacuation")}
          className={`px-6 py-2 rounded-lg text-white font-semibold shadow transition ${
            activeTab === "evacuation" ? "bg-green-600" : "bg-gray-400 hover:bg-gray-500"
          }`}
        >
          Manage Evacuations
        </button>
      </div>
      {activeTab === "announcement" ? <ManageAnnouncement /> : <ManageEvacuation />}
    </div>
  );
}
