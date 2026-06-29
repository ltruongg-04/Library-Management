"use client";

import { useState } from "react";
import {
    AlertTriangle,
    BarChart3,
    CalendarDays,
    CheckCircle2,
    ClipboardList,
    LibraryBig,
    LucideIcon,
    ShoppingBasket,
    Sparkles,
    TrendingUp,
    Users,
    X,
} from "lucide-react";
import AdminBreadcrumb from "@/components/features/admin/AdminBreadcrumb";
import AnalyticsExportControls, { type AnalyticsExportData } from "@/components/features/admin/AnalyticsExportControls";

const ANALYTICS_TEXT = {
    TREND_TITLE: "Xu hướng mượn sách",
    TREND_BORROWED: "Đã mượn",
    TREND_RETURNED: "Đã trả",
    TREND_OVERDUE: "Quá hạn",
    MONTHS: ["Th1", "Th2", "Th3", "Th4", "Th5", "Th6"],
    STATUS_TITLE: "Trạng thái thư viện",
    STATUS_CAPACITY: "Công suất",
    STATUS_AVAILABLE: "Có sẵn (70%)",
    STATUS_BORROWING: "Đang mượn (15%)",
    STATUS_RESERVED: "Đã đặt (10%)",
    STATUS_MAINTENANCE: "Bảo trì (5%)",
    STATUS_AVAILABLE_LABEL: "Có sẵn",
    STATUS_BORROWING_LABEL: "Đang mượn",
    STATUS_RESERVED_LABEL: "Đã đặt",
    STATUS_MAINTENANCE_LABEL: "Bảo trì",
    CATEGORIES_TITLE: "Thể loại nổi bật",
    MOST_BORROWED_TITLE: "Sách được mượn nhiều",
    TABLE_BOOK: "Sách",
    TABLE_TITLE_AUTHOR: "Tựa sách & Tác giả",
    TABLE_BORROWS: "Lượt mượn",
    TABLE_STATUS: "Trạng thái",
    ACTIVITIES_TITLE: "Hoạt động gần đây",
    AI_TITLE: "Gợi ý AI",
    AI_BADGE: "THỜI GIAN THỰC",
    AI_BORROW_PREFIX: "Lượt mượn tăng ",
    AI_BORROW_VALUE: "18%",
    AI_BORROW_SUFFIX: " trong tuần này so với tuần trước.",
    AI_SCIENCE_PREFIX: "Nhóm sách ",
    AI_SCIENCE_VALUE: "Khoa học",
    AI_SCIENCE_SUFFIX: " có thể cần bổ sung thêm bản sao dựa trên tốc độ mượn.",
    AI_TRAFFIC_PREFIX: "Lượng truy cập thư viện thường đạt đỉnh trong khung ",
    AI_TRAFFIC_VALUE: "14:00-16:00",
    AI_TRAFFIC_SUFFIX: ".",
    PAGE_TITLE: "Tổng quan thống kê",
    PAGE_DESCRIPTION: "Theo dõi tình hình mượn trả, tồn kho, thành viên và các cảnh báo vận hành của thư viện.",
    BREADCRUMB_LABEL: "Thống kê",
    REPORT_DATE: "24/10/2023",
    TIME_RANGE_LABEL: "Khoảng thời gian thống kê",
    TIME_RANGE_1_MONTH: "1 tháng",
    TIME_RANGE_3_MONTHS: "3 tháng",
    TIME_RANGE_6_MONTHS: "6 tháng",
    TIME_RANGE_1_YEAR: "1 năm",
    CALENDAR_FROM_LABEL: "Từ:",
    CALENDAR_TO_LABEL: "Đến:",
    CALENDAR_RESET_LABEL: "Về hiện tại",
    SUMMARY_LABEL: "Tổng hợp thống kê",
    TREND_ARIA: "Xu hướng mượn sách từ tháng 1 đến tháng 6",
    STATUS_ARIA: "Biểu đồ công suất thư viện",
};

type TimeRange = "1m" | "3m" | "6m" | "1y";
type StatTone = "books" | "available" | "borrowed" | "danger" | "members" | "requests";

type MonthRangeSelection = {
    year: number;
    startMonth: number;
    endMonth: number;
};

type StatCardData = {
    label: string;
    value: string;
    icon: LucideIcon;
    trend?: string;
    tone: StatTone;
};

type CategoryData = {
    label: string;
    value: number;
    opacity: string;
};

type BorrowedBookData = {
    title: string;
    author: string;
    borrows: number;
    status: string;
    statusClass: string;
};

type ActivityData = {
    title: string;
    detail: string;
    time: string;
    color: string;
};

type TrendData = {
    labels: string[];
    borrowed: number[];
    returned: number[];
    overdue: number[];
};

type LibraryStatusData = {
    available: number;
    borrowing: number;
    reserved: number;
    maintenance: number;
};

type InsightsData = {
    borrowChange: string;
    category: string;
    traffic: string;
};

type AnalyticsRangeData = {
    statCards: StatCardData[];
    trend: TrendData;
    libraryStatus: LibraryStatusData;
    categories: CategoryData[];
    borrowedBooks: BorrowedBookData[];
    recentActivities: ActivityData[];
    insights: InsightsData;
};

const CURRENT_MONTH_RANGE: MonthRangeSelection = {
    year: 2026,
    startMonth: 5,
    endMonth: 6,
};

