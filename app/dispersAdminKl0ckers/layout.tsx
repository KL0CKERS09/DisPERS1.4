// app/admin/layout.tsx
import "./global.css";
import React from 'react';
import NavbarAdmin  from "./navbar/page";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (

    <div>
      <NavbarAdmin />
      {children}
    </div>

  );
}
