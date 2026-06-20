'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { authService } from '@/services/auth'

// 👤 User type definition
interface User {
  id: string
  email: string
  fullName: string
  role: string
}

// 🔑 Auth Context type
interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  logout: () => Promise<void>
}

// 📌 Create Auth Context with default undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// 🏗️ Auth Provider Component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // 🔄 Check if user is already logged in (on mount)
  useEffect(() => {
    try {
      if (authService.isAuthenticated()) {
        // 🧪 MOCK: Set mock user if token exists
        setUser({
          id: '1',
          email: 'user@example.com',
          fullName: 'Nguyễn Văn A',
          role: 'admin',
        })
      }
    } catch (error) {
      console.error('Error checking authentication:', error)
    }
    setIsMounted(true)
  }, [])

  // 🔓 Login function
  const login = useCallback(async (email: string, password: string, rememberMe?: boolean) => {
    setIsLoading(true)
    try {
      const userData = await authService.login(email, password, rememberMe)
      setUser(userData)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 🚪 Logout function
  const logout = useCallback(async () => {
    setIsLoading(true)
    try {
      authService.logout()
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 📦 Context value
  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
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
