import axiosInstance from "@/lib/axios";
import type { Book } from "@/types/book";

export const favoriteService = {
    addFavorite: async (bookId: number): Promise<void> => {
        await axiosInstance.post(`/api/favourites/${bookId}`);
    },

    removeFavorite: async (bookId: number): Promise<void> => {
        await axiosInstance.delete(`/api/favourites/${bookId}`);
    },

    checkFavorite: async (bookId: number): Promise<boolean> => {
        const response = await axiosInstance.get(`/api/favourites/${bookId}/check`);
        return response.data;
    },

    getFavorites: async (page: number = 0, size: number = 10): Promise<{ content: Book[]; totalPages: number; totalElements: number }> => {
        const response = await axiosInstance.get(`/api/favourites`, { params: { page, size } });
        return response.data;
    },
};