const MONTH_PICKER_OPTIONS = [
    { value: 1, label: "Th1" },
    { value: 2, label: "Th2" },
    { value: 3, label: "Th3" },
    { value: 4, label: "Th4" },
    { value: 5, label: "Th5" },
    { value: 6, label: "Th6" },
    { value: 7, label: "Th7" },
    { value: 8, label: "Th8" },
    { value: 9, label: "Th9" },
    { value: 10, label: "Th10" },
    { value: 11, label: "Th11" },
    { value: 12, label: "Th12" },
] as const;

const YEAR_PICKER_OPTIONS = [2022, 2023, 2024, 2025, 2026] as const;

const statusClass = {
    available: "bg-secondary-fixed text-on-secondary-fixed",
    reserved: "bg-surface-variant text-on-surface-variant",
    borrowing: "bg-primary-fixed text-on-primary-fixed",
};

const bookSeeds = [
    {
        title: "Code Sạch",
        author: "Robert C. Martin",
        status: "Có sẵn",
        statusClass: statusClass.available,
        borrows: { "1m": 72, "3m": 186, "6m": 342, "1y": 728 },
    },
    {
        title: "Thiết Kế Vạn Vật",
        author: "Don Norman",
        status: "Đã đặt",
        statusClass: statusClass.reserved,
        borrows: { "1m": 61, "3m": 158, "6m": 289, "1y": 604 },
    },
    {
        title: "Lược Sử Loài Người",
        author: "Yuval Noah Harari",
        status: "Đang mượn",
        statusClass: statusClass.borrowing,
        borrows: { "1m": 52, "3m": 129, "6m": 210, "1y": 486 },
    },
    {
        title: "Nhà Giả Kim",
        author: "Paulo Coelho",
        status: "Có sẵn",
        statusClass: statusClass.available,
        borrows: { "1m": 48, "3m": 121, "6m": 198, "1y": 451 },
    },
    {
        title: "Đắc Nhân Tâm",
        author: "Dale Carnegie",
        status: "Đang mượn",
        statusClass: statusClass.borrowing,
        borrows: { "1m": 44, "3m": 112, "6m": 187, "1y": 438 },
    },
    {
        title: "Tư Duy Nhanh Và Chậm",
        author: "Daniel Kahneman",
        status: "Đã đặt",
        statusClass: statusClass.reserved,
        borrows: { "1m": 39, "3m": 104, "6m": 176, "1y": 399 },
    },
    {
        title: "Atomic Habits",
        author: "James Clear",
        status: "Có sẵn",
        statusClass: statusClass.available,
        borrows: { "1m": 57, "3m": 118, "6m": 164, "1y": 372 },
    },
    { title: "Dune", author: "Frank Herbert", status: "Đang mượn", statusClass: statusClass.borrowing, borrows: { "1m": 33, "3m": 92, "6m": 153, "1y": 341 } },
    {
        title: "Không Gia Đình",
        author: "Hector Malot",
        status: "Có sẵn",
        statusClass: statusClass.available,
        borrows: { "1m": 29, "3m": 86, "6m": 141, "1y": 318 },
    },
    {
        title: "Tuổi Trẻ Đáng Giá Bao Nhiêu",
        author: "Rosie Nguyễn",
        status: "Đã đặt",
        statusClass: statusClass.reserved,
        borrows: { "1m": 26, "3m": 78, "6m": 132, "1y": 295 },
    },
] satisfies Array<Omit<BorrowedBookData, "borrows"> & { borrows: Record<TimeRange, number> }>;

function booksForRange(range: TimeRange): BorrowedBookData[] {
    return bookSeeds
        .map((book) => ({
            title: book.title,
            author: book.author,
            borrows: book.borrows[range],
            status: book.status,
            statusClass: book.statusClass,
        }))
        .sort((a, b) => b.borrows - a.borrows);
}

