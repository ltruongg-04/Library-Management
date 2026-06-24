"use client";

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
          Notifications
        </h1>

        <p className="text-gray-500 mt-2">
          Stay updated with your library activity.
        </p>
      </div>

      <button
        type="button"
        onClick={onMarkAllRead}
        className="text-primary-600 font-medium hover:underline"
      >
        Mark all as read
      </button>
    </div>
  );
}