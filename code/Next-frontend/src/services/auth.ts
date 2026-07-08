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
    token: string | null;
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

    async activate(data: { token: string }): Promise<void> {
        try {
            const response = await axiosInstance.post<ApiResponse<null>>("/api/auth/activate", data);

            const result = response.data;
            if (!result.success) {
                throw new Error(result.message || "Kích hoạt tài khoản thất bại");
            }
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw error;
        }
    },

    async resendActivation(data: { email: string }): Promise<void> {
        try {
            const response = await axiosInstance.post<ApiResponse<null>>("/api/auth/resend-activation", data);

            const result = response.data;
            if (!result.success) {
                throw new Error(result.message || "Gửi lại mã kích hoạt thất bại");
            }
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw error;
        }
    },

    // 🔒 Đổi mật khẩu
    async changePassword(data: any): Promise<void> {
        try {
            const response = await axiosInstance.put<ApiResponse<null>>("/api/auth/change-password", data);

            const result = response.data;
            if (!result.success) {
                throw new Error(result.message || "Đổi mật khẩu thất bại");
            }
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw error;
        }
    },

    // 📩 Quên mật khẩu - Yêu cầu gửi OTP
    async forgotPassword(data: { email: string }): Promise<void> {
        try {
            const response = await axiosInstance.post<ApiResponse<null>>("/api/auth/forgot-password", data);

            const result = response.data;
            if (!result.success) {
                throw new Error(result.message || "Yêu cầu gửi OTP thất bại");
            }
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw error;
        }
    },

    // 🔍 Xác thực OTP
    async verifyOtp(data: { email: string; otp: string }): Promise<{ resetToken: string }> {
        try {
            const response = await axiosInstance.post<ApiResponse<{ resetToken: string }>>("/api/auth/verify-otp", data);

            const result = response.data;
            if (!result.success || !result.data) {
                throw new Error(result.message || "Xác thực OTP thất bại");
            }
            return result.data;
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw error;
        }
    },

    // 🔐 Đặt lại mật khẩu (với Hash Token)
    async resetPassword(data: { resetToken: string; newPassword: string }): Promise<void> {
        try {
            const response = await axiosInstance.post<ApiResponse<null>>("/api/auth/reset-password", data);

            const result = response.data;
            if (!result.success) {
                throw new Error(result.message || "Đặt lại mật khẩu thất bại");
            }
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw error;
        }
    },
};
