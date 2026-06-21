import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
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
        token.id = profile.sub;
      }
      return token;
    },

    // Đưa thêm user id từ token vào session
    async session({ session, token }) {
      if (session.user) {
        (session.user as typeof session.user & { id: string }).id =
          token.id as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login", // Redirect về trang login của app khi cần sign in
  },
});

export { handler as GET, handler as POST };
