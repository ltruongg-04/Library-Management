"use client";

import { PublicFooter } from "@/components/layout/PublicFooter";
import { PublicHeader } from "@/components/layout/PublicHeader";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col bg-white text-ink-950 transition-colors duration-200 dark:bg-slate-950 dark:text-white">
            {/* Top Navigation Bar */}
            <PublicHeader />

            {/* Main Content */}
            <main className="flex-grow pt-[80px]">{children}</main>

            <PublicFooter />
        </div>
    );
}
