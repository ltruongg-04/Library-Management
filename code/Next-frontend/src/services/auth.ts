import { API_ERRORS } from "@/constants/ui-text/shared/api";
import axiosInstance from "@/lib/axios";
import { getErrorMessage } from "@/lib/utils";
import { ApiResponse } from "@/types/api";

// 🔐 API Service cho authentication

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

interface ChangePasswordRequestData {
    currentPassword?: string;
    newPassword?: string;
    [key: string]: unknown;
}

export const authService = {
    // 📝 Register - Đăng ký
    async register(data: RegisterRequestData): Promise<RegisterResponseData> {
        try {
            const response = await axiosInstance.post<ApiResponse<RegisterResponseData>>("/api/auth/register", data);
            const result = response.data;
            if (!result.success || !result.data) {
                throw new Error(result.message || API_ERRORS.REGISTER_FAILED);
            }
            return result.data;
        } catch (error: unknown) {
            throw new Error(getErrorMessage(error, API_ERRORS.REGISTER_FAILED));
        }
    },

    async activate(data: { token: string }): Promise<void> {
        try {
            const response = await axiosInstance.post<ApiResponse<null>>("/api/auth/activate", data);
            const result = response.data;
            if (!result.success) {
                throw new Error(result.message || API_ERRORS.ACTIVATE_FAILED);
            }
        } catch (error: unknown) {
            throw new Error(getErrorMessage(error, API_ERRORS.ACTIVATE_FAILED));
        }
    },

    async resendActivation(data: { email: string }): Promise<void> {
        try {
            const response = await axiosInstance.post<ApiResponse<null>>("/api/auth/resend-activation", data);
            const result = response.data;
            if (!result.success) {
                throw new Error(result.message || API_ERRORS.RESEND_ACTIVATION_FAILED);
            }
        } catch (error: unknown) {
            throw new Error(getErrorMessage(error, API_ERRORS.RESEND_ACTIVATION_FAILED));
        }
    },

    // 🔒 Đổi mật khẩu
    async changePassword(data: ChangePasswordRequestData): Promise<void> {
        try {
            const response = await axiosInstance.put<ApiResponse<null>>("/api/auth/change-password", data);
            const result = response.data;
            if (!result.success) {
                throw new Error(result.message || API_ERRORS.CHANGE_PASSWORD_FAILED);
            }
        } catch (error: unknown) {
            throw new Error(getErrorMessage(error, API_ERRORS.CHANGE_PASSWORD_FAILED));
        }
    },

    // 📩 Quên mật khẩu - Yêu cầu gửi OTP
    async forgotPassword(data: { email: string }): Promise<void> {
        try {
            const response = await axiosInstance.post<ApiResponse<null>>("/api/auth/forgot-password", data);
            const result = response.data;
            if (!result.success) {
                throw new Error(result.message || API_ERRORS.FORGOT_PASSWORD_FAILED);
            }
        } catch (error: unknown) {
            throw new Error(getErrorMessage(error, API_ERRORS.FORGOT_PASSWORD_FAILED));
        }
    },

    // 🔍 Xác thực OTP
    async verifyOtp(data: { email: string; otp: string }): Promise<{ resetToken: string }> {
        try {
            const response = await axiosInstance.post<ApiResponse<{ resetToken: string }>>("/api/auth/verify-otp", data);
            const result = response.data;
            if (!result.success || !result.data) {
                throw new Error(result.message || API_ERRORS.VERIFY_OTP_FAILED);
            }
            return result.data;
        } catch (error: unknown) {
            throw new Error(getErrorMessage(error, API_ERRORS.VERIFY_OTP_FAILED));
        }
    },

    // 🔐 Đặt lại mật khẩu (với Hash Token)
    async resetPassword(data: { resetToken: string; newPassword: string }): Promise<void> {
        try {
            const response = await axiosInstance.post<ApiResponse<null>>("/api/auth/reset-password", data);
            const result = response.data;
            if (!result.success) {
                throw new Error(result.message || API_ERRORS.RESET_PASSWORD_FAILED);
            }
        } catch (error: unknown) {
            throw new Error(getErrorMessage(error, API_ERRORS.RESET_PASSWORD_FAILED));
        }
    },
};