const analyticsDataByRange = {
    "1m": {
        statCards: [
            { label: "Tổng số sách", value: "28,640", icon: LibraryBig, trend: "0.8%", tone: "books" },
            { label: "Sách có sẵn", value: "23,482", icon: CheckCircle2, tone: "available" },
            { label: "Sách đang mượn", value: "4,301", icon: ShoppingBasket, tone: "borrowed" },
            { label: "Sách quá hạn", value: "86", icon: AlertTriangle, tone: "danger" },
            { label: "Thành viên hoạt động", value: "1,240", icon: Users, tone: "members" },
            { label: "Yêu cầu hôm nay", value: "47", icon: ClipboardList, tone: "requests" },
        ],
        trend: {
            labels: ["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4"],
            borrowed: [72, 88, 104, 121],
            returned: [58, 69, 81, 97],
            overdue: [10, 12, 14, 18],
        },
        libraryStatus: { available: 73, borrowing: 12, reserved: 10, maintenance: 5 },
        categories: [
            { label: "Công nghệ", value: 78, opacity: "bg-primary" },
            { label: "Văn học", value: 70, opacity: "bg-primary/80" },
            { label: "Kinh doanh", value: 48, opacity: "bg-primary/60" },
            { label: "Khoa học", value: 42, opacity: "bg-primary/40" },
            { label: "Thiếu nhi", value: 24, opacity: "bg-primary/25" },
        ],
        borrowedBooks: booksForRange("1m"),
        recentActivities: [
            { title: "Mượn sách", detail: "Nguyễn Văn An đã mượn '1984'", time: "2 phút trước", color: "border-primary" },
            { title: "Trả sách", detail: "Lê Hoàng đã trả 'Nhà Giả Kim'", time: "24 phút trước", color: "border-green-500" },
            { title: "Đăng ký mới", detail: "Trần Minh Anh vừa tham gia", time: "51 phút trước", color: "border-secondary-container" },
            { title: "Nhắc quá hạn", detail: "Đã gửi thông báo đến 2 thành viên", time: "1 giờ trước", color: "border-error" },
            { title: "Đặt mượn sách", detail: "Độc giả đặt trước 'Atomic Habits'", time: "2 giờ trước", color: "border-primary" },
            { title: "Gia hạn lượt mượn", detail: "Phạm Linh gia hạn thêm 7 ngày", time: "3 giờ trước", color: "border-secondary-container" },
            { title: "Thêm sách mới", detail: "Kho sách thêm 4 bản sao mới", time: "5 giờ trước", color: "border-primary" },
            { title: "Bảo trì bản sao", detail: "1 bản sao được chuyển sang bảo trì", time: "7 giờ trước", color: "border-error" },
            { title: "Cập nhật hồ sơ", detail: "Mai Anh cập nhật thông tin liên hệ", time: "9 giờ trước", color: "border-secondary-container" },
            { title: "Hoàn tất yêu cầu", detail: "3 yêu cầu mượn đã được xử lý", time: "11 giờ trước", color: "border-green-500" },
        ],
        insights: { borrowChange: "8%", category: "Văn học", traffic: "09:00-11:00" },
    },
    "3m": {
        statCards: [
            { label: "Tổng số sách", value: "28,590", icon: LibraryBig, trend: "2.4%", tone: "books" },
            { label: "Sách có sẵn", value: "23,376", icon: CheckCircle2, tone: "available" },
            { label: "Sách đang mượn", value: "4,824", icon: ShoppingBasket, tone: "borrowed" },
            { label: "Sách quá hạn", value: "104", icon: AlertTriangle, tone: "danger" },
            { label: "Thành viên hoạt động", value: "2,860", icon: Users, tone: "members" },
            { label: "Yêu cầu hôm nay", value: "58", icon: ClipboardList, tone: "requests" },
        ],
        trend: {
            labels: ["Th8", "Th9", "Th10"],
            borrowed: [232, 286, 341],
            returned: [188, 226, 274],
            overdue: [26, 31, 38],
        },
        libraryStatus: { available: 72, borrowing: 13, reserved: 10, maintenance: 5 },
        categories: [
            { label: "Công nghệ", value: 82, opacity: "bg-primary" },
            { label: "Văn học", value: 68, opacity: "bg-primary/80" },
            { label: "Kinh doanh", value: 52, opacity: "bg-primary/60" },
            { label: "Khoa học", value: 39, opacity: "bg-primary/40" },
            { label: "Thiếu nhi", value: 22, opacity: "bg-primary/25" },
        ],
        borrowedBooks: booksForRange("3m"),
        recentActivities: [
            { title: "Mượn sách", detail: "Nguyễn Văn An đã mượn '1984'", time: "2 phút trước", color: "border-primary" },
            { title: "Đăng ký mới", detail: "Trần Minh Anh vừa tham gia", time: "15 phút trước", color: "border-secondary-container" },
            { title: "Trả sách", detail: "Lê Hoàng đã trả 'Nhà Giả Kim'", time: "42 phút trước", color: "border-green-500" },
            { title: "Nhắc quá hạn", detail: "Đã gửi thông báo đến 3 thành viên", time: "1 giờ trước", color: "border-error" },
            { title: "Gia hạn lượt mượn", detail: "Phạm Linh gia hạn thêm 7 ngày", time: "3 giờ trước", color: "border-secondary-container" },
            { title: "Thêm sách mới", detail: "Kho sách thêm 8 bản sao mới", time: "4 giờ trước", color: "border-primary" },
            { title: "Cập nhật hồ sơ", detail: "Mai Anh cập nhật thông tin liên hệ", time: "5 giờ trước", color: "border-secondary-container" },
            { title: "Đặt mượn sách", detail: "Độc giả đặt trước 'Atomic Habits'", time: "6 giờ trước", color: "border-primary" },
            { title: "Bảo trì bản sao", detail: "2 bản sao được chuyển sang bảo trì", time: "8 giờ trước", color: "border-error" },
            { title: "Hoàn tất yêu cầu", detail: "5 yêu cầu mượn đã được xử lý", time: "10 giờ trước", color: "border-green-500" },
        ],
        insights: { borrowChange: "12%", category: "Công nghệ", traffic: "10:00-12:00" },
    },
    "6m": {
        statCards: [
            { label: "Tổng số sách", value: "28,540", icon: LibraryBig, trend: "5.8%", tone: "books" },
            { label: "Sách có sẵn", value: "23,184", icon: CheckCircle2, tone: "available" },
            { label: "Sách đang mượn", value: "5,356", icon: ShoppingBasket, tone: "borrowed" },
            { label: "Sách quá hạn", value: "142", icon: AlertTriangle, tone: "danger" },
            { label: "Thành viên hoạt động", value: "4,285", icon: Users, tone: "members" },
            { label: "Yêu cầu hôm nay", value: "73", icon: ClipboardList, tone: "requests" },
        ],
        trend: {
            labels: ["Th5", "Th6", "Th7", "Th8", "Th9", "Th10"],
            borrowed: [248, 286, 278, 314, 386, 452],
            returned: [194, 221, 215, 254, 319, 368],
            overdue: [28, 31, 36, 42, 51, 66],
        },
        libraryStatus: { available: 70, borrowing: 15, reserved: 10, maintenance: 5 },
        categories: [
            { label: "Công nghệ", value: 85, opacity: "bg-primary" },
            { label: "Văn học", value: 65, opacity: "bg-primary/80" },
            { label: "Kinh doanh", value: 50, opacity: "bg-primary/60" },
            { label: "Khoa học", value: 35, opacity: "bg-primary/40" },
            { label: "Thiếu nhi", value: 20, opacity: "bg-primary/25" },
        ],
        borrowedBooks: booksForRange("6m"),
        recentActivities: [
            { title: "Mượn sách", detail: "Nguyễn Văn An đã mượn '1984'", time: "2 phút trước", color: "border-primary" },
            { title: "Đăng ký mới", detail: "Trần Minh Anh vừa tham gia", time: "15 phút trước", color: "border-secondary-container" },
            { title: "Nhắc quá hạn", detail: "Đã gửi thông báo đến 3 thành viên", time: "1 giờ trước", color: "border-error" },
            { title: "Trả sách", detail: "Lê Hoàng đã trả 'Nhà Giả Kim'", time: "2 giờ trước", color: "border-green-500" },
            { title: "Gia hạn lượt mượn", detail: "Phạm Linh gia hạn thêm 7 ngày", time: "3 giờ trước", color: "border-secondary-container" },
            { title: "Thêm sách mới", detail: "Kho sách thêm 12 bản sao mới", time: "4 giờ trước", color: "border-primary" },
            { title: "Cập nhật hồ sơ", detail: "Mai Anh cập nhật thông tin liên hệ", time: "5 giờ trước", color: "border-secondary-container" },
            { title: "Đặt mượn sách", detail: "Độc giả đặt trước 'Atomic Habits'", time: "6 giờ trước", color: "border-primary" },
            { title: "Bảo trì bản sao", detail: "2 bản sao được chuyển sang bảo trì", time: "8 giờ trước", color: "border-error" },
            { title: "Hoàn tất yêu cầu", detail: "5 yêu cầu mượn đã được xử lý", time: "10 giờ trước", color: "border-green-500" },
        ],
        insights: { borrowChange: "18%", category: "Khoa học", traffic: "14:00-16:00" },
    },
    "1y": {
        statCards: [
            { label: "Tổng số sách", value: "29,120", icon: LibraryBig, trend: "9.6%", tone: "books" },
            { label: "Sách có sẵn", value: "23,062", icon: CheckCircle2, tone: "available" },
            { label: "Sách đang mượn", value: "6,184", icon: ShoppingBasket, tone: "borrowed" },
            { label: "Sách quá hạn", value: "188", icon: AlertTriangle, tone: "danger" },
            { label: "Thành viên hoạt động", value: "7,920", icon: Users, tone: "members" },
            { label: "Yêu cầu hôm nay", value: "96", icon: ClipboardList, tone: "requests" },
        ],
        trend: {
            labels: ["Th1", "Th2", "Th3", "Th4", "Th5", "Th6", "Th7", "Th8", "Th9", "Th10", "Th11", "Th12"],
            borrowed: [218, 236, 259, 301, 326, 355, 392, 431, 468, 512, 548, 590],
            returned: [176, 189, 208, 244, 265, 288, 318, 354, 389, 425, 458, 497],
            overdue: [24, 26, 29, 34, 38, 42, 47, 53, 61, 68, 73, 79],
        },
        libraryStatus: { available: 68, borrowing: 17, reserved: 10, maintenance: 5 },
        categories: [
            { label: "Công nghệ", value: 88, opacity: "bg-primary" },
            { label: "Văn học", value: 72, opacity: "bg-primary/80" },
            { label: "Kinh doanh", value: 58, opacity: "bg-primary/60" },
            { label: "Khoa học", value: 46, opacity: "bg-primary/40" },
            { label: "Thiếu nhi", value: 31, opacity: "bg-primary/25" },
        ],
        borrowedBooks: booksForRange("1y"),
        recentActivities: [
            { title: "Mượn sách", detail: "Nguyễn Văn An đã mượn '1984'", time: "2 phút trước", color: "border-primary" },
            { title: "Trả sách", detail: "Lê Hoàng đã trả 'Nhà Giả Kim'", time: "18 phút trước", color: "border-green-500" },
            { title: "Đăng ký mới", detail: "Trần Minh Anh vừa tham gia", time: "31 phút trước", color: "border-secondary-container" },
            { title: "Nhắc quá hạn", detail: "Đã gửi thông báo đến 5 thành viên", time: "1 giờ trước", color: "border-error" },
            { title: "Thêm sách mới", detail: "Kho sách thêm 18 bản sao mới", time: "3 giờ trước", color: "border-primary" },
            { title: "Gia hạn lượt mượn", detail: "Phạm Linh gia hạn thêm 7 ngày", time: "4 giờ trước", color: "border-secondary-container" },
            { title: "Cập nhật hồ sơ", detail: "Mai Anh cập nhật thông tin liên hệ", time: "5 giờ trước", color: "border-secondary-container" },
            { title: "Đặt mượn sách", detail: "Độc giả đặt trước 'Atomic Habits'", time: "6 giờ trước", color: "border-primary" },
            { title: "Bảo trì bản sao", detail: "4 bản sao được chuyển sang bảo trì", time: "8 giờ trước", color: "border-error" },
            { title: "Hoàn tất yêu cầu", detail: "9 yêu cầu mượn đã được xử lý", time: "10 giờ trước", color: "border-green-500" },
        ],
        insights: { borrowChange: "24%", category: "Công nghệ", traffic: "13:00-16:00" },
    },
} satisfies Record<TimeRange, AnalyticsRangeData>;

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return <section className={`rounded-xl border border-outline-variant/25 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] ${className}`}>{children}</section>;
}

