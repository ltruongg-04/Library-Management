import axiosInstance from "@/lib/axios";
import type { ApiResponse } from "@/types/api";

export interface BorrowingPolicyDto {
    id: number;
    maxBorrowDays: number;
    maxBooks: number;
    rentalFeePerDay: number;
    overdueFinePerDay: number;
    damageFeePercent: number;
    lostBookMultiplier: number;
    maxExtensions: number;
}

export const getActivePolicy = async () => {
    const response = await axiosInstance.get<ApiResponse<BorrowingPolicyDto>>("/api/policies/active");
    return response.data.data;
};

export const updateActivePolicy = async (data: Partial<BorrowingPolicyDto>) => {
    const response = await axiosInstance.put<ApiResponse<BorrowingPolicyDto>>("/api/admin/policies/active", data);
    return response.data.data;
};
