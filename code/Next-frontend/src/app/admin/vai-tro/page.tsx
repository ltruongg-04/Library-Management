import { ShieldCheck } from "lucide-react";
import AdminBreadcrumb from "@/components/features/admin/AdminBreadcrumb";
import { UI_TEXT } from "@/constants/ui-text";

export default function VaiTroPage() {
    return (
        <div className="flex min-h-screen w-full flex-col bg-surface">
            <div className="px-8 pb-2 pt-8">
                <AdminBreadcrumb pageName={UI_TEXT.ADMIN.SIDEBAR.NAV_ROLES} />
            </div>

            <div className="flex items-center justify-between border-y border-surface-container-high bg-white px-8 py-6">
                <div>
                    <h1 className="flex items-center gap-2 font-serif text-2xl font-bold text-ink-950">
                        <ShieldCheck size={24} className="text-primary-600" />
                        {UI_TEXT.ADMIN_PAGES.ROLES.TITLE}
                    </h1>
                    <p className="mt-1 text-[14px] text-on-surface-variant">{UI_TEXT.ADMIN_PAGES.ROLES.DESC}</p>
                </div>
            </div>

            <main className="flex flex-1 flex-col gap-lg overflow-auto p-8">{/* Content will go here */}</main>
        </div>
    );
}
