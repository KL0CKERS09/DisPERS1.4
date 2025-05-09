
import React from 'react';
import NavbarUser from './navbar-component/page';
import './globals.css';
import Footer from './footer/page';
import About from './about/page';
import AnnouncementNotifier from '@/app/home-components/AlertNotificationWatcher';

export default function UserMainLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
          <body
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
