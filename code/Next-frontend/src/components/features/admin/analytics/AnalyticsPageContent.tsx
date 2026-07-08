"use client";
import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, BarChart3, CheckCircle2, ClipboardList, LibraryBig, ShoppingBasket, Users } from "lucide-react";
import AdminBreadcrumb from "@/components/features/admin/AdminBreadcrumb";
import AnalyticsExportControls, { type AnalyticsExportData } from "@/components/features/admin/analytics/AnalyticsExportControls";
import { ANALYTICS_TEXT, getCurrentMonthRange } from "@/constants/admin/analytics";
import { UI_TEXT } from "@/constants/ui-text";
import { ADMIN_UI } from "@/constants/ui-text/admin";
import { type DashboardStats, adminDashboardService } from "@/services/adminDashboard";
import type { AnalyticsData, MonthRangeSelection, TrendData } from "@/types/admin-analytics";
import { MonthRangeControls, formatMonthPickerValue, monthToAbsoluteIndex, normalizeMonthRange } from "./AnalyticsMonthControls";
import { AiInsights, BorrowingTrend, LibraryStatus, MostBorrowedBooks, RecentActivities, StatCard, TopCategories } from "./AnalyticsSections";

const ACTIVITY_COLORS = ["border-blue-500", "border-green-500", "border-red-500", "border-yellow-500", "border-purple-500"];
const MONTH_RANGE_REFRESH_MS = 60_000;

const STATUS_TITLE_MAP: Record<string, string> = {
    PENDING: UI_TEXT.ADMIN_BORROW_MANAGEMENT.TABLE.STATUS_PENDING,
    BORROWED: UI_TEXT.ADMIN_BORROW_MANAGEMENT.TABLE.STATUS_BORROWED,
    RETURNED: UI_TEXT.ADMIN_BORROW_MANAGEMENT.TABLE.STATUS_RETURNED,
    OVERDUE: UI_TEXT.ADMIN_BORROW_MANAGEMENT.TABLE.STATUS_OVERDUE,
    CANCELLED: UI_TEXT.MY_BOOKS_PAGE.CARD.STATUS_CANCELLED,
    READY: UI_TEXT.ADMIN_BORROW_MANAGEMENT.TABLE.STATUS_READY,
};

function areMonthRangesEqual(first: MonthRangeSelection, second: MonthRangeSelection) {
    return (
        first.startYear === second.startYear && first.startMonth === second.startMonth && first.endYear === second.endYear && first.endMonth === second.endMonth
    );
}

function buildAnalyticsFromStats(stats: DashboardStats): AnalyticsData {
    const totalCopies = stats.totalBooks;
    const borrowed = stats.totalBorrowOrders > 0 ? Math.min(stats.totalBorrowOrders, totalCopies) : 0;
    const available = stats.totalAvailableBooks;
    const maxCategoryValue = Math.max(1, ...(stats.categories || []).map((category) => category.value));

    return {
        statCards: [
            { label: ADMIN_UI.ANALYTICS.TOTAL_BOOKS, value: totalCopies.toLocaleString("vi-VN"), icon: LibraryBig, tone: "books", trend: "" },
            { label: ADMIN_UI.ANALYTICS.AVAILABLE_BOOKS, value: available.toLocaleString("vi-VN"), icon: CheckCircle2, tone: "available", trend: "" },
            { label: ADMIN_UI.ANALYTICS.BORROWED_BOOKS, value: borrowed.toLocaleString("vi-VN"), icon: ShoppingBasket, tone: "borrowed", trend: "" },
            { label: ADMIN_UI.ANALYTICS.OVERDUE_BOOKS, value: stats.overdueBooks.toLocaleString("vi-VN"), icon: AlertTriangle, tone: "danger", trend: "" },
            { label: ADMIN_UI.ANALYTICS.READERS, value: stats.totalCustomers.toLocaleString("vi-VN"), icon: Users, tone: "members", trend: "" },
            { label: ADMIN_UI.ANALYTICS.REQUESTS, value: stats.pendingApprovals.toLocaleString("vi-VN"), icon: ClipboardList, tone: "requests", trend: "" },
        ],
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

function buildTrendDataFromStats(monthRange: MonthRangeSelection, stats: DashboardStats | null): TrendData {
    const selected = normalizeMonthRange(monthRange);
    const firstIndex = monthToAbsoluteIndex(selected.startYear, selected.startMonth);
    const lastIndex = monthToAbsoluteIndex(selected.endYear, selected.endMonth);
    const trendLookup = new Map((stats?.monthlyTrends || []).map((point) => [point.month, point]));
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

export default function ThongKePage() {
    const [monthRange, setMonthRange] = useState<MonthRangeSelection>(() => getCurrentMonthRange());
    const [currentMonthRange, setCurrentMonthRange] = useState<MonthRangeSelection>(() => getCurrentMonthRange());
    const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    const normalizedMonthRange = normalizeMonthRange(monthRange);
    const trendData = buildTrendDataFromStats(normalizedMonthRange, dashboardStats);

    const fetchStats = useCallback(async () => {
        try {
            setLoading(true);
            const stats = await adminDashboardService.getStats();
            setDashboardStats(stats);
        } catch {
            // Fallback: keep null
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

    const activeData: AnalyticsData = dashboardStats
        ? buildAnalyticsFromStats(dashboardStats)
        : {
              statCards: [],
              libraryStatus: { available: 0, borrowing: 0, reserved: 0, maintenance: 0 },
              categories: [],
              borrowedBooks: [],
              recentActivities: [],
              insights: { borrowChange: "—", category: "—", traffic: "—" },
          };

    const isCurrentMonthRange =
        monthRange.startYear === currentMonthRange.startYear &&
        monthRange.endYear === currentMonthRange.endYear &&
        monthRange.startMonth === currentMonthRange.startMonth &&
        monthRange.endMonth === currentMonthRange.endMonth;

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
                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    </div>
                ) : (
                    <>
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
                    </>
                )}
            </main>
        </div>
    );
}
