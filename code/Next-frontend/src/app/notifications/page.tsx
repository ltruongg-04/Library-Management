"use client";

import { useMemo, useState } from "react";
import NotificationCard from "@/components/features/notifications/NotificationCard";
import NotificationHeader from "@/components/features/notifications/NotificationHeader";
import NotificationTabs from "@/components/features/notifications/NotificationTabs";
import { UI_TEXT } from "@/constants/ui-text";
import { useNotifications } from "@/hooks/useNotifications";

const { NOTIFICATIONS } = UI_TEXT;

export default function NotificationsPage() {
    const [activeTab, setActiveTab] = useState("ALL");

    const { items, markAllAsRead } = useNotifications();

    const filteredNotifications = useMemo(() => {
        if (activeTab === "ALL") {
            return items;
        }

        return items.filter((item) => item.type === activeTab);
    }, [activeTab, items]);

    return (
        <div className="mx-auto max-w-5xl px-6 py-10">
            <NotificationHeader onMarkAllRead={markAllAsRead} />

            <NotificationTabs activeTab={activeTab} onChange={setActiveTab} />

            <div>
                {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((notification) => <NotificationCard key={notification.id} notification={notification} />)
                ) : (
                    <div className="rounded-lg border border-ink-200 bg-white px-6 py-10 text-center text-ink-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                        {NOTIFICATIONS.NO_NOTIFICATIONS}
                    </div>
                )}
            </div>

            {filteredNotifications.length > 0 && (
                <div className="mt-8 text-center">
                    <button type="button" className="text-primary-600 dark:text-primary-400 transition-colors hover:underline">
                        {NOTIFICATIONS.LOAD_MORE}
                    </button>
                </div>
            )}
        </div>
    );
}
