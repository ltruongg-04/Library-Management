import { API_ERRORS } from "@/constants/ui-text/shared/api";
import axiosInstance from "@/lib/axios";
import type { Author, AuthorRequest } from "@/types/author";

export const authorService = {
    getAllAuthors: async (): Promise<Author[]> => {
        const response = await axiosInstance.get(`/api/authors`);
        const result = response.data;
        if (!result.success) throw new Error(result.message || API_ERRORS.FETCH_AUTHORS_ERROR);
        return result.data;
    },

    createAuthor: async (data: AuthorRequest): Promise<Author> => {
        const response = await axiosInstance.post(`/api/admin/authors`, data);
        return response.data;
    },

    updateAuthor: async (id: number, data: AuthorRequest): Promise<Author> => {
        const response = await axiosInstance.put(`/api/admin/authors/${id}`, data);
        return response.data;
    },

    deleteAuthor: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/api/admin/authors/${id}`);
    },
};
