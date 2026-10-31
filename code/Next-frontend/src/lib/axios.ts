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

let cachedSessionToken: { token: string | null; expiresAt: number } | null = null;
let pendingSessionPromise: Promise<string | null> | null = null;

export function invalidateAuthTokenCache() {
    cachedSessionToken = null;
    pendingSessionPromise = null;
}

export async function getAuthToken(): Promise<string | null> {
    const now = Date.now();
    if (cachedSessionToken && cachedSessionToken.expiresAt > now) {
        return cachedSessionToken.token;
    }

    if (!pendingSessionPromise) {
        pendingSessionPromise = getSession()
            .then((session) => {
                const token = session?.backendToken || null;
                cachedSessionToken = {
                    token,
                    expiresAt: Date.now() + 10_000, // cache for 10 seconds to avoid spamming /api/auth/session
                };
                return token;
            })
            .catch(() => null)
            .finally(() => {
                pendingSessionPromise = null;
            });
    }

    return pendingSessionPromise;
}

// Thêm interceptor cho request để tự động gắn token
axiosInstance.interceptors.request.use(
    async (config) => {
        // Chỉ tự động lấy session trên client side
        // Trên server side (Server Components), cần truyền token thủ công hoặc tạo một instance riêng
        if (typeof window !== "undefined") {
            if (isPublicEndpoint(config.url)) {
                return config;
            }
            const token = await getAuthToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
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
        const originalRequest = error.config;
        const isAuthError =
            typeof window !== "undefined" && error.response?.status === 401 && !isPublicEndpoint(originalRequest?.url) && !isCaptchaError(error);

        if (isAuthError && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;
            invalidateAuthTokenCache();

            // Thử lấy token mới (getSession() sẽ kích hoạt refreshAccessToken trong NextAuth)
            const newToken = await getAuthToken();
            const currentAuth = originalRequest.headers?.Authorization?.toString() || "";
            const currentToken = currentAuth.startsWith("Bearer ") ? currentAuth.slice(7) : currentAuth;

            if (newToken && newToken !== currentToken) {
                originalRequest.headers = originalRequest.headers || {};
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return axiosInstance(originalRequest);
            }

            // Nếu refresh không thành công hoặc phiên thực sự bị hủy
            const session = await getSession();
            if (session) {
                console.warn("Phiên đăng nhập hết hạn hoặc không hợp lệ, đang đăng xuất...");
                await signOut({ callbackUrl: "/login" });
            }
        }

        return Promise.reject(error);
    },
);

export default axiosInstance;
