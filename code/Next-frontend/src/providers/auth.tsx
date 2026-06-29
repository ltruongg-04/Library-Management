"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { authService } from "@/services/auth";

// 👤 User type definition
interface User {
    id: string;
    email: string;
    fullName: string;
    role: string;
    image?: string; // Google avatar
}

// 🔑 Auth Context type
interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string, rememberMe?: boolean) => Promise<User>;
    register: (fullName: string, email: string, password: string, phone?: string) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

// 📌 Create Auth Context with default undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 🏗️ Auth Provider Component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const { data: session, status } = useSession();

    const [isLoading, setIsLoading] = useState(false);

    // 🔄 Sync user from NextAuth session (Google login + Credentials)
    const user: User | null = useMemo(
        () =>
            session?.user
                ? {
                      id: session.user.id ?? session.user.email ?? "",
                      email: session.user.email ?? "",
                      fullName: session.user.name ?? "",
                      role: session.user.role ?? "USER",
                      image: session.user.image ?? undefined,
                  }
                : null,
        [session?.user],
    );

    // 🔓 Email/Password Login
    const login = useCallback(
        async (email: string, password: string, _rememberMe?: boolean) => {
            setIsLoading(true);
            try {
                const result = await signIn("credentials", {
                    redirect: false,
                    email,
                    password,
                });

                if (result?.error) {
                    throw new Error("Email hoặc mật khẩu không đúng");
                }

                return user!;
            } finally {
                setIsLoading(false);
            }
        },
        [user],
    );

    // 📝 Register function
    const register = useCallback(async (fullName: string, email: string, password: string, phone?: string) => {
        setIsLoading(true);
        try {
            await authService.register({ fullName, email, password, phone });
            // Sau khi đăng ký thành công, đăng nhập ngay bằng credentials provider
            const signInResult = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });
            if (signInResult?.error) {
                throw new Error("Không thể tự động đăng nhập sau khi đăng ký");
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 🌐 Google Login
    const loginWithGoogle = useCallback(async () => {
        setIsLoading(true);
        try {
            await signIn("google", { callbackUrl: "/auth-callback" });
        } catch (error) {
            console.error("Google login error:", error);
            setIsLoading(false);
        }
    }, []);

    // 🚪 Logout
    const logout = useCallback(async () => {
        setIsLoading(true);
        try {
            await signOut({ callbackUrl: "/" });
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 📦 Context value
    const value: AuthContextType = {
        user,
        isLoading: isLoading || status === "loading",
        isAuthenticated: !!user,
        login,
        register,
        loginWithGoogle,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 🎣 Custom Hook - useAuth
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};
