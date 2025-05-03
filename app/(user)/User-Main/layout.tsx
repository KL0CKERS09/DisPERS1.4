

import React from 'react';
import NavbarUser from './navbar-component/page';
import './globals.css';
import Footer from '@/app/home-components/Footer';
import About from './about/page';
import AnnouncementNotifier from '@/app/home-components/AlertNotificationWatcher';

export default function UserMainLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
          <body
            className={`antialiased bg-[#F5F5F5]`}
          >
            <NavbarUser />
            {children} 
            <hr />
            <AnnouncementNotifier />
            <About/>
            <Footer/>
          </body>
    </html>
  );
}
