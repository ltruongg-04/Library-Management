import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { PageResponse } from "@/types/book";

export interface AdminPayment {
    id: number;
    orderCode: string;
    paymentMethod: string;
    transactionCode: string;
    amount: number;
    paymentType: string;
    paymentStatus: string;
    paymentDate: string;
    processedByName: string;
}

export const getAdminPayments = async (page = 0, size = 10, transactionCode = ""): Promise<ApiResponse<PageResponse<AdminPayment>>> => {
    const response = await axiosInstance.get<ApiResponse<PageResponse<AdminPayment>>>(`/api/admin/payments`, {
        params: { page, size, transactionCode },
    });
    return response.data;
};

export const refundAdminPayment = async (id: number): Promise<ApiResponse<AdminPayment>> => {
    const response = await axiosInstance.post<ApiResponse<AdminPayment>>(`/api/admin/payments/${id}/refund`);
    return response.data;
};
