import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "*.css";
declare module "*.scss";
declare module "*.sass";

declare module "next-auth" {
    interface Session {
        user?: {
            id?: string;
            role?: string;
            phone?: string | null;
            authProvider?: string;
        } & DefaultSession["user"];
        backendToken?: string;
        error?: string;
    }

    interface User extends DefaultUser {
        id: string;
        role?: string;
        phone?: string | null;
        authProvider?: string;
        backendToken?: string;
        refreshToken?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id?: string;
        role?: string;
        phone?: string | null;
        authProvider?: string;
        backendToken?: string;
        refreshToken?: string;
        error?: string;
    }
}
