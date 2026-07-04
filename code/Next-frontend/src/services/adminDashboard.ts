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
}

export const adminDashboardService = {
    async getStats(): Promise<DashboardStats> {
        const response = await axiosInstance.get<DashboardStats>("/api/admin/dashboard/stats");
        return response.data;
    },
};
