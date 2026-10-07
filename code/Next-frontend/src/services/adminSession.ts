import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/types/api";

export interface AdminSession {
    id: string; // Token ID
    userId: number;
    username: string;
    fullName: string;
    userAgent: string;
    ipAddress: string;
    loginTime: string;
}

export const getAllSessions = async (): Promise<ApiResponse<AdminSession[]>> => {
    const response = await axiosInstance.get<ApiResponse<AdminSession[]>>(`/api/admin/sessions`);
    return response.data;
};

export const terminateSession = async (sessionId: string): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.delete<ApiResponse<void>>(`/api/admin/sessions/${sessionId}`);
    return response.data;
};

export const terminateAllUserSessions = async (userId: number): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.delete<ApiResponse<void>>(`/api/admin/sessions/user/${userId}`);
    return response.data;
};
