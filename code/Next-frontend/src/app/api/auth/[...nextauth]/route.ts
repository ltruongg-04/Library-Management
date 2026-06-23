import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  // Dùng JWT strategy (không cần database)
  session: {
    strategy: "jwt",
  },

  callbacks: {
    // Đưa thêm user id vào JWT token
    async jwt({ token, account, profile }) {
      if (account && profile) {
        // Mặc định dùng thông tin từ Google profile
        token.id = profile.sub;

        try {
          // Gọi API backend để đồng bộ tài khoản Google vào DB
          const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8081";
          console.log("[NextAuth] Calling backend:", `${API_URL}/api/auth/google`);

          const res = await fetch(`${API_URL}/api/auth/google`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: profile.email,
              fullName: profile.name,
            }),
          });

          const data = await res.json();
          console.log("[NextAuth] Backend response:", JSON.stringify(data));

          if (data.success && data.data) {
            token.backendToken = data.data.token;
            token.id = String(data.data.user.id);
            token.role = data.data.user.role;
          } else {
            console.error("[NextAuth] Backend auth error:", data.message);
            // Không throw — vẫn cho đăng nhập bằng Google, nhưng không có backend token
          }
        } catch (error) {
          console.error("[NextAuth] Error syncing Google login with backend:", error);
          // Không throw — vẫn cho đăng nhập, log lỗi để debug
        }
      }
      return token;
    },

    // Đưa thêm user info từ token vào session
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.backendToken = token.backendToken;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login", // Redirect về trang login của app khi cần sign in
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
