"use client";

import { Search, Sparkles, Bell } from "lucide-react";
import { UI_TEXT } from "@/constants/ui-text";

export default function Topbar() {
  return (
    <header className="flex items-start justify-between gap-6 px-8 pt-8">
      <div>
        <h1 className="font-serif text-[28px] font-semibold leading-tight text-ink-950">
          {UI_TEXT.ADMIN_LAYOUT.TOPBAR.HEADING}
        </h1>
        <p className="mt-1 text-[14.5px] text-ink-950/55">
          {UI_TEXT.ADMIN_LAYOUT.TOPBAR.SUBHEADING}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <div className="group relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-950/35"
          />
          <input
            type="text"
            placeholder={UI_TEXT.ADMIN_LAYOUT.TOPBAR.SEARCH_PLACEHOLDER}
            className="focus-ring w-80 rounded-full border border-ink-950/10 bg-white py-2.5 pl-10 pr-16 text-[13.5px] text-ink-950 placeholder:text-ink-950/35 shadow-card transition-shadow focus:shadow-panel"
          />
          <span className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-md bg-brass-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-brass-600">
            <Sparkles size={10} />
            AI
          </span>
        </div>

        <button className="focus-ring relative grid h-10 w-10 place-items-center rounded-full border border-ink-950/10 bg-white text-ink-950/60 shadow-card transition-colors hover:text-ink-950">
          <Bell size={17} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rust-500" />
        </button>

        <kbd className="hidden items-center rounded-md border border-ink-950/10 bg-white px-2 py-1.5 font-mono text-[11px] text-ink-950/40 shadow-card sm:flex">
          ⌘K
        </kbd>
      </div>
    </header>
  );
}
