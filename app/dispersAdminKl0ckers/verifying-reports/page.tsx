'use client';

import { useState } from 'react';
import AnonymousTab from './anonymous-tab/page';
import UserTab from './user-tab/page';

export default function VerifyReports() {
  const [showAnonymousTab, setShowAnonymousTab] = useState(true);

  const toggleTab = () => {
    setShowAnonymousTab(!showAnonymousTab);
  };

  return (
    <div className="p-6">
      <button
        onClick={toggleTab}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        {showAnonymousTab ? 'Switch to User Tab' : 'Switch to Anonymous Tab'}
      </button>

      {showAnonymousTab ? <AnonymousTab /> : <UserTab />}
    </div>
  );
}