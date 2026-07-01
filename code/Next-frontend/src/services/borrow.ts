import axiosInstance from "@/lib/axios";

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
