import axiosInstance from "@/lib/axios";

export interface SystemLog {
    id: number;
    userId: number | null;
    userEmail: string | null;
    userFullName: string | null;
    action: string;
    details: string;
    ipAddress: string | null;
    status: string;
    createdAt: string;
}

export interface SystemLogPageResponse {
    content: SystemLog[];
    pageable: {
        pageNumber: number;
        pageSize: number;
    };
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

export const systemLogService = {
    getSystemLogs: async (page: number = 0, size: number = 10): Promise<SystemLogPageResponse> => {
        const response = await axiosInstance.get("/api/admin/system-logs", {
            params: { page, size },
        });
        return response.data;
    },

    logExportEvent: async (format: string): Promise<void> => {
        await axiosInstance.post("/api/admin/system-logs/export-event", { format });
    },
};
