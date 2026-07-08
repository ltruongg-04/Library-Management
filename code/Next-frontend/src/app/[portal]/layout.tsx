import type { ReactNode } from "react";
import AdminMainContent from "@/components/features/admin/AdminMainContent";
import Sidebar from "@/components/features/admin/Sidebar";
import { AdminGuard } from "@/components/features/auth/AdminGuard";
import { SidebarProvider } from "@/providers/SidebarContext";

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <AdminGuard>
            <SidebarProvider>
                <div className="min-h-screen bg-surface">
                    <Sidebar />
                    <AdminMainContent>{children}</AdminMainContent>
                </div>
            </SidebarProvider>
        </AdminGuard>
    );
}
