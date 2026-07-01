import { LucideIcon } from "lucide-react";

export type TimeRange = "1m" | "3m" | "6m" | "1y";

export interface MonthRangeSelection {
    startYear: number;
    startMonth: number;
    endYear: number;
    endMonth: number;
}

export interface TrendData {
    labels: string[];
    borrowed: number[];
    returned: number[];
    overdue: number[];
}

export interface StatCardData {
    label: string;
    value: string;
    icon: LucideIcon;
    trend?: string;
    tone: "books" | "available" | "borrowed" | "danger" | "members" | "requests";
}

export interface LibraryStatusData {
    available: number;
    borrowing: number;
    reserved: number;
    maintenance: number;
}

export interface CategoryData {
    label: string;
    value: number;
    opacity: string;
}

export interface BorrowedBookData {
    title: string;
    author: string;
    borrows: number;
    status: string;
    statusClass: string;
}

export interface ActivityData {
    title: string;
    detail: string;
    time: string;
    color: string;
}

export interface InsightsData {
    borrowChange: string;
    category: string;
    traffic: string;
}

export interface AnalyticsData {
    statCards: StatCardData[];
    libraryStatus: LibraryStatusData;
    categories: CategoryData[];
    borrowedBooks: BorrowedBookData[];
    recentActivities: ActivityData[];
    insights: InsightsData;
}
