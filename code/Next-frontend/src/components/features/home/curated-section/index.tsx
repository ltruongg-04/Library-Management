"use client";

import { useCallback, useState } from "react";
import { MaterialIcon } from "@/components/base/material-icon";
import { UI_TEXT } from "@/constants/ui-text";
import { useRecommendations } from "@/hooks/useRecommendations";
import { useAuth } from "@/providers/auth";
import { FeaturedCollectionCard, SmallCollectionCard } from "./CuratedCards";
import { FeaturedSkeleton, SmallSkeleton } from "./CuratedSkeletons";
import { GuestCtaBanner } from "./CuratedUI";

export default function CuratedSection() {
    const { isAuthenticated } = useAuth();
    const { collections, loading, error, refresh, dismiss } = useRecommendations();
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        await refresh();
        setRefreshing(false);
    }, [refresh]);

    const featuredCollection = collections[0] ?? null;
    const sideCollections = collections.slice(1);

    return (
        <section className="mx-auto my-8 max-w-[1440px] rounded-2xl bg-surface-container-low px-4 py-10 transition-colors duration-200 dark:bg-slate-900/50 lg:px-8">
            {/* ── Header ── */}
            <div className="mx-auto mb-8 flex max-w-full items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-300/20 text-secondary-300 transition-colors duration-200 dark:bg-white/15 dark:text-white">
                        <MaterialIcon name="psychology" className="text-[22px]" />
                    </span>
                    <div>
                        <h2 className="font-sans text-[24px] font-bold leading-[32px] tracking-tight text-primary-700 transition-colors duration-200 dark:text-white">
                            {UI_TEXT.HOME.CURATED_HEADING}
                        </h2>
                        <p className="font-sans text-[13px] text-on-surface-variant transition-colors duration-200 dark:text-white/60">
                            {isAuthenticated ? UI_TEXT.HOME.CURATED_SUBHEADING : UI_TEXT.HOME.CURATED_SECTION.GUEST_SUBHEADING}
                        </p>
                    </div>
                </div>

                {/* Refresh button — only when authenticated */}
                {isAuthenticated && (
                    <button
                        onClick={handleRefresh}
                        disabled={loading || refreshing}
                        className="flex items-center gap-1.5 rounded-lg border border-outline/20 px-3 py-1.5 text-[12px] font-medium text-on-surface-variant transition-colors duration-200 hover:border-secondary-300/50 hover:text-secondary-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-white/50 dark:hover:text-white"
                        aria-label={UI_TEXT.HOME.CURATED_SECTION.REFRESH_BTN}
                    >
                        <MaterialIcon name="refresh" className={`text-[16px] ${refreshing ? "animate-spin" : ""}`} />
                        {UI_TEXT.HOME.CURATED_SECTION.REFRESH_BTN}
                    </button>
                )}
            </div>

            {/* ── Loading state ── */}
            {loading && !refreshing && (
                <div className="flex flex-col gap-4 lg:flex-row">
                    <div className="w-full lg:w-[55%]">
                        <FeaturedSkeleton />
                    </div>
                    <div className="flex w-full flex-col gap-4 lg:w-[45%]">
                        <SmallSkeleton />
                        <SmallSkeleton />
                    </div>
                </div>
            )}

            {/* ── Loading label ── */}
            {loading && !refreshing && (
                <p className="mt-4 animate-pulse text-center text-[13px] text-on-surface-variant dark:text-white/50">{UI_TEXT.HOME.CURATED_SECTION.LOADING}</p>
            )}

            {/* ── Error state ── */}
            {!loading && error && (
                <div className="flex flex-col items-center gap-3 py-12 text-center">
                    <MaterialIcon name="error_outline" className="text-[40px] text-red-400" />
                    <p className="text-[14px] text-on-surface-variant dark:text-white/60">{UI_TEXT.HOME.CURATED_SECTION.ERROR_LOAD}</p>
                    <button
                        onClick={handleRefresh}
                        className="rounded-lg border border-outline/20 px-4 py-2 text-[13px] font-medium text-on-surface-variant transition-colors hover:border-secondary-300/50 hover:text-secondary-500 dark:border-slate-600 dark:text-white/60 dark:hover:text-white"
                    >
                        {UI_TEXT.HOME.CURATED_SECTION.RETRY}
                    </button>
                </div>
            )}

            {/* ── Content ── */}
            {!loading && !error && collections.length > 0 && (
                <div className="flex flex-col gap-4 lg:flex-row">
                    {/* Featured (left) */}
                    {featuredCollection && (
                        <div className="flex w-full flex-col lg:w-[55%]">
                            <FeaturedCollectionCard collection={featuredCollection} onDismiss={() => dismiss(featuredCollection.id)} />
                        </div>
                    )}

                    {/* Small cards (right column) */}
                    <div className="flex w-full flex-col gap-4 lg:w-[45%]">
                        {sideCollections.map((col, idx) => (
                            <SmallCollectionCard key={col.id} collection={col} onDismiss={() => dismiss(col.id)} delay={idx * 100} />
                        ))}

                        {/* Guest CTA banner below small cards */}
                        {!isAuthenticated && <GuestCtaBanner />}
                    </div>
                </div>
            )}

            {/* ── Empty state after all dismissed ── */}
            {!loading && !error && collections.length === 0 && (
                <div className="flex flex-col items-center gap-4 py-12 text-center">
                    <MaterialIcon name="auto_stories" className="text-[48px] text-on-surface-variant/30 dark:text-white/20" />
                    <p className="text-[14px] text-on-surface-variant dark:text-white/50">{UI_TEXT.HOME.CURATED_SECTION.EMPTY_STATE}</p>
                    <button
                        onClick={handleRefresh}
                        className="ai-gradient-bg rounded-lg px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
                    >
                        {UI_TEXT.HOME.CURATED_SECTION.REFRESH_BTN}
                    </button>
                </div>
            )}
        </section>
    );
}
