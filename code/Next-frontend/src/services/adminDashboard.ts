import axiosInstance from "@/lib/axios";

export interface RecentActivity {
    orderCode: string;
    customerName: string;
    bookTitle: string;
    status: string;
    createdAt: string;
}

export interface DashboardStats {
    booksBorrowedToday: number;
    pendingApprovals: number;
    overdueBooks: number;
    totalBooks: number;
    totalAvailableBooks: number;
    totalCustomers: number;
    totalBorrowOrders: number;
    recentActivities: RecentActivity[];
    categories: Array<{ label: string; value: number }>;
    borrowedBooks: Array<{ title: string; author: string; borrows: number; status: string }>;
    monthlyTrends: Array<{ month: string; borrowed: number; returned: number; overdue: number }>;
}

export const adminDashboardService = {
    async getStats(): Promise<DashboardStats> {
        const response = await axiosInstance.get<DashboardStats>("/api/admin/dashboard/stats");
        return response.data;
    },
};
