import axiosInstance from "@/lib/axios";
import { BorrowHistoryResponseDto, BorrowOrderDetailResponseDto } from "@/types/borrow";

export interface BorrowRequestPayload {
    bookId: number;
    pickupDate: string;
    returnDate: string;
    paymentMethod: string;
}

export interface BorrowResponse {
    id: number;
    orderCode: string;
    pickupDate: string;
    dueDate: string;
    status: string;
    totalDeposit: number;
    paymentMethod: string;
    paymentStatus: string;
    paymentUrl?: string;
}

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T | null;
    timestamp: string;
}

export const createBorrowRequest = async (payload: BorrowRequestPayload): Promise<ApiResponse<BorrowResponse>> => {
    const response = await axiosInstance.post<ApiResponse<BorrowResponse>>("/api/user/borrow", payload);
    return response.data;
};

export const getBorrowHistory = async (): Promise<ApiResponse<BorrowHistoryResponseDto[]>> => {
    const response = await axiosInstance.get<ApiResponse<BorrowHistoryResponseDto[]>>("/api/user/borrow/history");
    return response.data;
};

export const getBorrowOrderDetail = async (orderCode: string): Promise<ApiResponse<BorrowOrderDetailResponseDto>> => {
    const response = await axiosInstance.get<ApiResponse<BorrowOrderDetailResponseDto>>(`/api/user/borrow/history/${orderCode}`);
    return response.data;
};

export const renewBorrowOrder = async (orderId: string, durationInDays: number): Promise<ApiResponse<BorrowResponse>> => {
    const response = await axiosInstance.post<ApiResponse<BorrowResponse>>(`/api/user/borrow/${orderId}/renew`, { durationInDays });
    return response.data;
};
