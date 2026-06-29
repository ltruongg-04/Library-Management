import AdminBreadcrumb from "@/components/features/admin/AdminBreadcrumb";
import { UI_TEXT } from "@/constants/ui-text";

export default function VaiTroPage() {
    return (
        <div className="p-8">
            <AdminBreadcrumb pageName={UI_TEXT.ADMIN.SIDEBAR.NAV_ROLES} />
            <h1 className="mt-md text-3xl font-semibold text-ink-950">{UI_TEXT.ADMIN_PAGES.ROLES.TITLE}</h1>
            <p className="mt-4 text-ink-950/70">{UI_TEXT.ADMIN_PAGES.ROLES.DESC}</p>
        </div>
    );
}
