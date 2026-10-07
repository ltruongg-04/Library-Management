import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/types/api";

export interface AdminBanner {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    linkUrl: string;
    displayOrder: number;
    isActive: boolean;
}

export const getAdminBanners = async (): Promise<ApiResponse<AdminBanner[]>> => {
    const response = await axiosInstance.get<ApiResponse<AdminBanner[]>>("/api/admin/banners");
    return response.data;
};

export const createAdminBanner = async (data: Omit<AdminBanner, "id">): Promise<ApiResponse<AdminBanner>> => {
    const response = await axiosInstance.post<ApiResponse<AdminBanner>>("/api/admin/banners", data);
    return response.data;
};

export const updateAdminBanner = async (id: number, data: Omit<AdminBanner, "id">): Promise<ApiResponse<AdminBanner>> => {
    const response = await axiosInstance.put<ApiResponse<AdminBanner>>(`/api/admin/banners/${id}`, data);
    return response.data;
};

export const deleteAdminBanner = async (id: number): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.delete<ApiResponse<void>>(`/api/admin/banners/${id}`);
    return response.data;
};
