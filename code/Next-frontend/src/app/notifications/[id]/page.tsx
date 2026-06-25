"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { UI_TEXT } from "@/constants/ui-text";

const { NOTIFICATIONS } = UI_TEXT;

import NotificationDetail from "@/components/features/notifications/NotificationDetail";
import { useNotifications } from "@/hooks/useNotifications";

export default function NotificationDetailPage() {
  const params = useParams();

  const {
    items,
    markAsRead,
  } = useNotifications();

  const id = Number(params?.id);

  const notification = items.find(
    (item) => item.id === id
  );

  useEffect(() => {
    if (notification && !notification.isRead) {
      markAsRead(id);
    }
  }, [id, notification, markAsRead]);

  if (!notification) {
    return (
      <div className="p-10">
        {NOTIFICATIONS.NO_NOTIFICATIONS}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <NotificationDetail
        notification={notification}
      />
    </div>
  );
}