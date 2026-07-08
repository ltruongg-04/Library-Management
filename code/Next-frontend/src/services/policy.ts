import axiosInstance from "@/lib/axios";

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
    const response = await axiosInstance.get("/policies/active");
    return response.data;
};

export const updateActivePolicy = async (data: Partial<BorrowingPolicyDto>) => {
    const response = await axiosInstance.put("/admin/policies/active", data);
    return response.data;
};