const statToneClasses = {
    books: {
        card: "border-primary/15 bg-primary-50/70 text-primary-900",
        label: "text-primary-900/75",
        icon: "text-primary-600",
    },
    available: {
        card: "border-moss-500/20 bg-moss-50 text-moss-900",
        label: "text-moss-800/80",
        icon: "text-moss-600",
    },
    borrowed: {
        card: "border-secondary-container/30 bg-info-50 text-info-900",
        label: "text-info-900/75",
        icon: "text-info-600",
    },
    danger: {
        card: "border-error/25 bg-error-container text-on-error-container",
        label: "font-medium text-on-error-container",
        icon: "text-error",
    },
    members: {
        card: "border-tertiary-300/25 bg-tertiary-fixed/70 text-on-tertiary-fixed",
        label: "text-on-tertiary-fixed-variant",
        icon: "text-tertiary-500",
    },
    requests: {
        card: "border-brass-500/20 bg-brass-50 text-brass-900",
        label: "text-brass-800",
        icon: "text-brass-600",
    },
} as const;

function StatCard({ label, value, icon: Icon, trend, tone }: StatCardData) {
    const toneClasses = statToneClasses[tone];

    return (
        <article className={`flex h-[104px] flex-col justify-between rounded-xl border p-md shadow-[0_4px_12px_rgba(0,0,0,0.05)] ${toneClasses.card}`}>
            <div className="flex items-start justify-between gap-sm">
                <p className={`text-body-md ${toneClasses.label}`}>{label}</p>
                <Icon size={20} strokeWidth={1.9} className={toneClasses.icon} aria-hidden="true" />
            </div>
            <div className="flex items-end justify-between gap-sm">
                <strong className="text-[28px] font-bold leading-none text-current">{value}</strong>
                {trend ? (
                    <span className="inline-flex items-center gap-1 rounded bg-moss-50 px-1.5 py-0.5 text-xs font-medium text-moss-600">
                        <TrendingUp size={12} strokeWidth={2.4} />
                        {trend}
                    </span>
                ) : null}
            </div>
        </article>
    );
}

