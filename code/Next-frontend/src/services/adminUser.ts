import axiosInstance from "@/lib/axios";
import { User } from "@/types/user";

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T | null;
    timestamp: string;
}

export const getAdminUsers = async (): Promise<ApiResponse<User[]>> => {
    const response = await axiosInstance.get<ApiResponse<User[]>>("/api/admin/users");
    return response.data;
};

export const updateAdminUserStatus = async (id: number, active: boolean): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.put<ApiResponse<void>>(`/api/admin/users/${id}/status`, null, {
        params: { active },
    });
    return response.data;
};

export interface AdminUpdateUserRequest {
    fullName: string;
    role: string;
}

export const updateAdminUser = async (id: number, request: AdminUpdateUserRequest): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.put<ApiResponse<void>>(`/api/admin/users/${id}`, request);
    return response.data;
};

export interface AdminCreateUserRequest {
    fullName: string;
    email: string;
    password?: string;
    role: string;
}

export const createAdminUser = async (request: AdminCreateUserRequest): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.post<ApiResponse<void>>("/api/admin/users", request);
    return response.data;
};
