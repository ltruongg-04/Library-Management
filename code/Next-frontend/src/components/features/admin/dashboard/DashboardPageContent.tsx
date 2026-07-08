"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, BookOpen, CheckCircle2, ClipboardList, LibraryBig, RefreshCw, Users } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import AdminBreadcrumb from "@/components/features/admin/AdminBreadcrumb";
import { MonthRangeControls, monthToAbsoluteIndex, normalizeMonthRange } from "@/components/features/admin/analytics/AnalyticsMonthControls";
import {
    AiInsights,
    BorrowingTrend,
    LibraryStatus,
    MostBorrowedBooks,
    RecentActivities,
    TopCategories,
} from "@/components/features/admin/analytics/AnalyticsSections";
import { getCurrentMonthRange } from "@/constants/admin/analytics";
import { UI_TEXT } from "@/constants/ui-text";
import { type DashboardStats, adminDashboardService } from "@/services/adminDashboard";
import type { AnalyticsData, MonthRangeSelection, TrendData } from "@/types/admin-analytics";

type KpiTone = "primary" | "success" | "info" | "danger" | "tertiary" | "warning";

const MONTH_RANGE_REFRESH_MS = 60_000;

interface KpiCardData {
    label: string;
    value: number;
    description: string;
    icon: typeof LibraryBig;
    tone: KpiTone;
}

const toneClasses: Record<KpiTone, { card: string; icon: string; value: string }> = {
    primary: {
        card: "border-primary-100 bg-primary-50/80 dark:border-primary-900/50 dark:bg-primary-900/20",
        icon: "text-primary-700 dark:text-primary-300",
        value: "text-primary-900 dark:text-primary-100",
    },
    success: {
        card: "border-moss-200 bg-moss-50 dark:border-moss-900/60 dark:bg-moss-900/20",
        icon: "text-moss-600 dark:text-moss-300",
        value: "text-moss-900 dark:text-moss-100",
    },
    info: {
        card: "border-info-100 bg-info-50 dark:border-info-900/60 dark:bg-info-900/20",
        icon: "text-info-500 dark:text-info-300",
        value: "text-info-700 dark:text-info-100",
    },
    danger: {
        card: "border-error-100 bg-error-50 dark:border-error-900/60 dark:bg-error-900/20",
        icon: "text-error-500 dark:text-error-300",
        value: "text-error-700 dark:text-error-100",
    },
    tertiary: {
        card: "border-tertiary-300/40 bg-tertiary-300/10 dark:border-tertiary-300/30 dark:bg-tertiary-500/20",
        icon: "text-tertiary-500 dark:text-tertiary-300",
        value: "text-tertiary-500 dark:text-tertiary-300",
    },
    warning: {
        card: "border-warning-200 bg-warning-50 dark:border-warning-900/60 dark:bg-warning-900/20",
        icon: "text-warning-700 dark:text-warning-300",
        value: "text-warning-900 dark:text-warning-100",
    },
};

const ACTIVITY_COLORS = ["border-blue-500", "border-green-500", "border-red-500", "border-yellow-500", "border-purple-500"];

const STATUS_TITLE_MAP: Record<string, string> = {
    PENDING: UI_TEXT.ADMIN_BORROW_MANAGEMENT.TABLE.STATUS_PENDING,
    BORROWED: UI_TEXT.ADMIN_BORROW_MANAGEMENT.TABLE.STATUS_BORROWED,
    RETURNED: UI_TEXT.ADMIN_BORROW_MANAGEMENT.TABLE.STATUS_RETURNED,
    OVERDUE: UI_TEXT.ADMIN_BORROW_MANAGEMENT.TABLE.STATUS_OVERDUE,
    CANCELLED: UI_TEXT.MY_BOOKS_PAGE.CARD.STATUS_CANCELLED,
    READY: UI_TEXT.ADMIN_BORROW_MANAGEMENT.TABLE.STATUS_READY,
};

function formatNumber(value: number) {
    return value.toLocaleString("vi-VN");
}

function areMonthRangesEqual(first: MonthRangeSelection, second: MonthRangeSelection) {
    return (
        first.startYear === second.startYear && first.startMonth === second.startMonth && first.endYear === second.endYear && first.endMonth === second.endMonth
    );
}

