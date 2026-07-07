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
    isGuest?: boolean;
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
    bookCopyId: number;
    bookTitle: string;
    bookAuthor: string;
    barcode: string;
    rentalFee: number;
    depositPrice: number;
    status: string;
}

export interface AdminBorrowOrderDetailResponse {
    id: number;
    orderCode: string;
    borrowDate: string | null;
    pickupDate: string | null;
    dueDate: string | null;
    status: string;
    subtotalFee: number;
    discountAmount: number;
    totalFee: number;
    totalDeposit: number;
    totalPaidOnline: number;
    settlementAmount: number;
    settlementType: "COLLECT" | "REFUND" | "SETTLED";
    customerName: string;
    customerCode: string;
    customerPhone: string;
    isGuest?: boolean;
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

export interface BookReturnDetailRequest {
    bookCopyId: number;
    conditionStatus: "NORMAL" | "DAMAGED" | "LOST";
    note?: string;
}

export interface AdminReturnBookRequest {
    borrowOrderId: number;
    details: BookReturnDetailRequest[];
    generalNote?: string;
}

export interface ReturnDetailDto {
    bookTitle: string;
    barcode: string;
    conditionStatus: "NORMAL" | "DAMAGED" | "LOST";
    fineAmount: number;
    note?: string;
}

export interface ReturnBookResponse {
    bookReturnId: number;
    borrowOrderId: number;
    returnDate: string;
    overdueDays: number;
    totalFineAmount: number;
    note: string;
    fine?: {
        id: number;
        amount: number;
        status: string;
    };
    orderCode: string;
    subtotalFee: number;
    totalDeposit: number;
    totalAmountToPay: number;
    details: ReturnDetailDto[];
}

export const returnBooks = async (borrowOrderId: number, request: AdminReturnBookRequest): Promise<ApiResponse<ReturnBookResponse>> => {
    const response = await axiosInstance.post<ApiResponse<ReturnBookResponse>>(`/api/admin/borrows/${borrowOrderId}/return`, request);
    return response.data;
};

export const generateReturnVnPayUrl = async (bookReturnId: number): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.post<ApiResponse<string>>(`/api/admin/borrows/returns/${bookReturnId}/vnpay`);
    return response.data;
};

export const confirmReturnCashPayment = async (bookReturnId: number): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.post<ApiResponse<string>>(`/api/admin/borrows/returns/${bookReturnId}/cash`);
    return response.data;
};
