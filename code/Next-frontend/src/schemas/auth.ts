import { z } from "zod";
import { AUTH_VALIDATION } from "@/constants/ui-text/public/auth";

// 📝 Định nghĩa validation schema cho form login
export const loginSchema = z.object({
    email: z.string().email(AUTH_VALIDATION.EMAIL_INVALID),
    password: z.string().min(6, AUTH_VALIDATION.PASSWORD_MIN),
    rememberMe: z.boolean().optional(),
});

// 🔑 Lấy type từ schema để dùng với TypeScript
export type LoginFormData = z.infer<typeof loginSchema>;

// 📝 Định nghĩa validation schema cho form đăng ký
export const registerSchema = z
    .object({
        fullName: z.string().min(2, AUTH_VALIDATION.FULLNAME_MIN).max(100, AUTH_VALIDATION.FULLNAME_MAX),
        phoneNumber: z.string().regex(/^[0-9]{10}$/, AUTH_VALIDATION.PHONE_INVALID),
        email: z.string().email(AUTH_VALIDATION.EMAIL_INVALID),
        password: z
            .string()
            .min(6, AUTH_VALIDATION.PASSWORD_MIN)
            .regex(/[A-Z]/, AUTH_VALIDATION.PASSWORD_UPPERCASE)
            .regex(/[0-9]/, AUTH_VALIDATION.PASSWORD_NUMBER),
        confirmPassword: z.string().min(6, AUTH_VALIDATION.CONFIRM_PASSWORD_MIN),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: AUTH_VALIDATION.PASSWORD_MISMATCH,
        path: ["confirmPassword"],
    });

// 🔑 Lấy type từ schema để dùng với TypeScript
export type RegisterFormData = z.infer<typeof registerSchema>;
