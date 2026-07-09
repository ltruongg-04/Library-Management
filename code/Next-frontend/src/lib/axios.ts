import axios from "axios";
import { getSession, signOut } from "next-auth/react";
import { getClientApiBaseUrl } from "@/config/env";

export const axiosInstance = axios.create({
    baseURL: getClientApiBaseUrl(),
    headers: {
        "Content-Type": "application/json",
    },
});

const PUBLIC_ENDPOINTS = ["/api/auth/", "/api/public/"];

const isPublicEndpoint = (url?: string): boolean => {
    if (!url) {
        return false;
    }

    return PUBLIC_ENDPOINTS.some((endpoint) => url.includes(endpoint));
};

const isCaptchaError = (error: unknown): boolean => {
    if (!axios.isAxiosError(error)) {
        return false;
    }

    const message = error.response?.data?.message;
    return typeof message === "string" && message.toLowerCase().includes("captcha");
};

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
    async (error) => {
        const shouldSignOut = typeof window !== "undefined" && error.response?.status === 401 && !isPublicEndpoint(error.config?.url) && !isCaptchaError(error);

        if (shouldSignOut) {
            const session = await getSession();
            if (session) {
                console.warn("Phiên đăng nhập hết hạn hoặc không hợp lệ, đang đăng xuất...");
                await signOut({ callbackUrl: "/login" });
            }
        }

        // Có thể xử lý refresh token ở đây nếu cần gọi api trực tiếp qua axios thay vì NextAuth
        // Tuy nhiên NextAuth đang xử lý refresh token trong callbacks.jwt rồi.
        return Promise.reject(error);
    },
);

export default axiosInstance;
