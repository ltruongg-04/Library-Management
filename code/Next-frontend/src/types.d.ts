declare module "*.css";
declare module "*.scss";
declare module "*.sass";

import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user?: {
      id?: string;
      role?: string;
    } & DefaultSession["user"];
    backendToken?: string;
  }

  interface User extends DefaultUser {
    id: string;
    role?: string;
    backendToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    backendToken?: string;
  }
}
