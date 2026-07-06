import axiosInstance from "@/lib/axios";

export const fileService = {
    uploadFile: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axiosInstance.post("/api/files/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data.url;
    },
    uploadFileFromUrl: async (url: string): Promise<string> => {
        const response = await axiosInstance.post("/api/files/upload-url", { url });
        return response.data.url;
    },
};
