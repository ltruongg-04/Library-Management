"use client";

import { Notification } from "@/types/notification";

interface Props {
    notification: Notification;
}

export default function NotificationDetail({ notification }: Props) {
    return (
        <div className="rounded-xl border border-ink-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4">
                <h1 className="text-3xl font-bold text-ink-950 dark:text-white">{notification.title}</h1>

                <p className="mt-2 text-ink-500 dark:text-slate-400">{notification.time}</p>
            </div>

            <div className="border-t border-ink-200 pt-4 dark:border-slate-800">
                <p className="leading-7 text-ink-700 dark:text-slate-300">{notification.message}</p>
            </div>
        </div>
    );
}
