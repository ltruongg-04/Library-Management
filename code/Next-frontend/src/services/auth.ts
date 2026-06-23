// 🔐 API Service cho authentication

// 📦 Response types
interface ApiResponse<T> {
  success: boolean
  message: string
  data: T | null
  timestamp: string
}

interface RegisterResponseData {
  id: number
  fullName: string
  email: string
  phone: string | null
  role: string
  token: string
  createdAt: string
}

interface LoginResponse {
  token: string
  user: {
    id: number
    email: string
    fullName: string
    role: string
  }
}

// 📝 Request types
interface RegisterRequestData {
  fullName: string
  email: string
  password: string
  phone?: string
}

// Client-side: gọi qua Next.js proxy (relative URL) để tránh CORS
// Server-side (NextAuth callback): dùng NEXT_PUBLIC_API_URL trực tiếp
const API_URL = ''

// 🧪 MOCK DATA - Xóa khi có API thực
const MOCK_USER = {
  id: '1',
  email: 'user@example.com',
  fullName: 'Nguyễn Văn A',
  role: 'admin',
}

export const authService = {
  // 📝 Register - Đăng ký
  async register(data: RegisterRequestData): Promise<RegisterResponseData> {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result: ApiResponse<RegisterResponseData> = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Đăng ký thất bại')
      }

      return result.data!
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra backend đang chạy.')
      }
      throw error
    }
  }
}
