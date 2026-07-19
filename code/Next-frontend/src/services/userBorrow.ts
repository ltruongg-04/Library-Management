import { API_ERRORS } from "@/constants/ui-text/shared/api";
import axiosInstance from "@/lib/axios";

export interface UserBorrowHistoryItem {
    id: number;
    orderCode: string;
    status: string;
    borrowDate: string;
    pickupDate: string | null;
    dueDate: string;
    actualReturnDate?: string | null;
    totalDeposit: number;
    bookTitle: string;
    bookAuthor: string;
    bookCoverImage: string | null;
}

export interface UserBorrowDetail {
    id: number;
    orderCode: string;
    status: string;
    borrowDate: string;
    pickupDate: string | null;
    dueDate: string;
    totalDeposit: number;
    totalFee: number | null;
    lateFee: number;
    bookTitle: string;
    bookAuthor: string;
    bookCoverImage: string | null;
    bookDetailStatus: string;
}

interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
}

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T | null;
    timestamp: string;
}

export const userBorrowService = {
    async getHistory(_page: number = 0, _size: number = 20): Promise<PageResponse<UserBorrowHistoryItem>> {
        const response = await axiosInstance.get<ApiResponse<UserBorrowHistoryItem[]>>(`/api/user/borrow/history`);
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
