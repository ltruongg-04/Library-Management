import type { BookCopy, BookCopyUpdateRequest } from '@/types/book-copy';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  timestamp: string;
}

export const bookCopyService = {
  // Lấy danh sách bản sao của 1 đầu sách
  async getCopiesByBookId(bookId: number): Promise<BookCopy[]> {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const response = await fetch(`${baseUrl}/api/admin/books/${bookId}/copies`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Không thể lấy danh sách bản sao sách');
      }

      // Tùy theo cấu trúc trả về, ta có thể cần parse ApiResponse
      const result = await response.json();
      if (result.data !== undefined) {
        return result.data as BookCopy[];
      }
      return result as BookCopy[];
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // Thêm mới 1 bản sao
  async addCopy(bookId: number): Promise<BookCopy> {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const response = await fetch(`${baseUrl}/api/admin/books/${bookId}/copies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Không thể thêm bản sao sách mới');
      }

      const result = await response.json();
      if (result.data !== undefined) {
        return result.data as BookCopy;
      }
      return result as BookCopy;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // Cập nhật trạng thái/ghi chú bản sao
  async updateCopy(copyId: number, data: BookCopyUpdateRequest): Promise<BookCopy> {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const response = await fetch(`${baseUrl}/api/admin/books/copies/${copyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Không thể cập nhật bản sao sách');
      }

      const result = await response.json();
      if (result.data !== undefined) {
        return result.data as BookCopy;
      }
      return result as BookCopy;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // Xóa bản sao
  async deleteCopy(copyId: number): Promise<void> {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const response = await fetch(`${baseUrl}/api/admin/books/copies/${copyId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Không thể xóa bản sao sách');
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
};
