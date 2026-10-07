import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/types/api";

export interface AdminStockReceiptDetail {
    id: number;
    bookId: number;
    bookTitle: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export interface AdminStockReceipt {
    id: number;
    receiptCode: string;
    supplierName: string;
    supplierId: number;
    totalAmount: number;
    note: string;
    createdBy: string;
    createdAt: string;
    details: AdminStockReceiptDetail[];
}

export interface AdminCreateStockReceiptRequest {
    supplierId: number;
    note: string;
    details: {
        bookId: number;
        quantity: number;
        unitPrice: number;
    }[];
}

export const getAdminStockReceipts = async (): Promise<ApiResponse<AdminStockReceipt[]>> => {
    const response = await axiosInstance.get<ApiResponse<AdminStockReceipt[]>>("/api/admin/stock-receipts");
    return response.data;
};

export const getAdminStockReceiptDetail = async (id: number): Promise<ApiResponse<AdminStockReceipt>> => {
    const response = await axiosInstance.get<ApiResponse<AdminStockReceipt>>(`/api/admin/stock-receipts/${id}`);
    return response.data;
};

export const createAdminStockReceipt = async (data: AdminCreateStockReceiptRequest): Promise<ApiResponse<AdminStockReceipt>> => {
    const response = await axiosInstance.post<ApiResponse<AdminStockReceipt>>("/api/admin/stock-receipts", data);
    return response.data;
};