function normalizeMonthRange(selection: MonthRangeSelection): MonthRangeSelection {
    if (selection.startMonth <= selection.endMonth) {
        return selection;
    }

    return {
        ...selection,
        startMonth: selection.endMonth,
        endMonth: selection.startMonth,
    };
}

function timeRangeFromMonthSelection(selection: MonthRangeSelection): TimeRange {
    const monthCount = selection.endMonth - selection.startMonth + 1;

    if (monthCount <= 1) return "1m";
    if (monthCount <= 3) return "3m";
    if (monthCount <= 6) return "6m";
    return "1y";
}

function formatMonthPickerValue(year: number, month: number) {
    const monthLabel = MONTH_PICKER_OPTIONS.find((option) => option.value === month)?.label ?? `Th${month}`;
    return `${monthLabel}/${year}`;
}

function MonthInputControl({
    label,
    year,
    month,
    onChange,
}: {
    label: string;
    year: number;
    month: number;
    onChange: (value: { year: number; month: number }) => void;
}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative inline-flex">
            <button
                type="button"
                onClick={() => setIsOpen((current) => !current)}
                className="focus-ring flex h-11 min-w-[212px] items-center gap-2 rounded-lg bg-surface px-3 text-left transition-colors hover:bg-surface-container-low"
                aria-label={label}
                aria-expanded={isOpen}
            >
                <CalendarDays size={18} className="text-on-surface-variant" />
                <span className="text-body-sm font-medium text-on-surface-variant">{label}</span>
                <span className="text-body-sm font-medium text-on-surface">{formatMonthPickerValue(year, month)}</span>
            </button>

            {isOpen ? (
                <div className="absolute left-0 top-12 z-30 w-[288px] rounded-xl border border-outline-variant/40 bg-white p-md shadow-[0_18px_40px_rgba(0,0,0,0.16)]">
                    <select
                        value={year}
                        onChange={(event) => onChange({ year: Number(event.target.value), month })}
                        className="mb-md h-9 w-full rounded-lg border border-outline-variant/40 bg-surface px-3 text-body-sm font-medium text-on-surface outline-none focus:border-primary"
                        aria-label={label}
                    >
                        {YEAR_PICKER_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                    <div className="grid grid-cols-4 gap-xs">
                        {MONTH_PICKER_OPTIONS.map((option) => {
                            const isActive = option.value === month;
                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        onChange({ year, month: option.value });
                                        setIsOpen(false);
                                    }}
                                    className={`h-10 rounded-lg text-body-sm font-medium transition-colors ${
                                        isActive ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface hover:bg-primary-50"
                                    }`}
                                >
                                    {option.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ) : null}
        </div>
    );
}

function MonthRangeControls({
    value,
    onChange,
    showReset,
}: {
    value: MonthRangeSelection;
    onChange: (value: MonthRangeSelection) => void;
    showReset: boolean;
}) {
    const updateSelection = (nextSelection: MonthRangeSelection) => {
        onChange(normalizeMonthRange(nextSelection));
    };

    return (
        <span className="inline-flex flex-wrap items-center gap-2">
            <MonthInputControl
                label={ANALYTICS_TEXT.CALENDAR_FROM_LABEL}
                year={value.year}
                month={value.startMonth}
                onChange={(inputValue) => updateSelection({ ...value, year: inputValue.year, startMonth: inputValue.month })}
            />
            <MonthInputControl
                label={ANALYTICS_TEXT.CALENDAR_TO_LABEL}
                year={value.year}
                month={value.endMonth}
                onChange={(inputValue) => updateSelection({ ...value, year: inputValue.year, endMonth: inputValue.month })}
            />
            {showReset ? (
                <button
                    type="button"
                    onClick={() => onChange(CURRENT_MONTH_RANGE)}
                    className="focus-ring flex h-11 w-11 items-center justify-center rounded-lg border border-error/30 bg-error-50 text-error transition-colors hover:bg-error-100"
                    title={ANALYTICS_TEXT.CALENDAR_RESET_LABEL}
                    aria-label={ANALYTICS_TEXT.CALENDAR_RESET_LABEL}
                >
                    <X size={20} strokeWidth={2.2} />
                </button>
            ) : null}
        </span>
    );
}

function trendCoordinates(values: number[], maxValue: number) {
    const xStep = values.length > 1 ? 100 / (values.length - 1) : 100;
    return values.map((value, index) => {
        const x = values.length === 1 ? 50 : index * xStep;
        const y = 92 - (value / maxValue) * 84;
        return { x, y };
    });
}

function trendPoints(values: number[], maxValue: number) {
    return trendCoordinates(values, maxValue)
        .map((point) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`)
        .join(" ");
}

function formatStatusLabel(label: string, value: number) {
    return `${label} (${value}%)`;
}

function monthFromAbsoluteIndex(index: number) {
    return {
        year: Math.floor(index / 12),
        month: (index % 12) + 1,
    };
}

function formatTrendMonthLabel(year: number, month: number, selectedYear: number) {
    return year === selectedYear ? `Th${month}` : `Th${month}/${String(year).slice(-2)}`;
}

function metricForMonth(year: number, month: number, multiplier: number) {
    const yearLift = (year - 2022) * 36;
    const seasonalLift = Math.sin(((month - 2) / 12) * Math.PI * 2) * 32;
    return Math.round((230 + yearLift + month * 14 + seasonalLift) * multiplier);
}

function buildTrendData(selection: MonthRangeSelection): TrendData {
    const selected = normalizeMonthRange(selection);
    const firstIndex = selected.year * 12 + selected.startMonth - 1;
    const lastIndex = selected.year * 12 + selected.endMonth - 1;
    const points = Array.from({ length: lastIndex - firstIndex + 1 }, (_, index) => monthFromAbsoluteIndex(firstIndex + index));

    return {
        labels: points.map((point) => formatTrendMonthLabel(point.year, point.month, selected.year)),
        borrowed: points.map((point) => metricForMonth(point.year, point.month, 1)),
        returned: points.map((point) => metricForMonth(point.year, point.month, 0.82)),
        overdue: points.map((point) => Math.max(18, metricForMonth(point.year, point.month, 0.13) + (point.month % 3) * 3)),
    };
}

function BorrowingTrend({ trend, controls }: { trend: TrendData; controls: React.ReactNode }) {
    const maxValue = Math.max(...trend.borrowed, ...trend.returned, ...trend.overdue);
    const hasSinglePoint = trend.labels.length === 1;
    const borrowedDots = trendCoordinates(trend.borrowed, maxValue);
    const returnedDots = trendCoordinates(trend.returned, maxValue);
    const overdueDots = trendCoordinates(trend.overdue, maxValue);

    return (
        <Panel className="p-lg">
            <div className="mb-md flex flex-col gap-sm sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-title-md font-semibold text-on-surface">{ANALYTICS_TEXT.TREND_TITLE}</h2>
                <div className="flex flex-wrap items-center gap-md text-sm text-on-surface">
                    <span className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-secondary-container" />
                        {ANALYTICS_TEXT.TREND_BORROWED}
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-green-500" />
                        {ANALYTICS_TEXT.TREND_RETURNED}
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-error-400" />
                        {ANALYTICS_TEXT.TREND_OVERDUE}
                    </span>
                </div>
            </div>
            <div className="mb-md">{controls}</div>

            <div className="relative h-64 overflow-hidden rounded-lg bg-surface-container-low px-md pb-10 pt-md">
                <svg
                    className="absolute inset-x-0 top-0 h-[calc(100%-2.5rem)] w-full"
                    preserveAspectRatio="none"
                    viewBox="0 0 100 100"
                    role="img"
                    aria-label={ANALYTICS_TEXT.TREND_ARIA}
                >
                    {hasSinglePoint ? (
                        <>
                            {borrowedDots.map((point) => (
                                <circle
                                    key={`borrowed-${point.x}-${point.y}`}
                                    cx={point.x}
                                    cy={point.y}
                                    r="2.5"
                                    fill="#2dbcfe"
                                    vectorEffect="non-scaling-stroke"
                                />
                            ))}
                            {returnedDots.map((point) => (
                                <circle
                                    key={`returned-${point.x}-${point.y}`}
                                    cx={point.x}
                                    cy={point.y}
                                    r="2.5"
                                    fill="#22c55e"
                                    vectorEffect="non-scaling-stroke"
                                />
                            ))}
                            {overdueDots.map((point) => (
                                <circle
                                    key={`overdue-${point.x}-${point.y}`}
                                    cx={point.x}
                                    cy={point.y}
                                    r="2.5"
                                    fill="#ff3730"
                                    vectorEffect="non-scaling-stroke"
                                />
                            ))}
                        </>
                    ) : (
                        <>
                            <polyline
                                points={trendPoints(trend.borrowed, maxValue)}
                                fill="none"
                                stroke="#2dbcfe"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                vectorEffect="non-scaling-stroke"
                            />
                            <polyline
                                points={trendPoints(trend.returned, maxValue)}
                                fill="none"
                                stroke="#22c55e"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                vectorEffect="non-scaling-stroke"
                            />
                            <polyline
                                points={trendPoints(trend.overdue, maxValue)}
                                fill="none"
                                stroke="#ff3730"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                vectorEffect="non-scaling-stroke"
                            />
                        </>
                    )}
                </svg>
                <div className="absolute bottom-3 left-0 flex w-full justify-between px-lg text-xs text-outline">
                    {trend.labels.map((label) => (
                        <span key={label}>{label}</span>
                    ))}
                </div>
            </div>
        </Panel>
    );
}

function LibraryStatus({ status }: { status: LibraryStatusData }) {
    const borrowingOffset = -status.available;
    const reservedOffset = -(status.available + status.borrowing);
    const maintenanceOffset = -(status.available + status.borrowing + status.reserved);

    return (
        <Panel className="flex flex-col p-lg">
            <h2 className="mb-md text-title-md font-semibold text-on-surface">{ANALYTICS_TEXT.STATUS_TITLE}</h2>
            <div className="relative flex min-h-56 flex-1 items-center justify-center">
                <svg className="h-48 w-48 -rotate-90" viewBox="0 0 36 36" aria-label={ANALYTICS_TEXT.STATUS_ARIA} role="img">
                    <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#22c55e" strokeDasharray={`${status.available} 100`} strokeWidth="4" />
                    <circle
                        cx="18"
                        cy="18"
                        r="15.9155"
                        fill="none"
                        stroke="#2dbcfe"
                        strokeDasharray={`${status.borrowing} 100`}
                        strokeDashoffset={borrowingOffset}
                        strokeWidth="4"
                    />
                    <circle
                        cx="18"
                        cy="18"
                        r="15.9155"
                        fill="none"
                        stroke="#e1e3e4"
                        strokeDasharray={`${status.reserved} 100`}
                        strokeDashoffset={reservedOffset}
                        strokeWidth="4"
                    />
                    <circle
                        cx="18"
                        cy="18"
                        r="15.9155"
                        fill="none"
                        stroke="#ff3730"
                        strokeDasharray={`${status.maintenance} 100`}
                        strokeDashoffset={maintenanceOffset}
                        strokeWidth="4"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <strong className="text-[28px] leading-none text-on-surface">100%</strong>
                    <span className="mt-2 text-xs text-on-surface-variant">{ANALYTICS_TEXT.STATUS_CAPACITY}</span>
                </div>
            </div>
            <div className="mt-md grid grid-cols-2 gap-x-md gap-y-sm text-sm text-on-surface">
                <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                    {formatStatusLabel(ANALYTICS_TEXT.STATUS_AVAILABLE_LABEL, status.available)}
                </span>
                <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                    {formatStatusLabel(ANALYTICS_TEXT.STATUS_BORROWING_LABEL, status.borrowing)}
                </span>
                <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-surface-variant" />
                    {formatStatusLabel(ANALYTICS_TEXT.STATUS_RESERVED_LABEL, status.reserved)}
                </span>
                <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                    {formatStatusLabel(ANALYTICS_TEXT.STATUS_MAINTENANCE_LABEL, status.maintenance)}
                </span>
            </div>
        </Panel>
    );
}

function TopCategories({ categories }: { categories: CategoryData[] }) {
    return (
        <Panel className="p-lg">
            <h2 className="mb-lg text-title-md font-semibold text-on-surface">{ANALYTICS_TEXT.CATEGORIES_TITLE}</h2>
            <div className="space-y-md">
                {categories.map((category) => (
                    <div key={category.label} className="grid grid-cols-[92px_1fr_44px] items-center gap-sm">
                        <span className="text-body-sm text-on-surface-variant">{category.label}</span>
                        <span className="h-2 overflow-hidden rounded-full bg-surface-container-low">
                            <span className={`block h-full rounded-full ${category.opacity}`} style={{ width: `${category.value}%` }} />
                        </span>
                        <span className="text-right text-body-sm font-medium text-on-surface">{category.value}%</span>
                    </div>
                ))}
            </div>
        </Panel>
    );
}

function MostBorrowedBooks({ books }: { books: BorrowedBookData[] }) {
    return (
        <Panel className="p-lg">
            <div className="mb-md">
                <h2 className="text-title-md font-semibold text-on-surface">{ANALYTICS_TEXT.MOST_BORROWED_TITLE}</h2>
            </div>
            <div className="thin-scroll max-h-[320px] overflow-y-auto pr-sm">
                <table className="w-full table-fixed border-collapse text-left">
                    <colgroup>
                        <col className="w-[60px]" />
                        <col />
                        <col className="w-[96px]" />
                        <col className="w-[112px]" />
                    </colgroup>
                    <thead className="sticky top-0 z-10 bg-white">
                        <tr className="border-b border-surface-variant text-xs font-medium text-outline">
                            <th className="w-12 pb-sm font-medium">{ANALYTICS_TEXT.TABLE_BOOK}</th>
                            <th className="pb-sm font-medium">{ANALYTICS_TEXT.TABLE_TITLE_AUTHOR}</th>
                            <th className="pb-sm pl-md text-left font-medium">{ANALYTICS_TEXT.TABLE_BORROWS}</th>
                            <th className="pb-sm pl-sm text-left font-medium">{ANALYTICS_TEXT.TABLE_STATUS}</th>
                        </tr>
                    </thead>
                    <tbody className="text-body-sm text-on-surface">
                        {books.map((book) => (
                            <tr key={book.title} className="border-b border-surface-container-high last:border-0">
                                <td className="py-3">
                                    <div className="h-12 w-10 rounded bg-surface-variant" aria-hidden="true" />
                                </td>
                                <td className="py-3 pr-sm">
                                    <p className="truncate font-medium">{book.title}</p>
                                    <p className="truncate text-xs text-on-surface-variant">{book.author}</p>
                                </td>
                                <td className="py-3 pl-md text-left font-medium">{book.borrows}</td>
                                <td className="py-3 pl-sm text-left">
                                    <span className={`inline-flex rounded-full px-3 py-1 text-xs ${book.statusClass}`}>{book.status}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Panel>
    );
}

function RecentActivities({ activities }: { activities: ActivityData[] }) {
    return (
        <Panel className="p-lg">
            <h2 className="mb-lg text-title-md font-semibold text-on-surface">{ANALYTICS_TEXT.ACTIVITIES_TITLE}</h2>
            <div className="thin-scroll max-h-[320px] space-y-0 overflow-y-auto pl-1 pr-sm">
                {activities.map((activity, index) => (
                    <div key={activity.title} className="relative pb-7 pl-7 last:pb-0">
                        {index < activities.length - 1 ? <span className="absolute left-[7px] top-5 h-full w-px bg-surface-variant" /> : null}
                        <span className={`absolute left-0 top-1 h-4 w-4 rounded-full border-2 bg-white ${activity.color}`} />
                        <p className="text-body-sm font-medium text-on-surface">{activity.title}</p>
                        <p className="mt-1 text-xs text-on-surface-variant">{activity.detail}</p>
                        <time className="mt-2 block text-xs text-outline">{activity.time}</time>
                    </div>
                ))}
            </div>
        </Panel>
    );
}

function AiInsights({ insights }: { insights: InsightsData }) {
    return (
        <section className="rounded-xl bg-gradient-to-r from-primary to-secondary-container p-[2px] shadow-[0_12px_32px_rgba(0,0,0,0.1)]">
            <div className="flex flex-col gap-md rounded-[10px] bg-white p-lg sm:flex-row sm:items-center">
                <div className="grid h-[72px] w-[72px] shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                    <Sparkles size={34} strokeWidth={1.8} />
                </div>
                <div>
                    <div className="mb-sm flex flex-wrap items-center gap-sm">
                        <h2 className="text-title-md font-semibold text-on-surface">{ANALYTICS_TEXT.AI_TITLE}</h2>
                        <span className="rounded bg-secondary-fixed px-3 py-1 font-mono text-xs font-semibold text-on-secondary-fixed">
                            {ANALYTICS_TEXT.AI_BADGE}
                        </span>
                    </div>
                    <ul className="ml-5 list-disc space-y-1 text-body-md text-on-surface-variant">
                        <li>
                            {ANALYTICS_TEXT.AI_BORROW_PREFIX}
                            <strong className="text-on-surface">{insights.borrowChange}</strong>
                            {ANALYTICS_TEXT.AI_BORROW_SUFFIX}
                        </li>
                        <li>
                            {ANALYTICS_TEXT.AI_SCIENCE_PREFIX}
                            <strong className="text-on-surface">{insights.category}</strong>
                            {ANALYTICS_TEXT.AI_SCIENCE_SUFFIX}
                        </li>
                        <li>
                            {ANALYTICS_TEXT.AI_TRAFFIC_PREFIX}
                            <strong className="text-on-surface">{insights.traffic}</strong>
                            {ANALYTICS_TEXT.AI_TRAFFIC_SUFFIX}
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    );
}

export default function ThongKePage() {
    const [monthRange, setMonthRange] = useState<MonthRangeSelection>(CURRENT_MONTH_RANGE);
    const normalizedMonthRange = normalizeMonthRange(monthRange);
    const activeData = analyticsDataByRange[timeRangeFromMonthSelection(normalizedMonthRange)];
    const trendData = buildTrendData(normalizedMonthRange);
    const isCurrentMonthRange =
        monthRange.year === CURRENT_MONTH_RANGE.year &&
        monthRange.startMonth === CURRENT_MONTH_RANGE.startMonth &&
        monthRange.endMonth === CURRENT_MONTH_RANGE.endMonth;
    const exportData: AnalyticsExportData = {
        periodLabel: `${formatMonthPickerValue(normalizedMonthRange.year, normalizedMonthRange.startMonth)} - ${formatMonthPickerValue(
            normalizedMonthRange.year,
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
