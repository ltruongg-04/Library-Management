import NotificationCard from "@/components/features/notifications/NotificationCard";
import NotificationHeader from "@/components/features/notifications/NotificationHeader";
import NotificationTabs from "@/components/features/notifications/NotificationTabs";

import { notifications } from "@/constants/notifications";

export default function NotificationsPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <NotificationHeader />

      <NotificationTabs />

      <div className="mt-6">
        {notifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
          />
        ))}
      </div>

      <div className="text-center mt-8">
        <button className="text-primary-600 font-medium hover:underline">
          Load Older Messages
        </button>
      </div>
    </div>
  );
}