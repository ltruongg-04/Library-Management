import axiosInstance from "@/lib/axios";

export interface AdminBorrowResponse {
    id: string;
    customerName: string;
    customerCode: string;
    bookTitle: string;
    bookAuthor: string;
    borrowDate: string | null;
    dueDate: string | null;
    status: string;
    overdayCount: number | null;
}

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T | null;
    timestamp: string;
}

export const getAdminBorrowOrders = async (): Promise<ApiResponse<AdminBorrowResponse[]>> => {
    const response = await axiosInstance.get<ApiResponse<AdminBorrowResponse[]>>("/api/admin/borrows");
    return response.data;
};

export const updateAdminBorrowStatus = async (orderCode: string, status: string): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.put<ApiResponse<void>>(`/api/admin/borrows/${orderCode}/status`, null, {
        params: { status },
    });
    return response.data;
};

export interface BorrowItemResponse {
    id: number;
    bookTitle: string;
    bookAuthor: string;
    barcode: string;
    rentalFee: number;
    depositPrice: number;
    status: string;
}

export interface AdminBorrowOrderDetailResponse {
    orderCode: string;
    borrowDate: string | null;
    pickupDate: string | null;
    dueDate: string | null;
    status: string;
    subtotalFee: number;
    discountAmount: number;
    totalFee: number;
    totalDeposit: number;
    customerName: string;
    customerCode: string;
    customerPhone: string;
    items: BorrowItemResponse[];
}

export const getAdminBorrowOrderDetail = async (orderCode: string): Promise<ApiResponse<AdminBorrowOrderDetailResponse>> => {
    const response = await axiosInstance.get<ApiResponse<AdminBorrowOrderDetailResponse>>(`/api/admin/borrows/${orderCode}`);
    return response.data;
};

export interface AdminCreateBorrowOrderRequest {
    phone: string;
    fullName?: string;
    email?: string;
    bookBarcodes: string[];
    dueDate: string;
}

export const createAdminBorrowOrder = async (request: AdminCreateBorrowOrderRequest): Promise<ApiResponse<AdminBorrowResponse>> => {
    const response = await axiosInstance.post<ApiResponse<AdminBorrowResponse>>("/api/admin/borrows", request);
    return response.data;
};

export const processRenewal = async (orderCode: string, approved: boolean): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.put<ApiResponse<void>>(`/api/admin/borrows/${orderCode}/renew`, { approved });
    return response.data;
};
