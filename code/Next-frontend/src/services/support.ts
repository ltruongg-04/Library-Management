import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/types/api";

export interface SupportRequestPayload {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export const createSupportRequest = async (payload: SupportRequestPayload): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.post<ApiResponse<void>>("/api/public/support-requests", payload);
    return response.data;
};
