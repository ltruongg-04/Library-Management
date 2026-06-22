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
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

// 📌 Create Auth Context with default undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// 🏗️ Auth Provider Component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession()
  const [manualUser, setManualUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // 🔄 Sync user from NextAuth session (Google login)
  const googleUser: User | null = session?.user
    ? {
      id: (session.user as typeof session.user & { id?: string }).id ?? session.user.email ?? '',
      email: session.user.email ?? '',
      fullName: session.user.name ?? '',
      role: 'user', // Google users mặc định là 'user'
      image: session.user.image ?? undefined,
    }
    : null

  // 🔄 Khởi tạo từ token lưu sẵn (email/password login)
  useEffect(() => {
    try {
      if (authService.isAuthenticated() && !session) {
        // 🧪 MOCK: Set mock user nếu có token local
        setManualUser({
          id: '1',
          email: 'user@example.com',
          fullName: 'Nguyễn Văn A',
          role: 'admin',
        })
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
