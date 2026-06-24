"use client";

import Link from "next/link";
import type { Notification } from "@/types/notification";

interface Props {
  notifications: Notification[];
  markAsRead: (id: number) => void;
  onClose?: () => void;
}

export default function NotificationDropdown({
  notifications,
  markAsRead,
  onClose,
}: Props) {
  const latestNotifications =
    notifications.slice(0, 5);

  const handleNotificationClick = (
    id: number
  ) => {
    markAsRead(id);
    onClose?.();
  };

  const handleViewAll = () => {
    onClose?.();
  };

  return (
    <div
      className="
        absolute
        right-0
        mt-3
        w-[380px]
        bg-white
        dark:bg-slate-900
        border
        rounded-xl
        shadow-lg
        z-50
      "
    >
      <div className="p-4 border-b">
        <h3 className="font-semibold">
          Notifications
        </h3>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {latestNotifications.map(
          (notification) => (
            <Link
              key={notification.id}
              href={`/notifications/${notification.id}`}
              onClick={() =>
                handleNotificationClick(
                  notification.id
                )
              }
              className={`
                block
                px-4
                py-3
                border-b
                hover:bg-gray-50
                dark:hover:bg-slate-800
                ${
                  !notification.isRead
                    ? "bg-blue-50"
                    : ""
                }
              `}
            >
              <div className="flex justify-between">
                <h4 className="font-medium text-sm">
                  {notification.title}
                </h4>

                {!notification.isRead && (
                  <span className="w-2 h-2 rounded-full bg-blue-500 mt-1" />
                )}
              </div>

              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {notification.message}
              </p>

              <span className="text-xs text-gray-400">
                {notification.time}
              </span>
            </Link>
          )
        )}
      </div>

      <div className="p-4 text-center">
        <Link
          href="/notifications"
          onClick={handleViewAll}
          className="
            text-primary-600
            font-medium
            hover:underline
          "
        >
          View all notifications
        </Link>
      </div>
    </div>
  );
}