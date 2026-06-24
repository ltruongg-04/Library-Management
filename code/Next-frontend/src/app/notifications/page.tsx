"use client";

import { useMemo, useState } from "react";

import NotificationCard from "@/components/features/notifications/NotificationCard";
import NotificationHeader from "@/components/features/notifications/NotificationHeader";
import NotificationTabs from "@/components/features/notifications/NotificationTabs";

import { useNotifications } from "@/hooks/useNotifications";

export default function NotificationsPage() {
  const [activeTab, setActiveTab] =
    useState("ALL");

  const {
    items,
    markAllAsRead,
  } = useNotifications();

  const filteredNotifications =
    useMemo(() => {
      if (activeTab === "ALL") {
        return items;
      }

      return items.filter(
        (item) =>
          item.type === activeTab
      );
    }, [activeTab, items]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <NotificationHeader
        onMarkAllRead={markAllAsRead}
      />

      <NotificationTabs
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div>
        {filteredNotifications.map(
          (notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
            />
          )
        )}
      </div>

      <div className="text-center mt-8">
        <button
          type="button"
          className="text-primary-600 hover:underline"
        >
          Load Older Messages
        </button>
      </div>
    </div>
  );
}