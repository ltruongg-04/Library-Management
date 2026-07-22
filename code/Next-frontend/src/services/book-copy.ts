import axiosInstance from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { BookCopy, BookCopyUpdateRequest } from "@/types/book-copy";

export const bookCopyService = {
    // Lấy danh sách bản sao của 1 đầu sách
    async getCopiesByBookId(bookId: number): Promise<BookCopy[]> {
        const response = await axiosInstance.get<ApiResponse<BookCopy[]> | BookCopy[]>(`/api/admin/books/${bookId}/copies`);
        const result = response.data;
        if ("data" in result && result.data !== undefined) {
            return result.data ?? [];
        }
        return (result as BookCopy[]) ?? [];
    },

    // Thêm mới nhiều bản sao
    async addCopy(bookId: number, quantity: number = 1): Promise<BookCopy[]> {
        const response = await axiosInstance.post<ApiResponse<BookCopy[]> | BookCopy[]>(`/api/admin/books/${bookId}/copies?quantity=${quantity}`);
        const result = response.data;
        if ("data" in result && result.data !== undefined) {
            return result.data ?? [];
        }
        return (result as BookCopy[]) ?? [];
    },

    // Cập nhật trạng thái/ghi chú bản sao
    async updateCopy(copyId: number, data: BookCopyUpdateRequest): Promise<BookCopy> {
        const response = await axiosInstance.put<ApiResponse<BookCopy> | BookCopy>(`/api/admin/books/copies/${copyId}`, data);
        const result = response.data;
        if ("data" in result && result.data !== undefined) {
            return result.data!;
        }
        return result as BookCopy;
    },

    // Xóa bản sao
    async deleteCopy(copyId: number): Promise<void> {
        await axiosInstance.delete(`/api/admin/books/copies/${copyId}`);
    },
};