function KpiCard({ card }: { card: KpiCardData }) {
    const Icon = card.icon;
    const styles = toneClasses[card.tone];

    return (
        <article
            className={`min-h-[168px] rounded-xl border p-5 shadow-[0_4px_12px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] ${styles.card}`}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <h2 className="text-body-sm font-semibold text-on-surface dark:text-white">{card.label}</h2>
                    <p className="mt-2 text-body-sm leading-5 text-on-surface-variant dark:text-slate-300">{card.description}</p>
                </div>
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/70 shadow-sm dark:bg-slate-950/30 ${styles.icon}`}>
                    <Icon size={20} strokeWidth={1.9} />
                </span>
            </div>
            <p className={`mt-5 font-mono text-[34px] font-semibold leading-none ${styles.value}`}>{formatNumber(card.value)}</p>
        </article>
    );
}

function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-6">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="h-[168px] animate-pulse rounded-xl bg-surface-container-high dark:bg-slate-800" />
                ))}
            </div>
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
                <div className="h-80 animate-pulse rounded-xl bg-surface-container-high dark:bg-slate-800" />
                <div className="h-80 animate-pulse rounded-xl bg-surface-container-high dark:bg-slate-800" />
            </div>
        </div>
    );
}

function AttentionPanel({ stats, portal }: { stats: DashboardStats; portal: string }) {
    const text = UI_TEXT.ADMIN_PAGES.DASHBOARD;
    const availabilityRate = Math.round((stats.totalAvailableBooks / Math.max(stats.totalBooks, 1)) * 100);
    const items = [
        { label: text.ATTENTION_PENDING, value: stats.pendingApprovals, href: `/${portal}/luot-muon`, tone: "text-warning-700 dark:text-warning-300" },
        { label: text.ATTENTION_OVERDUE, value: stats.overdueBooks, href: `/${portal}/luot-muon`, tone: "text-error-600 dark:text-error-300" },
        { label: text.ATTENTION_AVAILABLE, value: availabilityRate, suffix: "%", href: `/${portal}/kho-sach`, tone: "text-moss-600 dark:text-moss-300" },
    ];

    return (
        <section className="rounded-xl border border-outline-variant/25 bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:border-slate-800 dark:bg-slate-900">
            <h2 className="flex items-center gap-2 text-title-md font-semibold text-on-surface dark:text-white">
                <AlertTriangle size={20} className="text-warning-700 dark:text-warning-300" />
                {text.ATTENTION_TITLE}
            </h2>
            <p className="mt-1 text-body-sm text-on-surface-variant dark:text-slate-400">{text.ATTENTION_DESC}</p>
            <div className="mt-5 space-y-3">
                {items.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className="flex items-center justify-between rounded-lg border border-outline-variant/20 bg-surface-container-lowest px-4 py-3 transition-colors hover:bg-surface-container-low dark:border-slate-700 dark:bg-slate-950/30 dark:hover:bg-slate-800"
                    >
                        <span className="text-body-sm font-medium text-on-surface dark:text-white">{item.label}</span>
                        <span className={`font-mono text-xl font-semibold ${item.tone}`}>
                            {formatNumber(item.value)}
                            {item.suffix || ""}
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    );
}

function buildDashboardAnalytics(stats: DashboardStats): AnalyticsData {
    const totalCopies = stats.totalBooks;
    const available = stats.totalAvailableBooks;
    const maxCategoryValue = Math.max(1, ...(stats.categories || []).map((category) => category.value));

    return {
        statCards: [],
        libraryStatus: {
            available: available > 0 ? Math.round((available / Math.max(totalCopies, 1)) * 100) : 0,
            borrowing: totalCopies > 0 ? Math.round(((totalCopies - available) / totalCopies) * 100) : 0,
            reserved: 0,
            maintenance: 0,
        },
        categories: (stats.categories || []).map((category, index) => ({
            label: category.label,
            value: Math.round((category.value / maxCategoryValue) * 100),
            opacity: ["bg-primary", "bg-secondary-container", "bg-tertiary-300", "bg-moss-500", "bg-warning-500"][index % 5],
        })),
        borrowedBooks: (stats.borrowedBooks || []).map((book) => ({
            title: book.title,
            author: book.author || "—",
            borrows: book.borrows,
            status: book.status,
            statusClass: book.status === "Còn sách" ? "bg-secondary-fixed text-on-secondary-fixed" : "bg-error-50 text-error-700",
        })),
        recentActivities: (stats.recentActivities || []).map((activity, index) => ({
            title: STATUS_TITLE_MAP[activity.status] || activity.status,
            detail: `${activity.customerName} - "${activity.bookTitle}" (${activity.orderCode})`,
            time: activity.createdAt,
            color: ACTIVITY_COLORS[index % ACTIVITY_COLORS.length],
        })),
        insights: {
            borrowChange: `${stats.booksBorrowedToday} đơn hôm nay`,
            category: stats.categories?.[0]?.label || "—",
            traffic: stats.borrowedBooks?.[0]?.title || "—",
        },
    };
}

function buildTrendDataFromStats(monthRange: MonthRangeSelection, stats: DashboardStats): TrendData {
    const selected = normalizeMonthRange(monthRange);
    const firstIndex = monthToAbsoluteIndex(selected.startYear, selected.startMonth);
    const lastIndex = monthToAbsoluteIndex(selected.endYear, selected.endMonth);
    const trendLookup = new Map((stats.monthlyTrends || []).map((point) => [point.month, point]));
    const points = Array.from({ length: lastIndex - firstIndex + 1 }, (_, index) => {
        const absoluteIndex = firstIndex + index;
        const year = Math.floor(absoluteIndex / 12);
        const month = (absoluteIndex % 12) + 1;
        return { year, month };
    });

    return {
        labels: points.map((point) => (point.year === selected.startYear ? `Th${point.month}` : `Th${point.month}/${String(point.year).slice(-2)}`)),
        borrowed: points.map((point) => trendLookup.get(`${point.year}-${String(point.month).padStart(2, "0")}`)?.borrowed ?? 0),
        returned: points.map((point) => trendLookup.get(`${point.year}-${String(point.month).padStart(2, "0")}`)?.returned ?? 0),
        overdue: points.map((point) => trendLookup.get(`${point.year}-${String(point.month).padStart(2, "0")}`)?.overdue ?? 0),
    };
}

export default function DashboardPageContent() {
    const text = UI_TEXT.ADMIN_PAGES.DASHBOARD;
    const params = useParams();
    const portal = (params?.portal as string) || "admin";
    const [monthRange, setMonthRange] = useState<MonthRangeSelection>(() => getCurrentMonthRange());
    const [currentMonthRange, setCurrentMonthRange] = useState<MonthRangeSelection>(() => getCurrentMonthRange());
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchStats = useCallback(async () => {
        try {
            setLoading(true);
            setError(false);
            const response = await adminDashboardService.getStats();
            setStats(response);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    useEffect(() => {
        const intervalId = window.setInterval(() => {
            const nextCurrentRange = getCurrentMonthRange();
            setCurrentMonthRange((previousCurrentRange) => {
                if (areMonthRangesEqual(previousCurrentRange, nextCurrentRange)) {
                    return previousCurrentRange;
                }

                setMonthRange((selectedRange) => (areMonthRangesEqual(selectedRange, previousCurrentRange) ? nextCurrentRange : selectedRange));
                return nextCurrentRange;
            });
        }, MONTH_RANGE_REFRESH_MS);

        return () => window.clearInterval(intervalId);
    }, []);

    const kpiCards = useMemo<KpiCardData[]>(() => {
        if (!stats) return [];
        return [
            { label: text.TOTAL_BOOKS, value: stats.totalBooks, description: text.TOTAL_BOOKS_DESC, icon: LibraryBig, tone: "primary" },
            { label: text.AVAILABLE_BOOKS, value: stats.totalAvailableBooks, description: text.AVAILABLE_BOOKS_DESC, icon: CheckCircle2, tone: "success" },
            { label: text.BOOKS_TODAY, value: stats.booksBorrowedToday, description: text.BOOKS_TODAY_DESC, icon: BookOpen, tone: "info" },
            { label: text.OVERDUE_BOOKS, value: stats.overdueBooks, description: text.OVERDUE_BOOKS_DESC, icon: AlertTriangle, tone: "danger" },
            { label: text.READERS, value: stats.totalCustomers, description: text.READERS_DESC, icon: Users, tone: "tertiary" },
            { label: text.PENDING_APPROVAL, value: stats.pendingApprovals, description: text.PENDING_APPROVAL_DESC, icon: ClipboardList, tone: "warning" },
        ];
    }, [stats, text]);

    const normalizedMonthRange = normalizeMonthRange(monthRange);
    const isCurrentMonthRange =
        monthRange.startYear === currentMonthRange.startYear &&
        monthRange.endYear === currentMonthRange.endYear &&
        monthRange.startMonth === currentMonthRange.startMonth &&
        monthRange.endMonth === currentMonthRange.endMonth;
    const analyticsData = stats ? buildDashboardAnalytics(stats) : null;
    const trendData = stats ? buildTrendDataFromStats(normalizedMonthRange, stats) : null;

    return (
        <div className="flex min-h-screen w-full flex-col bg-surface text-on-surface dark:bg-slate-950 dark:text-white">
            <div className="px-8 pb-2 pt-8">
                <AdminBreadcrumb />
            </div>

            <header className="border-y border-surface-container-high bg-white px-8 py-6 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                    <div>
                        <h1 className="flex items-center gap-2 text-[28px] font-semibold leading-tight text-ink-950 dark:text-white">
                            <LibraryBig size={24} className="text-primary-700 dark:text-primary-300" />
                            {text.TITLE}
                        </h1>
                        <p className="mt-1 text-body-sm text-on-surface-variant dark:text-slate-400">{text.DESCRIPTION}</p>
                    </div>
                    <span className="inline-flex w-fit items-center gap-2 rounded-full border border-moss-200 bg-moss-50 px-3 py-1.5 text-body-sm font-medium text-moss-700 dark:border-moss-900/60 dark:bg-moss-900/20 dark:text-moss-200">
                        <span className="h-2 w-2 rounded-full bg-moss-500" />
                        {text.UPDATED_LABEL}
                    </span>
                </div>
            </header>

            <main className="flex-1 space-y-6 p-8">
                {loading ? <DashboardSkeleton /> : null}

                {!loading && error ? (
                    <section className="rounded-xl border border-error-100 bg-error-50 p-8 text-center dark:border-error-900/60 dark:bg-error-900/20">
                        <h2 className="text-title-md font-semibold text-error-700 dark:text-error-100">{text.ERROR_TITLE}</h2>
                        <p className="mt-2 text-body-sm text-on-surface-variant dark:text-slate-300">{text.ERROR_DESC}</p>
                        <button
                            onClick={fetchStats}
                            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary-700 px-4 py-2 text-body-sm font-semibold text-white transition-colors hover:bg-primary-900 dark:bg-primary-500 dark:hover:bg-primary-700"
                        >
                            <RefreshCw size={16} />
                            {text.RETRY}
                        </button>
                    </section>
                ) : null}

                {!loading && !error && stats ? (
                    <>
                        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-6" aria-label={UI_TEXT.ADMIN_ANALYTICS.SUMMARY_LABEL}>
                            {kpiCards.map((card) => (
                                <KpiCard key={card.label} card={card} />
                            ))}
                        </section>

                        <section className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
                            {trendData ? (
                                <BorrowingTrend
                                    trend={trendData}
                                    controls={<MonthRangeControls value={normalizedMonthRange} onChange={setMonthRange} showReset={!isCurrentMonthRange} />}
                                />
                            ) : null}
                            <AttentionPanel stats={stats} portal={portal} />
                        </section>

                        {analyticsData ? (
                            <>
                                <section className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
                                    <LibraryStatus status={analyticsData.libraryStatus} />
                                    <TopCategories categories={analyticsData.categories} />
                                </section>

                                <section className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(420px,1.5fr)_minmax(280px,0.95fr)]">
                                    <MostBorrowedBooks books={analyticsData.borrowedBooks} />
                                    <RecentActivities activities={analyticsData.recentActivities} />
                                </section>

                                <AiInsights insights={analyticsData.insights} />
                            </>
                        ) : null}
                    </>
                ) : null}
            </main>
        </div>
    );
}
