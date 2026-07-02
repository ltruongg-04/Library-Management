import axiosInstance from "@/lib/axios";
import type { Book, BookListItem, BookPageResponse, BookSearchParams } from "@/types/book";

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T | null;
    timestamp: string;
}

async function requestPublicBooksApi<T>(url: string, signal?: AbortSignal): Promise<T> {
    const response = await fetch(url, {
        signal,
        headers: {
            "Content-Type": "application/json",
        },
    });

    const result = (await response.json()) as ApiResponse<T>;

    if (!response.ok || !result.success) {
        throw new Error(result.message || "Không thể tải dữ liệu sách");
    }

    if (!result.data) {
        throw new Error("Không tìm thấy dữ liệu sách");
    }

    return result.data;
}

export const bookService = {
    async getBooks(params?: BookSearchParams, signal?: AbortSignal): Promise<BookPageResponse> {
        const queryParams = new URLSearchParams();
        if (params?.keyword) queryParams.append("keyword", params.keyword);

        if (params?.category && params.category !== "Tất cả" && params.category !== "all") {
            queryParams.append("category", params.category);
        }

        if (params?.page !== undefined) queryParams.append("page", params.page.toString());
        if (params?.size !== undefined) queryParams.append("size", params.size.toString());
        if (params?.sortBy) queryParams.append("sortBy", params.sortBy);

        return requestPublicBooksApi<BookPageResponse>(`/api/books?${queryParams.toString()}`, signal);
    },

    async getTrendingBooks(limit: number = 8): Promise<BookPageResponse> {
        return requestPublicBooksApi<BookPageResponse>(`/api/books/trending?limit=${limit}`);
    },

    async getTopRatedBooks(): Promise<BookListItem[]> {
        return requestPublicBooksApi<BookListItem[]>("/api/books/top-rated");
    },

    async getBookById(id: number): Promise<Book> {
        return requestPublicBooksApi<Book>(`/api/books/${id}`);
    },

    async getAdminBookInventory(
        page: number = 0,
        size: number = 10,
        keyword?: string,
        category?: string,
    ): Promise<import("@/types/book").PageResponse<BookListItem>> {
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                size: size.toString(),
            });
            if (keyword) queryParams.append("keyword", keyword);
            if (category && category !== "All") queryParams.append("categoryId", category);

            const response = await axiosInstance.get(`/api/admin/books?${queryParams.toString()}`);
            return response.data;
        } catch (error) {
            if (error instanceof TypeError && error.message === "Failed to fetch") {
                throw new Error("Không thể kết nối đến server. Vui lòng kiểm tra backend đang chạy.");
            }
            throw error;
        }
    },

    async updateBook(id: number, data: import("@/types/book").BookUpdateRequest): Promise<Book> {
        try {
            const response = await axiosInstance.put(`/api/admin/books/${id}`, data);
            const result = response.data;

            if (result.id) {
                return result as Book;
            }

            return (result as ApiResponse<Book>).data as Book;
        } catch (error) {
            if (error instanceof TypeError && error.message === "Failed to fetch") {
                throw new Error("Không thể kết nối đến server. Vui lòng kiểm tra backend đang chạy.");
            }
            throw error;
        }
    },

    async createBook(data: import("@/types/book").BookCreateRequest): Promise<Book> {
        try {
            const response = await axiosInstance.post(`/api/admin/books`, data);
            const result = response.data;

            if (result.id) {
                return result as Book;
            }

            return result.data as Book;
        } catch (error: any) {
            if (error instanceof TypeError && error.message === "Failed to fetch") {
                throw new Error("Không thể kết nối đến server. Vui lòng kiểm tra backend đang chạy.");
            }
            throw error;
        }
    },
};
