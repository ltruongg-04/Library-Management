import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/types/api";

export interface AdminSupplier {
    id: number;
    name: string;
    phone: string;
    email: string;
    address: string;
    isActive: boolean;
}

export const getAdminSuppliers = async (): Promise<ApiResponse<AdminSupplier[]>> => {
    const response = await axiosInstance.get<ApiResponse<AdminSupplier[]>>("/api/admin/suppliers");
    return response.data;
};

export const createAdminSupplier = async (data: Omit<AdminSupplier, "id">): Promise<ApiResponse<AdminSupplier>> => {
    const response = await axiosInstance.post<ApiResponse<AdminSupplier>>("/api/admin/suppliers", data);
    return response.data;
};

export const updateAdminSupplier = async (id: number, data: Omit<AdminSupplier, "id">): Promise<ApiResponse<AdminSupplier>> => {
    const response = await axiosInstance.put<ApiResponse<AdminSupplier>>(`/api/admin/suppliers/${id}`, data);
    return response.data;
};
