import axios from "axios";
import { getSession, signOut } from "next-auth/react";

const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL || "";

const resolveApiUrl = () => {
    if (typeof window === "undefined") {
        return process.env.BACKEND_INTERNAL_URL || configuredApiUrl || "http://127.0.0.1:8081";
    }

    if (!configuredApiUrl) {
        return "";
    }

    try {
        const apiUrl = new URL(configuredApiUrl);
        const isLocalBackend = ["localhost", "127.0.0.1"].includes(apiUrl.hostname);
        const isLocalFrontend = ["localhost", "127.0.0.1"].includes(window.location.hostname);

        return isLocalBackend && !isLocalFrontend ? "" : configuredApiUrl;
    } catch {
        return configuredApiUrl;
    }
};

export const axiosInstance = axios.create({
    baseURL: resolveApiUrl(),
    headers: {
        "Content-Type": "application/json",
    },
});

// Thêm interceptor cho request để tự động gắn token
axiosInstance.interceptors.request.use(
    async (config) => {
        // Chỉ tự động lấy session trên client side
        // Trên server side (Server Components), cần truyền token thủ công hoặc tạo một instance riêng
        if (typeof window !== "undefined") {
            const session = await getSession();
            if (session?.backendToken) {
                config.headers.Authorization = `Bearer ${session.backendToken}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// Thêm interceptor cho response để xử lý lỗi chung (như 401 Unauthorized)
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Automatically sign out user on 401 Unauthorized (invalid/expired token)
        if (typeof window !== "undefined" && error.response?.status === 401 && !error.config.url?.includes("/api/auth/")) {
            console.warn("Session expired or invalid, logging out...");
            signOut({ callbackUrl: "/login" });
        }

        // Có thể xử lý refresh token ở đây nếu cần gọi api trực tiếp qua axios thay vì NextAuth
        // Tuy nhiên NextAuth đang xử lý refresh token trong callbacks.jwt rồi.
        return Promise.reject(error);
    },
);

export default axiosInstance;
