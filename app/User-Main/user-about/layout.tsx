

import React from 'react';
import './globals.css';

import UserCard from "../current-user/page"

export default function UserMainLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
          <body
            className={`antialiased bg-[#F5F5F5]`}
          >
            <UserCard/>
            {children} 
          </body>
    </html>
  );
}
