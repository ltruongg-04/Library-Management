import type { LucideIcon } from "lucide-react";

export type TimeRange = "1m" | "3m" | "6m" | "1y";
export type StatTone = "books" | "available" | "borrowed" | "danger" | "members" | "requests";

export type MonthRangeSelection = {
    startYear: number;
    startMonth: number;
    endYear: number;
    endMonth: number;
};

export type StatCardData = {
    label: string;
    value: string;
    icon: LucideIcon;
    trend?: string;
    tone: StatTone;
};

export type CategoryData = {
    label: string;
    value: number;
    opacity: string;
};

export type BorrowedBookData = {
    title: string;
    author: string;
    borrows: number;
    status: string;
    statusClass: string;
};

export type ActivityData = {
    title: string;
    detail: string;
    time: string;
    color: string;
};

export type TrendData = {
    labels: string[];
    borrowed: number[];
    returned: number[];
    overdue: number[];
};

export type LibraryStatusData = {
    available: number;
    borrowing: number;
    reserved: number;
    maintenance: number;
};

export type InsightsData = {
    borrowChange: string;
    category: string;
    traffic: string;
};

export type AnalyticsRangeData = {
    statCards: StatCardData[];
    trend: TrendData;
    libraryStatus: LibraryStatusData;
    categories: CategoryData[];
    borrowedBooks: BorrowedBookData[];
    recentActivities: ActivityData[];
    insights: InsightsData;
};
