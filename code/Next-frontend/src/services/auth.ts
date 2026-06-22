// 🔐 API Service cho authentication

interface LoginResponse {
  token: string
  refreshToken: string
  user: {
    id: string
    email: string
    fullName: string
    role: string
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

// 🧪 MOCK DATA - Xóa khi có API thực
const MOCK_USER = {
  id: '1',
  email: 'user@example.com',
  fullName: 'Nguyễn Văn A',
  role: 'admin',
}

export const authService = {
  // 🌐 Google Login (NextAuth)
  async loginWithGoogle(callbackUrl = '/') {
    const { signIn } = await import('next-auth/react')
    return signIn('google', { callbackUrl })
  },

  // 🔓 Login - Đăng nhập
  async login(email: string, password: string, rememberMe?: boolean) {
    try {
      // ⏳ Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      // 🧪 MOCK: Kiểm tra email/password đơn giản
      if (email === 'user@example.com' && password === '123456') {
        const mockToken = 'mock_token_' + Date.now()
        const mockRefreshToken = 'mock_refresh_token_' + Date.now()

        // 💾 Save tokens
        authService.saveToken(mockToken)
        localStorage.setItem('refreshToken', mockRefreshToken)

        return MOCK_USER
      } else {
        throw new Error('Email hoặc mật khẩu không đúng')
      }

      // 📡 Thực tế: fetch từ API thực
      /*
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, rememberMe }),
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data: LoginResponse = await response.json()

      // 💾 Save tokens
      authService.saveToken(data.token)
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken)
      }

      return data.user
      */
    } catch (error) {
      console.error('Login error:', error)
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
