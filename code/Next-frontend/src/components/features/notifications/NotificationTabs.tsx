"use client";

import { UI_TEXT } from "@/constants/ui-text";

const { TABS } = UI_TEXT.NOTIFICATIONS;

interface Props {
  activeTab: string;
  onChange: (tab: string) => void;
}

export default function NotificationTabs({
  activeTab,
  onChange,
}: Props) {
  const tabs = [
    "ALL",
    "SYSTEM",
    "AI_INSIGHT",
  ];

  return (
    <div className="flex gap-8 border-b mb-8">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={`pb-3 font-medium ${
            activeTab === tab
              ? "border-b-2 border-primary-600 text-primary-600"
              : "text-gray-500"
          }`}
        >
          {tab === "ALL"
            ? TABS.ALL
            : tab === "SYSTEM"
            ? TABS.SYSTEM
            : TABS.AI_INSIGHT}
        </button>
      ))}
    </div>
  );
}