import { getClientApiBaseUrl } from "@/config/env";
import axiosInstance from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { EbookInfo, EbookUpdateRequest } from "@/types/ebook";

export const ebookService = {
    getEbookInfo: async (bookId: number): Promise<EbookInfo> => {
        const response = await axiosInstance.get<ApiResponse<EbookInfo>>(`/api/books/${bookId}/ebook`);
        return response.data.data as EbookInfo;
    },

    getEbookStreamUrl: (bookId: number): string => {
        return `${getClientApiBaseUrl()}/api/books/${bookId}/ebook/stream`;
    },

    uploadEbook: async (bookId: number, formData: FormData): Promise<EbookInfo> => {
        const response = await axiosInstance.post<ApiResponse<EbookInfo>>(`/api/admin/books/${bookId}/ebook`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data.data as EbookInfo;
    },

    updateEbook: async (bookId: number, data: EbookUpdateRequest): Promise<EbookInfo> => {
        const response = await axiosInstance.put<ApiResponse<EbookInfo>>(`/api/admin/books/${bookId}/ebook`, data);
        return response.data.data as EbookInfo;
    },

    deleteEbook: async (bookId: number): Promise<void> => {
        await axiosInstance.delete(`/api/admin/books/${bookId}/ebook`);
    },
};
