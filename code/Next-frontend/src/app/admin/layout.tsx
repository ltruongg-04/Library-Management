import Sidebar from "@/components/features/admin/Sidebar";
import { AdminGuard } from "@/components/features/auth/AdminGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-[#FAFAFB]">
        <Sidebar />
        <main className="ml-64 min-h-screen overflow-y-auto">{children}</main>
      </div>
    </AdminGuard>
  );
}

