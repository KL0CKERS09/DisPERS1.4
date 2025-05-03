// app/admin/layout.tsx
import "./global.css";
import React from 'react';
import NavbarAdmin  from "./navbar/page";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
          <body
            className={` antialiased bg-[#F5F5F5]`}
          >
            <NavbarAdmin />
            {children}
          </body>
        </html>
  );
}
