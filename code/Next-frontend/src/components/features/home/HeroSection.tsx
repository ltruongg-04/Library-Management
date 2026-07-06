"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/base/material-icon";
import { UI_TEXT } from "@/constants/ui-text";

export default function HeroSection() {
    const router = useRouter();
    const [query, setQuery] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/sach?keyword=${encodeURIComponent(query.trim())}`);
        } else {
            router.push("/sach");
        }
    };

    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-50/40 via-surface-container-lowest to-secondary-50/20 transition-colors duration-200 dark:from-primary-900/20 dark:via-slate-950 dark:to-slate-900">
            {/* Decorative blobs */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-secondary-300/10 blur-3xl dark:bg-secondary-300/5" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-primary-300/10 blur-3xl dark:bg-primary-700/10" />

            <div className="relative z-10 mx-auto max-w-[1440px] px-4 py-10 lg:px-8 lg:py-14">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-16">
                    {/* Left: Text + Search */}
                    <div className="flex-1">
                        {/* Badge */}
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-secondary-300/40 bg-secondary-300/10 px-3 py-1 dark:border-secondary-300/30 dark:bg-secondary-300/10">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-secondary-300" />
                            <span className="font-mono text-[12px] font-medium uppercase tracking-widest text-secondary-500 dark:text-secondary-300">
                                {UI_TEXT.HOME.LABEL_AI_POWERED}
                            </span>
                        </div>

                        <h1 className="mb-3 font-sans text-[36px] font-bold leading-[1.15] tracking-[-0.02em] text-primary-700 transition-colors duration-200 dark:text-white lg:text-[48px]">
                            {UI_TEXT.HOME.HERO_HEADING}
                        </h1>
                        <p className="mb-6 max-w-lg font-sans text-[16px] leading-[26px] text-on-surface-variant transition-colors duration-200 dark:text-white/70">
                            {UI_TEXT.HOME.HERO_SUBHEADING}
                        </p>

                        {/* Compact Search Bar */}
                        <form onSubmit={handleSearch} className="flex max-w-lg items-center gap-2">
                            <div className="ai-glow relative flex-1 rounded-xl border border-outline/20 bg-surface-container-lowest transition-all duration-200 focus-within:border-secondary-300/60 dark:border-slate-700 dark:bg-slate-900">
                                <div className="flex h-11 items-center px-3">
                                    <MaterialIcon name="auto_awesome" className="mr-2 flex-shrink-0 text-[18px] text-secondary-300" />
                                    <input
                                        className="flex-grow border-none bg-transparent font-sans text-[14px] text-on-surface outline-none placeholder:text-on-surface-variant/50 focus:ring-0 dark:text-white dark:placeholder:text-white/50"
                                        placeholder={UI_TEXT.HOME.SEARCH_PLACEHOLDER}
                                        type="text"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        aria-label="AI semantic search"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="ai-gradient-bg flex h-11 flex-shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl px-4 py-2.5 text-[13px] font-semibold text-white transition-all duration-150 hover:opacity-90 active:scale-[0.98]"
                            >
                                <MaterialIcon name="search" className="text-[16px]" />
                                {UI_TEXT.HOME.SEARCH_BTN}
                            </button>
                        </form>

                        {/* Quick links */}
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            <span className="text-[12px] text-on-surface-variant dark:text-white/50">{UI_TEXT.HOME.TRENDING_LABEL}</span>
                            {UI_TEXT.HOME.HERO_TAGS.map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => router.push(`/sach?keyword=${encodeURIComponent(tag)}`)}
                                    className="rounded-full border border-outline/20 px-3 py-0.5 text-[12px] font-medium text-on-surface-variant transition-colors duration-150 hover:border-secondary-300/60 hover:text-secondary-500 dark:border-slate-700 dark:text-white/60 dark:hover:text-secondary-300"
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Stats cards */}
                    <div className="hidden w-72 flex-shrink-0 flex-col gap-3 lg:flex">
                        <div className="glass-panel rounded-2xl p-5 dark:border-slate-700/50 dark:bg-slate-900/80">
                            <div className="mb-2 flex items-center gap-3">
                                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-700/10 dark:bg-white/10">
                                    <MaterialIcon name="auto_stories" className="text-[20px] text-primary-700 dark:text-white" />
                                </span>
                                <span className="text-[13px] font-medium text-on-surface-variant dark:text-white/70">{UI_TEXT.HOME.STATS_TOTAL_BOOKS}</span>
                            </div>
                            <p className="text-[28px] font-bold leading-none text-primary-700 dark:text-white">10,000+</p>
                            <p className="mt-1 text-[12px] text-on-surface-variant dark:text-white/50">{UI_TEXT.HOME.STATS_TOTAL_DESC}</p>
                        </div>
                        <div className="glass-panel rounded-2xl p-5 dark:border-slate-700/50 dark:bg-slate-900/80">
                            <div className="mb-2 flex items-center gap-3">
                                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary-300/20 dark:bg-white/10">
                                    <MaterialIcon name="psychology" className="text-[20px] text-secondary-500 dark:text-white" />
                                </span>
                                <span className="text-[13px] font-medium text-on-surface-variant dark:text-white/70">{UI_TEXT.HOME.STATS_AI_SEARCH}</span>
                            </div>
                            <p className="text-[28px] font-bold leading-none text-primary-700 dark:text-white">98%</p>
                            <p className="mt-1 text-[12px] text-on-surface-variant dark:text-white/50">{UI_TEXT.HOME.STATS_AI_DESC}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
