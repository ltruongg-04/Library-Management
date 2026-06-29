// 📚 API Service cho Books

import type { Book, BookListItem } from '@/types/book';

// Response type từ backend
interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T | null;
    timestamp: string;
}

// Gọi qua Next.js proxy route (relative URL) để tránh CORS
const API_URL = '';

export const bookService = {
    async getBooks(params?: import('@/types/book').BookSearchParams): Promise<import('@/types/book').BookPageResponse> {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8081';
            const queryParams = new URLSearchParams();
            if (params?.keyword) queryParams.append('keyword', params.keyword);
            if (params?.category) queryParams.append('category', params.category);
            if (params?.page !== undefined) queryParams.append('page', params.page.toString());
            if (params?.size !== undefined) queryParams.append('size', params.size.toString());
            if (params?.sortBy) queryParams.append('sortBy', params.sortBy);

            const response = await fetch(`${baseUrl}/api/public/books?${queryParams.toString()}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            const result = await response.json();
            if (!response.ok || !result.success) throw new Error(result.message || "Lỗi");
            return result.data;
        } catch (e) { throw e; }
    },

    async getTrendingBooks(limit: number = 8): Promise<import('@/types/book').BookPageResponse> {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8081';
            const response = await fetch(`${baseUrl}/api/public/books/trending?limit=${limit}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            const result = await response.json();
            if (!response.ok || !result.success) throw new Error(result.message || "Lỗi");
            return result.data;
        } catch (e) { throw e; }
    },

    // 📖 Lấy danh sách top 10 sách đánh giá cao nhất
    async getTopRatedBooks(): Promise<BookListItem[]> {
        try {
            const response = await fetch(`${API_URL}/api/books/top-rated`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result: ApiResponse<BookListItem[]> = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Không thể lấy danh sách top sách');
            }

            return result.data || [];
        } catch (error) {
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra backend đang chạy.');
            }
            throw error;
        }
    },

    // 📖 Lấy chi tiết 1 cuốn sách theo ID
    async getBookById(id: number): Promise<Book> {
        try {
            const response = await fetch(`${API_URL}/api/books/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result: ApiResponse<Book> = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Không tìm thấy sách');
            }

            if (!result.data) {
                throw new Error('Không tìm thấy sách');
            }

            return result.data;
        } catch (error) {
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra backend đang chạy.');
            }
            throw error;
        }
    },

    // 📖 Lấy danh sách sách cho Admin Inventory (có phân trang)
    async getAdminBookInventory(page: number = 0, size: number = 10, keyword?: string, category?: string): Promise<import('@/types/book').PageResponse<BookListItem>> {
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                size: size.toString(),
            });
            if (keyword) queryParams.append('keyword', keyword);
            if (category && category !== 'All') queryParams.append('categoryId', category);

            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8081';
            const response = await fetch(`${baseUrl}/api/admin/books?${queryParams.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Không thể lấy danh sách kho sách');
            }

            const result: import('@/types/book').PageResponse<BookListItem> = await response.json();
            return result;
        } catch (error) {
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra backend đang chạy.');
            }
            throw error;
        }
    },

    // 📖 Cập nhật thông tin sách
    async updateBook(id: number, data: import('@/types/book').BookUpdateRequest): Promise<Book> {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8081';
            const response = await fetch(`${baseUrl}/api/admin/books/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result: ApiResponse<Book> | Book = await response.json();

            if (!response.ok) {
                throw new Error('Không thể cập nhật sách');
            }

            if ((result as Book).id) {
                return result as Book;
            }

            return (result as ApiResponse<Book>).data as Book;
        } catch (error) {
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra backend đang chạy.');
            }
            throw error;
        }
    },

    // 📖 Tạo sách mới
    async createBook(data: import('@/types/book').BookCreateRequest): Promise<Book> {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8081';
            const response = await fetch(`${baseUrl}/api/admin/books`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            let result: any;
            try {
                result = await response.json();
            } catch (e) {
                throw new Error('Lỗi phản hồi từ máy chủ');
            }

            if (!response.ok) {
                const msg = result?.message || result?.error || 'Không thể tạo sách mới (Lỗi máy chủ)';
                throw new Error(msg);
            }

            if (result.id) {
                return result as Book;
            }

            return result.data as Book;
        } catch (error: any) {
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra backend đang chạy.');
            }
            throw error;
        }
    },
};
