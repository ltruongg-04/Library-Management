"use client";

import { useState } from "react";
import { BarChart3 } from "lucide-react";
import AdminBreadcrumb from "@/components/features/admin/AdminBreadcrumb";
import AnalyticsExportControls, { type AnalyticsExportData } from "@/components/features/admin/AnalyticsExportControls";
import { ANALYTICS_TEXT, CURRENT_MONTH_RANGE } from "@/constants/admin/analytics";
import { analyticsDataByRange } from "@/mocks/adminAnalytics";
import type { MonthRangeSelection } from "@/types/admin-analytics";
import { MonthRangeControls, buildTrendData, formatMonthPickerValue, normalizeMonthRange, timeRangeFromMonthSelection } from "./AnalyticsMonthControls";
import { AiInsights, BorrowingTrend, LibraryStatus, MostBorrowedBooks, RecentActivities, StatCard, TopCategories } from "./AnalyticsSections";

export default function ThongKePage() {
    const [monthRange, setMonthRange] = useState<MonthRangeSelection>(CURRENT_MONTH_RANGE);
    const normalizedMonthRange = normalizeMonthRange(monthRange);
    const activeData = analyticsDataByRange[timeRangeFromMonthSelection(normalizedMonthRange)];
    const trendData = buildTrendData(normalizedMonthRange);
    const isCurrentMonthRange =
        monthRange.startYear === CURRENT_MONTH_RANGE.startYear &&
        monthRange.endYear === CURRENT_MONTH_RANGE.endYear &&
        monthRange.startMonth === CURRENT_MONTH_RANGE.startMonth &&
        monthRange.endMonth === CURRENT_MONTH_RANGE.endMonth;
    const exportData: AnalyticsExportData = {
        periodLabel: `${formatMonthPickerValue(normalizedMonthRange.startYear, normalizedMonthRange.startMonth)} - ${formatMonthPickerValue(
            normalizedMonthRange.endYear,
            normalizedMonthRange.endMonth,
        )}`,
        summary: activeData.statCards,
        trend: trendData,
        libraryStatus: activeData.libraryStatus,
        categories: activeData.categories,
        borrowedBooks: activeData.borrowedBooks,
        recentActivities: activeData.recentActivities,
    };

    return (
        <div className="flex min-h-screen w-full flex-col bg-surface text-on-surface">
            <div className="px-8 pb-2 pt-8">
                <AdminBreadcrumb pageName={ANALYTICS_TEXT.BREADCRUMB_LABEL} />
            </div>

            <div className="flex flex-col justify-between gap-md border-y border-surface-container-high bg-white px-8 py-6 lg:flex-row lg:items-center">
                <div>
                    <h1 className="flex flex-wrap items-center gap-2 text-[28px] font-semibold leading-tight text-ink-950">
                        <BarChart3 size={24} className="text-primary-600" />
                        {ANALYTICS_TEXT.PAGE_TITLE}
                    </h1>
                    <p className="mt-1 text-[14px] text-on-surface-variant">{ANALYTICS_TEXT.PAGE_DESCRIPTION}</p>
                </div>
                <AnalyticsExportControls data={exportData} />
            </div>

            <main className="flex-1 space-y-lg overflow-auto p-8">
                <section className="grid grid-cols-1 gap-md sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6" aria-label={ANALYTICS_TEXT.SUMMARY_LABEL}>
                    {activeData.statCards.map((card) => (
                        <StatCard key={card.label} {...card} />
                    ))}
                </section>

                <section className="grid grid-cols-1 gap-lg xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
                    <BorrowingTrend
                        trend={trendData}
                        controls={<MonthRangeControls value={normalizedMonthRange} onChange={setMonthRange} showReset={!isCurrentMonthRange} />}
                    />
                    <LibraryStatus status={activeData.libraryStatus} />
                </section>

                <section className="grid grid-cols-1 gap-lg xl:grid-cols-[minmax(260px,0.9fr)_minmax(420px,1.9fr)_minmax(280px,0.95fr)]">
                    <TopCategories categories={activeData.categories} />
                    <MostBorrowedBooks books={activeData.borrowedBooks} />
                    <RecentActivities activities={activeData.recentActivities} />
                </section>

                <AiInsights insights={activeData.insights} />
            </main>
        </div>
    );
}
