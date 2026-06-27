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
  // 📖 Lấy danh sách tất cả sách
  async getBooks(): Promise<BookListItem[]> {
    try {
      const response = await fetch(`${API_URL}/api/books`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result: ApiResponse<BookListItem[]> = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Không thể lấy danh sách sách');
      }

      return result.data || [];
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra backend đang chạy.');
      }
      throw error;
    }
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
  async getAdminBookInventory(page: number = 0, size: number = 10, keyword?: string, status?: string, category?: string): Promise<import('@/types/book').PageResponse<BookListItem>> {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
      });
      if (keyword) queryParams.append('keyword', keyword);
      if (status && status !== 'All') queryParams.append('status', status);
      if (category && category !== 'All') queryParams.append('categoryId', category);

      // Note: In real app, this goes to backend (e.g. `http://localhost:8080/api/admin/books`)
      // Using Next.js rewrites or hardcoded URL depending on env
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const response = await fetch(`${baseUrl}/api/admin/books?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Không thể lấy danh sách kho sách');
      }

      // Backend trả về trực tiếp đối tượng Page<?>
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
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
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

      // Backend trả về thẳng BookResponse hoặc ApiResponse tuỳ cấu trúc
      // Nếu có field 'id' ngay ở root thì nó là BookResponse
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
};
