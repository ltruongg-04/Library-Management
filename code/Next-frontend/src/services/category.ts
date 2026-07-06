import { API_ERRORS } from "@/constants/ui-text/shared/api";
import axiosInstance from "@/lib/axios";
import type { Category, CategoryRequest } from "@/types/category";

export const categoryService = {
    getAllCategories: async (): Promise<Category[]> => {
        const response = await axiosInstance.get(`/api/categories`);
        const result = response.data;
        if (!result.success) throw new Error(result.message || API_ERRORS.CATEGORY_LOAD_FAILED);
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
    },
};
