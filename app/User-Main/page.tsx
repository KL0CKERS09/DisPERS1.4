'use client';

import { useEffect, useState } from 'react';
import { FaFileAlt, FaExclamationTriangle, FaBullhorn } from 'react-icons/fa';

import UserCard from "./current-user/page";
import UserAlert from "./user-home/user-alert/page";
import UserSubmitReport from "./user-home/user-submit-report/page";
import UserAnnouncement from "./user-home/user-announcement/page";

export default function UserHome() {
  const [activeTab, setActiveTab] = useState<'submit' | 'alerts' | 'announcements'>('submit');

  
  

  return (
    <>
      <UserCard />
      <div className="w-[90%] min-h-screen mx-auto flex">
        <div className="w-[20%] mt-20">
          <h1 className="font-bold text-2xl">Navigate To:</h1>
          <ul className="py-5 space-y-2">
            <li
              className={`flex items-center gap-3 py-4 pl-2 rounded-2xl cursor-pointer transition ${
                activeTab === 'submit'
                  ? 'bg-[#F3775C] text-white font-semibold'
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('submit')}
            >
              <FaFileAlt className="text-xl" />
              Submit Report
            </li>
            <li
              className={`flex items-center gap-3 py-4 pl-2 rounded-2xl cursor-pointer transition ${
                activeTab === 'alerts'
                  ? 'bg-[#F3775C] text-white font-semibold'
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('alerts')}
            >
              <FaExclamationTriangle className="text-xl" />
              Alerts
            </li>
            <li
              className={`flex items-center gap-3 py-4 pl-2 rounded-2xl cursor-pointer transition ${
                activeTab === 'announcements'
                  ? 'bg-[#F3775C] text-white font-semibold'
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('announcements')}
            >
              <FaBullhorn className="text-xl" />
              Announcements
            </li>
          </ul>
        </div>

        <div className="w-[80%] mt-10">
          {activeTab === 'submit' && <UserSubmitReport />}
          {activeTab === 'alerts' && <UserAlert />}
          {activeTab === 'announcements' && <UserAnnouncement />}
        </div>
      </div>
    </>
  );
}
