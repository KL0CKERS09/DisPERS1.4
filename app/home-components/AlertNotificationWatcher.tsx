"use client";

import { useEffect, useRef } from "react";
import axios from "axios";

export default function AnnouncementNotifier() {
  const lastAnnouncementId = useRef<string | null>(null);
  const lastAlertId = useRef<string | null>(null);

  useEffect(() => {
    // Ask for notification permission
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    const pollAnnouncements = async () => {
      try {
        const res = await axios.get("/api/announcement");
        const announcements = res.data.announcements || [];
        const latest = [...announcements].reverse()[0]; // Reverse before getting the latest

        if (latest && latest._id !== lastAnnouncementId.current) {
          lastAnnouncementId.current = latest._id;

          if (Notification.permission === "granted") {
            new Notification("📢 New Announcement", {
              body: `${latest.title} - ${latest.description}`,
              icon: "/favicon.ico",
            });
          }
        }
      } catch (error) {
        console.error("Polling announcements error:", error);
      }
    };

    const pollAlerts = async () => {
      try {
        const res = await axios.get("/api/alerts");
        const alerts = res.data.announcements || [];
        const latest = [...alerts].reverse()[0]; // Reverse before getting the latest

        if (latest && latest._id !== lastAlertId.current) {
          lastAlertId.current = latest._id;

          if (Notification.permission === "granted") {
            new Notification("🚨 New Alert", {
              body: `${latest.title} - ${latest.description}`,
              icon: "/favicon.ico",
            });
          }
        }
      } catch (error) {
        console.error("Polling alerts error:", error);
      }
    };

    // Initial fetch
    pollAnnouncements();
    pollAlerts();

    // Poll every 10 seconds
    const interval = setInterval(() => {
      pollAnnouncements();
      pollAlerts();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return null;
}
