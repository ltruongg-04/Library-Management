import axiosInstance from "@/lib/axios";
import type { ApiResponse, PageResponse } from "@/types/api";
import type { Notification } from "@/types/notification";

interface NotificationApiResponse {
    id: number;
    title: string;
    content: string;
    type: Notification["type"];
    read: boolean;
    createdAt: string;
    readAt: string | null;
}

const formatNotificationTime = (createdAt: string) => {
    const date = new Date(createdAt);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return new Intl.DateTimeFormat("vi-VN", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(date);
};

const toNotification = (item: NotificationApiResponse): Notification => ({
    id: item.id,
    title: item.title,
    message: item.content,
    type: item.type,
    isRead: item.read,
    time: formatNotificationTime(item.createdAt),
});

export const notificationService = {
    async list(page = 0, size = 20): Promise<Notification[]> {
        const response = await axiosInstance.get<ApiResponse<PageResponse<NotificationApiResponse>>>("/api/notifications", {
            params: { page, size },
        });

        return response.data.data?.content.map(toNotification) ?? [];
    },

    async unreadCount(): Promise<number> {
        const response = await axiosInstance.get<ApiResponse<{ unreadCount: number }>>("/api/notifications/unread-count");

        return response.data.data?.unreadCount ?? 0;
    },

    async markAsRead(id: number): Promise<void> {
        await axiosInstance.patch(`/api/notifications/${id}/read`);
    },

    async markAllAsRead(): Promise<void> {
        await axiosInstance.patch("/api/notifications/read-all");
    },
};
