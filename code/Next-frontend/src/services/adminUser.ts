import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { User } from "@/types/user";

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
