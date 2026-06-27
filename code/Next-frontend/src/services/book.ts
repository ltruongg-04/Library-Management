import axios from "axios";
import type { BookPageResponse, Book, BookSearchParams } from "@/types/book";

// 📦 API Response type (khớp với ApiResponse<T> từ backend)
interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T | null;
    timestamp: string;
}

export const bookService = {
    /**
     * Lấy danh sách sách (có phân trang, tìm kiếm, lọc category)
     * GET /api/public/books
     */
    async getBooks(params?: BookSearchParams): Promise<BookPageResponse> {
        try {
            const response = await axios.get<ApiResponse<BookPageResponse>>("/api/public/books", {
                params: {
                    keyword: params?.keyword || undefined,
                    category: params?.category || undefined,
                    page: params?.page ?? 0,
                    size: params?.size ?? 12,
                    sortBy: params?.sortBy ?? "newest",
                },
            });

            const result = response.data;

            if (!result.success || !result.data) {
                throw new Error(result.message || "Không thể lấy danh sách sách");
            }

            return result.data;
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            if (error.code === "ECONNABORTED" || error.message === "Network Error") {
                throw new Error("Không thể kết nối đến server. Vui lòng kiểm tra backend đang chạy.");
            }
            throw error;
        }
    },

    /**
     * Lấy chi tiết một cuốn sách
     * GET /api/public/books/{id}
     */
    async getBookById(id: number): Promise<Book> {
        try {
            const response = await axios.get<ApiResponse<Book>>(`/api/public/books/${id}`);

            const result = response.data;

            if (!result.success || !result.data) {
                throw new Error(result.message || "Không tìm thấy sách");
            }

            return result.data;
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            if (error.code === "ECONNABORTED" || error.message === "Network Error") {
                throw new Error("Không thể kết nối đến server. Vui lòng kiểm tra backend đang chạy.");
            }
            throw error;
        }
    },

    /**
     * Lấy sách thịnh hành (mới nhất)
     * GET /api/public/books/trending
     */
    async getTrendingBooks(limit: number = 8): Promise<BookPageResponse> {
        try {
            const response = await axios.get<ApiResponse<BookPageResponse>>("/api/public/books/trending", {
                params: { limit },
            });

            const result = response.data;

            if (!result.success || !result.data) {
                throw new Error(result.message || "Không thể lấy sách thịnh hành");
            }

            return result.data;
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            if (error.code === "ECONNABORTED" || error.message === "Network Error") {
                throw new Error("Không thể kết nối đến server. Vui lòng kiểm tra backend đang chạy.");
            }
            throw error;
        }
    },
};
