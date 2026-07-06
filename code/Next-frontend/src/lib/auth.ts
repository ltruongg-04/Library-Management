import axios from "axios";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { API_ERRORS } from "@/constants/ui-text/shared/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8081";

async function refreshAccessToken(token: any) {
    // Không có refreshToken (ví dụ: Google OAuth thuần frontend) → bỏ qua refresh
    if (!token.refreshToken) {
        return token;
    }

    try {
        const res = await axios.post(`${API_URL}/api/auth/refresh`, {
            refreshToken: token.refreshToken,
        });

        const data = res.data;

        if (!data.success) {
            throw new Error(data.message || "Refresh token failed");
        }

        return {
            ...token,
            backendToken: data.data.token,
            refreshToken: data.data.refreshToken ?? token.refreshToken,
            expiresAt: Date.now() + 15 * 60 * 1000, // 15 mins
        };
    } catch (error: any) {
        console.error("Error refreshing token:", error.response?.data?.message || error.message);
        return {
            ...token,
            error: "RefreshAccessTokenError",
        };
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                try {
                    const res = await axios.post(`${API_URL}/api/auth/login`, {
                        email: credentials.email,
                        password: credentials.password,
                    });

                    const data = res.data;
                    if (data.success && data.data) {
                        return {
                            id: String(data.data.user.id),
                            email: data.data.user.email,
                            name: data.data.user.fullName,
                            role: data.data.user.role,
                            backendToken: data.data.token,
                            refreshToken: data.data.refreshToken,
                        };
                    }
                    return null;
                } catch (e: any) {
                    const message = e.response?.data?.message || API_ERRORS.LOGIN_FAILED;
                    throw new Error(message);
                }
            },
        }),
    ],

    session: { strategy: "jwt" },

    callbacks: {
        async jwt({ token, user, account, profile }) {
            // Initial sign in
            if (user || (account && profile)) {
                if (account?.provider === "google") {
                    // Sync Google Login với backend
                    try {
                        const res = await axios.post(`${API_URL}/api/auth/google`, {
                            email: profile?.email,
                            fullName: profile?.name,
                        });
                        const data = res.data;
                        if (data.success && data.data) {
                            token.backendToken = data.data.token;
                            // Chỉ set refreshToken nếu backend trả về — tránh undefined
                            token.refreshToken = data.data.refreshToken ?? null;
                            token.id = String(data.data.user.id);
                            token.role = data.data.user.role;
                            // Nếu có refreshToken thì set expiry, không thì để session tự quản lý
                            token.expiresAt = token.refreshToken ? Date.now() + 15 * 60 * 1000 : Number.MAX_SAFE_INTEGER;
                        } else {
                            // Backend sync thất bại → giữ session Google, không có backend token
                            token.expiresAt = Number.MAX_SAFE_INTEGER;
                        }
                    } catch (e: any) {
                        console.error("Google backend sync error:", e);
                        // Nếu backend trả về lỗi 403 (bị khóa) hoặc lỗi khác, ném exception để chặn đăng nhập
                        throw new Error(e.response?.data?.message || "Tài khoản của bạn đã bị khóa hoặc có lỗi hệ thống");
                    }
                } else if (user) {
                    // Credentials login
                    token.backendToken = (user as any).backendToken;
                    token.refreshToken = (user as any).refreshToken;
                    token.id = user.id;
                    token.role = (user as any).role;
                    token.expiresAt = Date.now() + 15 * 60 * 1000;
                }
                return token;
            }

            // Check if access token is expired
            if (Date.now() < (token.expiresAt as number)) {
                return token;
            }

            // Access token expired, refresh it
            return refreshAccessToken(token);
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.backendToken = token.backendToken as string;
                session.error = token.error as string;
            }
            return session;
        },
    },

    events: {
        async signOut({ token }) {
            if (token?.refreshToken) {
                try {
                    await axios.post(`${API_URL}/api/auth/logout`, {
                        refreshToken: token.refreshToken,
                    });
                } catch (e) {
                    console.error("Failed to call backend logout", e);
                }
            }
        },
    },

    pages: { signIn: "/login" },
};
