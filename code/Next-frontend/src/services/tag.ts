import axiosInstance from "@/lib/axios";
import type { Tag } from "@/types/tag";

export const tagService = {
    getAllTags: async (): Promise<Tag[]> => {
        const response = await axiosInstance.get(`/api/public/tags`);
        const result = response.data;
        if (!result.success) throw new Error(result.message || "Failed to load tags");
        return result.data;
    },
};
