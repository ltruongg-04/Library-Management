import Sidebar from "@/components/features/admin/Sidebar";
import { AdminGuard } from "@/components/features/auth/AdminGuard";
import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-surface">
        <Sidebar />
        <main className="ml-sidebar-width min-h-screen overflow-y-auto">{children}</main>
      </div>
    </AdminGuard>
  );
}

