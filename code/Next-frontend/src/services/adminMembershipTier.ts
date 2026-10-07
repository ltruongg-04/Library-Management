import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/types/api";

export interface AdminMembershipTier {
    id: number;
    name: string;
    minPoints: number;
    discountPercent: number;
    maxBorrowDays: number;
    maxBorrowBooks: number;
}

export const getAdminMembershipTiers = async (): Promise<ApiResponse<AdminMembershipTier[]>> => {
    const response = await axiosInstance.get<ApiResponse<AdminMembershipTier[]>>("/api/admin/membership-tiers");
    return response.data;
};

export const createAdminMembershipTier = async (data: Omit<AdminMembershipTier, "id">): Promise<ApiResponse<AdminMembershipTier>> => {
    const response = await axiosInstance.post<ApiResponse<AdminMembershipTier>>("/api/admin/membership-tiers", data);
    return response.data;
};

export const updateAdminMembershipTier = async (id: number, data: Omit<AdminMembershipTier, "id">): Promise<ApiResponse<AdminMembershipTier>> => {
    const response = await axiosInstance.put<ApiResponse<AdminMembershipTier>>(`/api/admin/membership-tiers/${id}`, data);
    return response.data;
};

export const deleteAdminMembershipTier = async (id: number): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.delete<ApiResponse<void>>(`/api/admin/membership-tiers/${id}`);
    return response.data;
};
