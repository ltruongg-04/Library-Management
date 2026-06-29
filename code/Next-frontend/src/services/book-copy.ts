import type { BookCopy, BookCopyUpdateRequest } from '@/types/book-copy';
import axiosInstance from '@/lib/axios';


export const bookCopyService = {
  // Lấy danh sách bản sao của 1 đầu sách
  async getCopiesByBookId(bookId: number): Promise<BookCopy[]> {
    try {
      const response = await axiosInstance.get(`/api/admin/books/${bookId}/copies`);
      const result = response.data;
      if (result.data !== undefined) {
        return result.data as BookCopy[];
      }
      return result as BookCopy[];
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // Thêm mới nhiều bản sao
  async addCopy(bookId: number, quantity: number = 1): Promise<BookCopy[]> {
    try {
      const response = await axiosInstance.post(`/api/admin/books/${bookId}/copies?quantity=${quantity}`);
      const result = response.data;
      if (result.data !== undefined) {
        return result.data as BookCopy[];
      }
      return result as BookCopy[];
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // Cập nhật trạng thái/ghi chú bản sao
  async updateCopy(copyId: number, data: BookCopyUpdateRequest): Promise<BookCopy> {
    try {
      const response = await axiosInstance.put(`/api/admin/books/copies/${copyId}`, data);
      const result = response.data;
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
      await axiosInstance.delete(`/api/admin/books/copies/${copyId}`);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
};
