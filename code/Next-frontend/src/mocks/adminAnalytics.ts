import { AlertTriangle, CheckCircle2, ClipboardList, LibraryBig, ShoppingBasket, Users } from "lucide-react";
import type { AnalyticsData, TimeRange } from "@/types/admin-analytics";

const createMockData = (): AnalyticsData => ({
    statCards: [
        { label: "Tổng số sách", value: "12,450", icon: LibraryBig, tone: "books", trend: "+2.5%" },
        { label: "Sách sẵn sàng", value: "8,230", icon: CheckCircle2, tone: "available", trend: "+1.2%" },
        { label: "Đang mượn", value: "3,120", icon: ShoppingBasket, tone: "borrowed", trend: "+5.4%" },
        { label: "Quá hạn", value: "145", icon: AlertTriangle, tone: "danger", trend: "-12%" },
        { label: "Độc giả", value: "2,890", icon: Users, tone: "members", trend: "+8.1%" },
        { label: "Yêu cầu", value: "56", icon: ClipboardList, tone: "requests", trend: "-3.2%" },
    ],
    libraryStatus: {
        available: 65,
        borrowing: 25,
        reserved: 8,
        maintenance: 2,
    },
    categories: [
        { label: "Khoa học máy tính", value: 35, opacity: "bg-primary-500" },
        { label: "Văn học", value: 25, opacity: "bg-primary-400" },
        { label: "Kinh tế", value: 20, opacity: "bg-primary-300" },
        { label: "Lịch sử", value: 15, opacity: "bg-primary-200" },
        { label: "Khác", value: 5, opacity: "bg-surface-variant" },
    ],
    borrowedBooks: [
        { title: "Clean Code", author: "Robert C. Martin", borrows: 145, status: "Sẵn sàng", statusClass: "bg-green-100 text-green-700" },
        { title: "Design Patterns", author: "Erich Gamma", borrows: 120, status: "Đang mượn", statusClass: "bg-blue-100 text-blue-700" },
        { title: "Sapiens", author: "Yuval Noah Harari", borrows: 98, status: "Quá hạn", statusClass: "bg-red-100 text-red-700" },
    ],
    recentActivities: [
        { title: "Mượn sách mới", detail: "Nguyễn Văn A đã mượn 'Clean Code'", time: "10 phút trước", color: "border-blue-500" },
        { title: "Trả sách", detail: "Trần Thị B đã trả 'Design Patterns'", time: "25 phút trước", color: "border-green-500" },
        { title: "Quá hạn", detail: "Lê Văn C chưa trả 'Sapiens'", time: "1 giờ trước", color: "border-red-500" },
    ],
    insights: {
        borrowChange: "tăng 15%",
        category: "Khoa học máy tính",
        traffic: "cao nhất vào Thứ 3",
    },
});

export const analyticsDataByRange: Record<TimeRange, AnalyticsData> = {
    "1m": createMockData(),
    "3m": createMockData(),
    "6m": createMockData(),
    "1y": createMockData(),
};
