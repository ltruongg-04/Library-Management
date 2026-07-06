import { Metadata } from "next";
import AdminBreadcrumb from "@/components/features/admin/AdminBreadcrumb";
import CategoryTable from "@/components/features/admin/categories/CategoryTable";
import { UI_TEXT } from "@/constants/ui-text";
import { ADMIN_UI } from "@/constants/ui-text/admin";

export const metadata: Metadata = {
    title: ADMIN_UI.CATEGORIES.TITLE,
    description: ADMIN_UI.CATEGORIES.DESC,
};

export default function CategoryManagementPage() {
    return (
        <div className="flex min-h-screen w-full flex-col bg-surface">
            <div className="px-8 pb-2 pt-8">
                <AdminBreadcrumb pageName={UI_TEXT.ADMIN.SIDEBAR.NAV_CATEGORIES} />
            </div>
            <div className="flex-1 overflow-hidden">
                <CategoryTable />
            </div>
        </div>
    );
}
