import CategoryTable from "@/components/features/admin/categories/CategoryTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý Thể loại | Admin",
  description: "Quản lý danh sách thể loại sách",
};

export default function CategoryManagementPage() {
  return (
    <div className="h-[calc(100vh-theme(spacing.16))] w-full bg-surface">
      <CategoryTable />
    </div>
  );
}
