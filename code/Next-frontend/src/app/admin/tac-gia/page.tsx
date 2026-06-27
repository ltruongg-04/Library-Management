import AuthorTable from "@/components/features/admin/authors/AuthorTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý Tác giả | Admin",
  description: "Quản lý danh sách tác giả sách",
};

export default function AuthorManagementPage() {
  return (
    <div className="h-[calc(100vh-theme(spacing.16))] w-full bg-surface">
      <AuthorTable />
    </div>
  );
}
