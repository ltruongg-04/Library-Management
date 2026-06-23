import { Notification } from "@/types/notification";

interface Props {
  notification: Notification;
}

export default function NotificationCard({
  notification,
}: Props) {
  const borderColor = {
    urgent: "border-l-red-500",
    recommendation: "border-l-sky-500",
    normal: "border-l-gray-300",
  };

  return (
    <div
      className={`
        bg-white dark:bg-slate-900
        border
        border-l-4
        rounded-lg
        p-5
        mb-4
        shadow-sm
        ${borderColor[notification.type]}
      `}
    >
      <div className="flex justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">
              {notification.title}
            </h3>

            {notification.badge && (
              <span
                className="
                px-2
                py-1
                text-xs
                rounded-full
                bg-primary-100
                text-primary-700
              "
              >
                {notification.badge}
              </span>
            )}
          </div>

          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {notification.message}
          </p>
        </div>

        <div className="flex items-start gap-3">
          {notification.unread && (
            <span className="w-3 h-3 rounded-full bg-blue-500 mt-2" />
          )}

          <span className="text-sm text-gray-400">
            {notification.date}
          </span>
        </div>
      </div>
    </div>
  );
}