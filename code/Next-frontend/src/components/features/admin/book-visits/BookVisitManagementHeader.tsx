"use client";

import { CalendarDays } from "lucide-react";
import { ADMIN_BOOK_VISITS } from "@/constants/ui-text/admin";

export default function BookVisitManagementHeader() {
    return (
        <div className="flex items-center justify-between border-y border-surface-container-high bg-white px-8 py-6 dark:border-white/10 dark:bg-zinc-900">
            <div>
                <h1 className="flex items-center gap-2 text-[28px] font-semibold leading-tight text-ink-950 dark:text-white">
                    <CalendarDays size={24} className="text-primary-600 dark:text-primary-400" />
                    {ADMIN_BOOK_VISITS.HEADER.TITLE}
                </h1>
                <p className="mt-1 text-[14px] text-on-surface-variant dark:text-white/60">{ADMIN_BOOK_VISITS.HEADER.DESCRIPTION}</p>
            </div>
        </div>
    );
}
