"use client";

import Link from "next/link";
import { UI_TEXT } from "@/constants/ui-text";
import type { Notification } from "@/types/notification";

const { NOTIFICATIONS } = UI_TEXT;

interface Props {
    notifications: Notification[];
    markAsRead: (id: number) => void;
    onClose?: () => void;
}

export default function NotificationDropdown({ notifications, markAsRead, onClose }: Props) {
    const latestNotifications = notifications.slice(0, 5);

    const handleNotificationClick = (id: number) => {
        markAsRead(id);
        onClose?.();
    };

    const handleViewAll = () => {
        onClose?.();
    };

    return (
        <div className="absolute right-0 z-50 mt-3 w-[380px] rounded-xl border bg-white shadow-lg dark:bg-slate-900">
            <div className="border-b p-4 dark:border-slate-800">
                <h3 className="font-semibold text-ink-950 dark:text-white">{NOTIFICATIONS.DROPDOWN_TITLE}</h3>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
                {latestNotifications.map((notification) => (
                    <Link
                        key={notification.id}
                        href={`/notifications/${notification.id}`}
                        onClick={() => handleNotificationClick(notification.id)}
                        className={`block border-b px-4 py-3 hover:bg-ink-50 dark:border-slate-800 dark:hover:bg-slate-800 ${
                            !notification.isRead ? "bg-blue-50 dark:bg-blue-900/20" : ""
                        } `}
                    >
                        <div className="flex justify-between">
                            <h4 className="text-sm font-medium text-ink-950 dark:text-white">{notification.title}</h4>

                            {!notification.isRead && <span className="mt-1 h-2 w-2 rounded-full bg-blue-500" />}
                        </div>

                        <p className="mt-1 line-clamp-2 text-sm text-ink-600 dark:text-slate-300">{notification.message}</p>

                        <span className="text-xs text-ink-500 dark:text-slate-400">{notification.time}</span>
                    </Link>
                ))}
            </div>

            <div className="p-4 text-center">
                <Link href="/notifications" onClick={handleViewAll} className="text-primary-600 font-medium hover:underline">
                    {NOTIFICATIONS.VIEW_ALL}
                </Link>
            </div>
        </div>
    );
}
