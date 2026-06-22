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

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

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

      // 💾 Lưu token sau khi đăng ký thành công
      if (result.data?.token) {
        authService.saveToken(result.data.token)
      }

      return result.data!
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra backend đang chạy.')
      }
      throw error
    }
  },
  // 🌐 Google Login (NextAuth)
  async loginWithGoogle(callbackUrl = '/') {
    const { signIn } = await import('next-auth/react')
    return signIn('google', { callbackUrl })
  },

  // 🔓 Login - Đăng nhập
  async login(email: string, password: string, rememberMe?: boolean) {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const result: ApiResponse<LoginResponse> = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Email hoặc mật khẩu không đúng')
      }

      const loginData = result.data!

      // 💾 Lưu token
      authService.saveToken(loginData.token)

      return {
        id: String(loginData.user.id),
        email: loginData.user.email,
        fullName: loginData.user.fullName,
        role: loginData.user.role.toLowerCase(),
      }
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra backend đang chạy.')
      }
      throw error
    }
  },

  // 🚪 Logout - Đăng xuất
  logout() {
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
  },

  // 🔑 Get Token
  getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('authToken')
  },

  // 💾 Save Token
  saveToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token)
    }
  },

  // ✅ Check if logged in
  isAuthenticated(): boolean {
    return !!authService.getToken()
  },
}
