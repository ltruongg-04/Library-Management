import { API_ERRORS } from "@/constants/ui-text/shared/api";
import axiosInstance from "@/lib/axios";
import type { Tag } from "@/types/tag";

export const tagService = {
    getAllTags: async (): Promise<Tag[]> => {
        const response = await axiosInstance.get(`/api/public/tags`);
        const result = response.data;
        if (!result.success) throw new Error(result.message || API_ERRORS.FETCH_TAGS_ERROR);
        return result.data;
    },
};
