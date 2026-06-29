// 📚 API Service cho Books
import axiosInstance from "@/lib/axios";
import type { Book, BookListItem } from "@/types/book";

// Response type từ backend
interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T | null;
    timestamp: string;
}

// Gọi qua Next.js proxy route (relative URL) để tránh CORS

export const bookService = {
    async getBooks(params?: import("@/types/book").BookSearchParams, signal?: AbortSignal): Promise<import("@/types/book").BookPageResponse> {
        try {
            // Call the admin paginated endpoint for server-side search and filtering
            const queryParams = new URLSearchParams();
            if (params?.keyword) queryParams.append("keyword", params.keyword);

            // Note: params.category contains category name for the public API
            if (params?.category && params.category !== "Tất cả" && params.category !== "all") {
                queryParams.append("category", params.category);
            }

            if (params?.page !== undefined) queryParams.append("page", params.page.toString());
            if (params?.size !== undefined) queryParams.append("size", params.size.toString());

            const response = await axiosInstance.get(`/api/books?${queryParams.toString()}`);
            const result = response.data;
            
            if (!result.success) {
                throw new Error(result.message || "Không thể lấy danh sách sách");
            }
            
            return result.data;
        } catch (e) {
            throw e;
        }
    },

    async getTrendingBooks(limit: number = 8): Promise<import("@/types/book").BookPageResponse> {
        try {
            const response = await axiosInstance.get(`/api/books/trending?limit=${limit}`);
            const result = response.data;

            if (!result.success) throw new Error(result.message || "Lỗi tải sách thịnh hành");

            return result.data;
        } catch (e) {
            throw e;
        }
    },

    // 📖 Lấy danh sách top 10 sách đánh giá cao nhất
    async getTopRatedBooks(): Promise<BookListItem[]> {
        try {
            const response = await axiosInstance.get(`/api/books/top-rated`);
            const result: ApiResponse<BookListItem[]> = response.data;

            if (!result.success) {
                throw new Error(result.message || "Không thể lấy danh sách top sách");
            }

            return result.data || [];
        } catch (error) {
            if (error instanceof TypeError && error.message === "Failed to fetch") {
                throw new Error("Không thể kết nối đến server. Vui lòng kiểm tra backend đang chạy.");
            }
            throw error;
        }
    },

    // 📖 Lấy chi tiết 1 cuốn sách theo ID
    async getBookById(id: number): Promise<Book> {
        try {
            const response = await axiosInstance.get(`/api/books/${id}`);
            const result: ApiResponse<Book> = response.data;

            if (!result.success) {
                throw new Error(result.message || "Không tìm thấy sách");
            }

            if (!result.data) {
                throw new Error("Không tìm thấy sách");
            }

            return result.data;
        } catch (error) {
            if (error instanceof TypeError && error.message === "Failed to fetch") {
                throw new Error("Không thể kết nối đến server. Vui lòng kiểm tra backend đang chạy.");
            }
            throw error;
        }
    },

    // 📖 Lấy danh sách sách cho Admin Inventory (có phân trang)
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

    // 📖 Cập nhật thông tin sách
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

    // 📖 Tạo sách mới
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
