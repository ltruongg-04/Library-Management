import { z } from 'zod'

// 📝 Định nghĩa validation schema cho form login
export const loginSchema = z.object({
  email: z
    .string()
    .email('Email không hợp lệ'),
  password: z
    .string()
    .min(6, 'Mật khẩu tối thiểu 6 ký tự'),
  rememberMe: z.boolean().optional(),
})

// 🔑 Lấy type từ schema để dùng với TypeScript
export type LoginFormData = z.infer<typeof loginSchema>

// 📝 Định nghĩa validation schema cho form đăng ký
export const registerSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Họ và tên tối thiểu 2 ký tự')
    .max(100, 'Họ và tên tối đa 100 ký tự'),
  phoneNumber: z
    .string()
    .regex(/^[0-9]{10}$/, 'Số điện thoại phải là 10 chữ số'),
  email: z
    .string()
    .email('Email không hợp lệ'),
  password: z
    .string()
    .min(6, 'Mật khẩu tối thiểu 6 ký tự')
    .regex(/[A-Z]/, 'Mật khẩu phải chứa ít nhất 1 chữ hoa')
    .regex(/[0-9]/, 'Mật khẩu phải chứa ít nhất 1 chữ số'),
  confirmPassword: z
    .string()
    .min(6, 'Xác nhận mật khẩu tối thiểu 6 ký tự'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu không khớp',
  path: ['confirmPassword'],
})

// 🔑 Lấy type từ schema để dùng với TypeScript
export type RegisterFormData = z.infer<typeof registerSchema>
