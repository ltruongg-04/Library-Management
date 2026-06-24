"use client";

import Link from "next/link";
import { Notification } from "@/types/notification";

interface Props {
  notification: Notification;
}

export default function NotificationCard({
  notification,
}: Props) {
  return (
    <Link
      href={`/notifications/${notification.id}`}
      className={`
        block
        border
        rounded-lg
        p-4
        mb-4
        transition
        hover:shadow-md
        ${
          !notification.isRead
            ? "bg-blue-50 border-blue-200"
            : "bg-white"
        }
      `}
    >
      <div className="flex justify-between">
        <h3 className="font-semibold">
          {notification.title}
        </h3>

        <span className="text-sm text-gray-500">
          {notification.time}
        </span>
      </div>

      <p className="text-gray-600 mt-2">
        {notification.message}
      </p>
    </Link>
  );
}