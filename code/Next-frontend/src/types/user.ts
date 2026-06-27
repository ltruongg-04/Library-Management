export type UserRole = "admin" | "librarian" | "customer";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "locked" | "inactive";
  lastLogin: string;
}