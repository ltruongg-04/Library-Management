export type UserRole = "ADMIN" | "LIBRARIAN" | "CUSTOMER" | "USER" | "admin" | "librarian" | "customer" | string;

export interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    status: "active" | "locked" | "inactive" | boolean | string;
    lastLogin?: string;
    phone?: string | null;
    avatarUrl?: string;
}
