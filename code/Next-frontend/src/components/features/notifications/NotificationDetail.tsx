"use client";

import { Notification } from "@/types/notification";

interface Props {
  notification: Notification;
}

export default function NotificationDetail({
  notification,
}: Props) {
  return (
    <div className="bg-white rounded-xl border p-6">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">
          {notification.title}
        </h1>

        <p className="text-gray-500 mt-2">
          {notification.time}
        </p>
      </div>

      <div className="border-t pt-4">
        <p className="leading-7">
          {notification.message}
        </p>
      </div>
    </div>
  );
}