import { API_ERRORS } from "@/constants/ui-text/shared/api";
import axiosInstance from "@/lib/axios";
import { ApiResponse, PageResponse } from "@/types/api";
import type { UserBorrowDetail, UserBorrowHistoryItem } from "@/types/borrow";

export type { UserBorrowDetail, UserBorrowHistoryItem };

export const userBorrowService = {
    async getHistory(page: number = 0, size: number = 20): Promise<PageResponse<UserBorrowHistoryItem>> {
        const response = await axiosInstance.get<ApiResponse<UserBorrowHistoryItem[]>>(`/api/user/borrow/history`, {
            params: { page, size },
        });
        if (!response.data.success || !response.data.data) {
            throw new Error(response.data.message || API_ERRORS.USER_BORROW_HISTORY_FAILED);
        }
        return {
            content: response.data.data,
            totalPages: 1,
            totalElements: response.data.data.length,
            number: 0,
            size: response.data.data.length || 20,
        };
    },

    async getDetail(orderCode: string): Promise<UserBorrowDetail> {
        const response = await axiosInstance.get<ApiResponse<UserBorrowDetail>>(`/api/user/borrow/${orderCode}`);
        if (!response.data.success || !response.data.data) {
            throw new Error(response.data.message || API_ERRORS.USER_BORROW_DETAIL_FAILED);
        }
        return response.data.data;
    },
};
