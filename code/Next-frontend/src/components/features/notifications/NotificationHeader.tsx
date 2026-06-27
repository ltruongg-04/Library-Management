"use client";

import { UI_TEXT } from "@/constants/ui-text";

const { NOTIFICATIONS } = UI_TEXT;

interface Props {
    onMarkAllRead: () => void;
}

export default function NotificationHeader({ onMarkAllRead }: Props) {
    return (
        <div className="mb-8 flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold text-ink-950 dark:text-white">{NOTIFICATIONS.HEADER_TITLE}</h1>

                <p className="mt-2 text-ink-500 dark:text-slate-400">{NOTIFICATIONS.HEADER_SUBTITLE}</p>
            </div>

            <button type="button" onClick={onMarkAllRead} className="text-primary-600 font-medium hover:underline">
                {NOTIFICATIONS.MARK_ALL_READ}
            </button>
        </div>
    );
}
