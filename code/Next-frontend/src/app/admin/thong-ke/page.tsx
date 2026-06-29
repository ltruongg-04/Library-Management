import AdminBreadcrumb from "@/components/features/admin/AdminBreadcrumb";
import { UI_TEXT } from "@/constants/ui-text";

export default function ThongKePage() {
    return (
        <div className="p-8">
            <AdminBreadcrumb pageName={UI_TEXT.ADMIN.SIDEBAR.NAV_STATS} />
            <h1 className="mt-md text-3xl font-semibold text-ink-950">{UI_TEXT.ADMIN.THONG_KE.TITLE}</h1>
            <p className="mt-4 text-ink-950/70">{UI_TEXT.ADMIN.THONG_KE.DESCRIPTION}</p>
        </div>
    );
}
