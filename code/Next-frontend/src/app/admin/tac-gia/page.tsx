import { Metadata } from "next";
import AdminBreadcrumb from "@/components/features/admin/AdminBreadcrumb";
import AuthorTable from "@/components/features/admin/authors/AuthorTable";
import { UI_TEXT } from "@/constants/ui-text";

export const metadata: Metadata = {
    title: "Quản lý Tác giả | Admin",
    description: "Quản lý danh sách tác giả sách",
};

export default function AuthorManagementPage() {
    return (
        <div className="flex min-h-screen w-full flex-col bg-surface">
            <div className="px-8 pb-2 pt-8">
                <AdminBreadcrumb pageName={UI_TEXT.ADMIN.SIDEBAR.NAV_AUTHORS} />
            </div>
            <div className="flex-1 overflow-hidden">
                <AuthorTable />
            </div>
        </div>
    );
}
