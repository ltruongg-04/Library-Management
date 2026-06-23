"use client";

import Link from "next/link";
import { useState } from "react";
import { notifications } from "@/constants/notifications";

export default function NotificationDropdown() {
  const [tab, setTab] = useState<
    "all" | "unread"
  >("all");

  const filtered =
    tab === "all"
      ? notifications
      : notifications.filter(
          (item) => item.unread
        );

  return (
    <div
      className="
      absolute
      top-12
      right-0
      w-[380px]
      bg-white
      dark:bg-slate-900
      rounded-xl
      border
      shadow-xl
      z-50
    "
    >
      <div className="p-4 border-b">
        <h3 className="font-bold text-lg">
          Notifications
        </h3>

        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setTab("all")}
            className={`px-3 py-1 rounded-full text-sm ${
              tab === "all"
                ? "bg-primary-100 text-primary-700"
                : "bg-gray-100"
            }`}
          >
            Tất cả
          </button>

          <button
            onClick={() => setTab("unread")}
            className={`px-3 py-1 rounded-full text-sm ${
              tab === "unread"
                ? "bg-primary-100 text-primary-700"
                : "bg-gray-100"
            }`}
          >
            Chưa đọc
          </button>
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="
              p-4
              border-b
              hover:bg-gray-50
              cursor-pointer
            "
          >
            <div className="flex justify-between">
              <h4 className="font-medium">
                {item.title}
              </h4>

              {item.unread && (
                <span className="w-3 h-3 rounded-full bg-blue-500" />
              )}
            </div>

            <p className="text-sm text-gray-600 mt-1">
              {item.message}
            </p>

            <p className="text-xs text-gray-400 mt-2">
              {item.date}
            </p>
          </div>
        ))}
      </div>

      <div className="p-3 text-center">
        <Link
          href="/notifications"
          className="text-primary-600 font-medium"
        >
          Xem tất cả thông báo
        </Link>
      </div>
    </div>
  );
}