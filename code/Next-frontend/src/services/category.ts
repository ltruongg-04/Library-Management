import type { Category, CategoryRequest } from '@/types/category';
import axiosInstance from '@/lib/axios';

export const categoryService = {
  getAllCategories: async (): Promise<Category[]> => {
    const response = await axiosInstance.get(`/api/categories`);
    const result = response.data;
    if (!result.success) throw new Error(result.message || "Lỗi tải danh mục");
    return result.data;
  },

  createCategory: async (data: CategoryRequest): Promise<Category> => {
    const response = await axiosInstance.post(`/api/admin/categories`, data);
    return response.data;
  },

  updateCategory: async (id: number, data: CategoryRequest): Promise<Category> => {
    const response = await axiosInstance.put(`/api/admin/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/api/admin/categories/${id}`);
  }
};
