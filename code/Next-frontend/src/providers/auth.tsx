'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { authService } from '@/services/auth'

// 👤 User type definition
interface User {
  id: string
  email: string
  fullName: string
  role: string
  image?: string // Google avatar
}

// 🔑 Auth Context type
interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string, rememberMe?: boolean) => Promise<User>
  register: (fullName: string, email: string, password: string, phone?: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

// 📌 Create Auth Context with default undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// 🔒 Helper to parse JWT payload
function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (e) {
    return null
  }
}

// 🏗️ Auth Provider Component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession()
  const [manualUser, setManualUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // 🔄 Sync user from NextAuth session (Google login)
  const googleUser: User | null = session?.user
    ? {
      id: session.user.id ?? session.user.email ?? '',
      email: session.user.email ?? '',
      fullName: session.user.name ?? '',
      role: session.user.role ?? 'USER',
      image: session.user.image ?? undefined,
    }
    : null

  // 🔄 Khởi tạo từ token lưu sẵn (email/password login)
  useEffect(() => {
    try {
      const token = authService.getToken()
      if (token && !session) {
        const payload = parseJwt(token)
        if (payload) {
          // Token do backend tạo có subject là email, có role, userId, fullName
          setManualUser({
            id: String(payload.userId || payload.sub),
            email: payload.sub,
            fullName: payload.fullName || '',
            role: payload.role ? payload.role.toLowerCase() : 'user',
          })
        }
      }
    } catch (error) {
      console.error('Error checking authentication:', error)
    }
  }, [session])

  // Ưu tiên Google session, sau đó mới đến email/password user
  const user = googleUser ?? manualUser

  // 🔓 Email/Password Login
  const login = useCallback(async (email: string, password: string, rememberMe?: boolean) => {
    setIsLoading(true)
    try {
      const userData = await authService.login(email, password, rememberMe)
      setManualUser(userData)
      return userData
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 📝 Register function
  const register = useCallback(async (fullName: string, email: string, password: string, phone?: string) => {
    setIsLoading(true)
    try {
      const result = await authService.register({ fullName, email, password, phone })
      // Sau khi đăng ký thành công, set user từ response
      setManualUser({
        id: String(result.id),
        email: result.email,
        fullName: result.fullName,
        role: result.role,
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 🌐 Google Login
  const loginWithGoogle = useCallback(async () => {
    setIsLoading(true)
    try {
      await signIn('google', { callbackUrl: '/' })
    } catch (error) {
      console.error('Google login error:', error)
      setIsLoading(false)
    }
    // isLoading sẽ tự reset sau khi page redirect
  }, [])

  // 🚪 Logout — xử lý cả hai trường hợp
  const logout = useCallback(async () => {
    setIsLoading(true)
    try {
      authService.logout() // Xóa token email/password
      setManualUser(null)
      if (session) {
        await signOut({ callbackUrl: '/' }) // Xóa NextAuth session
      } else {
        window.location.href = '/' // Chuyển hướng về trang chủ đối với đăng nhập thủ công
      }
    } finally {
      setIsLoading(false)
    }
  }, [session])

  // 📦 Context value
  const value: AuthContextType = {
    user,
    isLoading: isLoading || status === 'loading',
    isAuthenticated: !!user,
    login,
    register,
    loginWithGoogle,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// 🎣 Custom Hook - useAuth
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
