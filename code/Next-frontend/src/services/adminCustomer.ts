import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/types/api";

export interface AdminCustomerLookupResponse {
    id: number;
    fullName: string;
    phone: string;
    email: string | null;
    libraryCardNo: string | null;
    isGuest: boolean;
}

export const lookupCustomer = async (query: string): Promise<ApiResponse<AdminCustomerLookupResponse>> => {
    const response = await axiosInstance.get<ApiResponse<AdminCustomerLookupResponse>>(`/api/admin/customers/lookup`, {
        params: { query },
    });
    return response.data;
};
