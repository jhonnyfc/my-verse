"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";

export function LocalReminder() {
  const [permission, setPermission] = useState<NotificationPermission | null>(
    null,
  );

  useEffect(() => {
    if ("Notification" in window) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    if (permission !== "granted") return;

    const checkAndNotify = () => {
      const now = new Date();
      // Notify at 9:00 AM local time
      if (now.getHours() === 9) {
        const lastNotified = localStorage.getItem("lastNotifiedDate");
        const todayStr = now.toDateString();

        if (lastNotified !== todayStr) {
          if (
            "Notification" in window &&
            Notification.permission === "granted"
          ) {
            const notification = new Notification("iVerse", {
              body: "Discover your new verse.",
              icon: "/favicon-96x96.png",
            });

            notification.onclick = () => {
              window.focus();
              notification.close();
            };

            localStorage.setItem("lastNotifiedDate", todayStr);
          }
        }
      }
    };

    // Check immediately and then every 55 minute
    checkAndNotify();
    const interval = setInterval(checkAndNotify, 3300000);

    return () => clearInterval(interval);
  }, [permission]);

  const requestPermission = async () => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notifications.");
      return;
    }
    const result = await Notification.requestPermission();
    setPermission(result);
  };

  // Only show the prompt if it hasn't been asked yet
  if (permission === "default") {
    return (
      <button
        onClick={requestPermission}
        className="fixed top-4 left-4 z-50 flex items-center space-x-2 bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 text-neutral-300 px-4 py-2 rounded-full shadow-lg hover:text-white hover:bg-neutral-800 transition-all text-sm font-medium group"
      >
        <Bell className="w-4 h-4 group-hover:scale-110 transition-transform" />
        <span>Enable Daily Reminder</span>
      </button>
    );
  }

  return null;
}
