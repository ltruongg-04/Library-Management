import type { Category, CategoryRequest } from '@/types/category';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8081';

export const categoryService = {
  getAllCategories: async (): Promise<Category[]> => {
    const response = await fetch(`${API_URL}/api/admin/categories`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },

  createCategory: async (data: CategoryRequest): Promise<Category> => {
    const response = await fetch(`${API_URL}/api/admin/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create category');
    return response.json();
  },

  updateCategory: async (id: number, data: CategoryRequest): Promise<Category> => {
    const response = await fetch(`${API_URL}/api/admin/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update category');
    return response.json();
  },

  deleteCategory: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/api/admin/categories/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete category');
  }
};
