"use client";

import { useState } from "react";

export default function NotificationTabs() {
  const [active, setActive] = useState("all");

  return (
    <div className="flex gap-6 border-b mb-6">
      <button
        onClick={() => setActive("all")}
        className={`pb-3 ${
          active === "all"
            ? "border-b-2 border-primary-600 text-primary-600"
            : ""
        }`}
      >
        All Messages
      </button>

      <button
        onClick={() => setActive("loan")}
        className={`pb-3 ${
          active === "loan"
            ? "border-b-2 border-primary-600 text-primary-600"
            : ""
        }`}
      >
        Loans & Returns
      </button>

      <button
        onClick={() => setActive("ai")}
        className={`pb-3 ${
          active === "ai"
            ? "border-b-2 border-primary-600 text-primary-600"
            : ""
        }`}
      >
        AI Insights
      </button>
    </div>
  );
}