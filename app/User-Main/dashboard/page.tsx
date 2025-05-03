"use client"

import AlertNotificationWatcher from "@/app/home-components/AlertNotificationWatcher";

export default function DashboardPage() {
  return (
    <div>
      <AlertNotificationWatcher /> {/* <== Mounts the watcher */}
      <h1>Welcome to the Dashboard</h1>
      {/* Other dashboard content */}
    </div>
  );
}
