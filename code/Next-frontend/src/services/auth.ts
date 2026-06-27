import axiosInstance from "@/lib/axios";

// 🔐 API Service cho authentication

// 📦 Response types
interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T | null;
    timestamp: string;
}

interface RegisterResponseData {
    id: number;
    fullName: string;
    email: string;
    phone: string | null;
    role: string;
    token: string;
    createdAt: string;
}

// 📝 Request types
interface RegisterRequestData {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
}

export const authService = {
    // 📝 Register - Đăng ký
    async register(data: RegisterRequestData): Promise<RegisterResponseData> {
        try {
            const response = await axiosInstance.post<ApiResponse<RegisterResponseData>>("/api/auth/register", data);

            const result = response.data;

            if (!result.success) {
                throw new Error(result.message || "Đăng ký thất bại");
            }

            return result.data!;
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            if (error.code === "ECONNABORTED" || error.message === "Network Error") {
                throw new Error("Không thể kết nối đến server. Vui lòng kiểm tra backend đang chạy.");
            }
            throw error;
        }
    },
};
