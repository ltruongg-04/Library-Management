import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { BorrowHistoryResponseDto, BorrowOrderDetailResponseDto, BorrowRequestPayload, BorrowResponse } from "@/types/borrow";

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

export const cancelBorrowOrder = async (orderId: string): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.post<ApiResponse<void>>(`/api/user/borrow/${orderId}/cancel`);
    return response.data;
};

export interface GuestBorrowRequestPayload extends BorrowRequestPayload {
    fullName: string;
    phone: string;
    email?: string;
}

export const createGuestBorrowRequest = async (payload: GuestBorrowRequestPayload): Promise<ApiResponse<BorrowResponse>> => {
    const response = await axiosInstance.post<ApiResponse<BorrowResponse>>("/api/public/borrow/guest", payload);
    return response.data;
};

export const requestGuestLookupOtp = async (email: string): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.post<ApiResponse<void>>("/api/public/borrow/otp/request", { email });
    return response.data;
};

export const getGuestBorrowOrders = async (identifier: string, otp?: string, recaptchaToken?: string): Promise<ApiResponse<BorrowOrderDetailResponseDto[]>> => {
    const response = await axiosInstance.post<ApiResponse<BorrowOrderDetailResponseDto[]>>("/api/public/borrow/lookup", {
        identifier,
        otp,
        recaptchaToken,
    });
    return response.data;
};
