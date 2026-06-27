"use client";

import { UI_TEXT } from "@/constants/ui-text";

const { TABS } = UI_TEXT.NOTIFICATIONS;

interface Props {
    activeTab: string;
    onChange: (tab: string) => void;
}

export default function NotificationTabs({ activeTab, onChange }: Props) {
    const tabs = ["ALL", "SYSTEM", "AI_INSIGHT"];

    return (
        <div className="mb-8 flex gap-8 border-b border-ink-200 dark:border-slate-800">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    type="button"
                    onClick={() => onChange(tab)}
                    className={`pb-3 font-medium transition-colors ${
                        activeTab === tab
                            ? "border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400 border-b-2"
                            : "border-b-2 border-transparent text-ink-500 hover:text-ink-950 dark:text-slate-400 dark:hover:text-white"
                    }`}
                >
                    {tab === "ALL" ? TABS.ALL : tab === "SYSTEM" ? TABS.SYSTEM : TABS.AI_INSIGHT}
                </button>
            ))}
        </div>
    );
}
