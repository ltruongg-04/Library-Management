"use client";

import { UI_TEXT } from "@/constants/ui-text";

const { NOTIFICATIONS } = UI_TEXT;

interface Props {
  onMarkAllRead: () => void;
}

export default function NotificationHeader({
  onMarkAllRead,
}: Props) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold">
          {NOTIFICATIONS.HEADER_TITLE}
        </h1>

        <p className="text-gray-500 mt-2">
          {NOTIFICATIONS.HEADER_SUBTITLE}
        </p>
      </div>

      <button
        type="button"
        onClick={onMarkAllRead}
        className="text-primary-600 font-medium hover:underline"
      >
        {NOTIFICATIONS.MARK_ALL_READ}
      </button>
    </div>
  );
}