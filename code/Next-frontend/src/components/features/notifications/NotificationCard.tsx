"use client";

import Link from "next/link";
import { Notification } from "@/types/notification";

interface Props {
    notification: Notification;
}

export default function NotificationCard({ notification }: Props) {
    return (
        <Link
            href={`/notifications/${notification.id}`}
            className={`mb-4 block rounded-lg border p-4 transition hover:shadow-md ${
                !notification.isRead
                    ? "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20"
                    : "border-ink-200 bg-white dark:border-slate-800 dark:bg-slate-900"
            } `}
        >
            <div className="flex justify-between">
                <h3 className="font-semibold text-ink-950 dark:text-white">{notification.title}</h3>

                <span className="text-sm text-ink-500 dark:text-slate-400">{notification.time}</span>
            </div>

            <p className="mt-2 text-ink-600 dark:text-slate-300">{notification.message}</p>
        </Link>
    );
}
