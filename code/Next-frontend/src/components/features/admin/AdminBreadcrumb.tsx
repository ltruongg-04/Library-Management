import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { UI_TEXT } from "@/constants/ui-text";

export default function AdminBreadcrumb({ pageName }: { pageName: string }) {
    return (
        <div className="mb-md flex items-center gap-sm text-title-md">
            <Link href="/admin" className="font-bold text-primary transition-colors hover:text-primary-container">
                {UI_TEXT.ADMIN_SETTINGS.TOPBAR_TITLE}
            </Link>
            <ChevronRight size={20} strokeWidth={2} className="text-on-surface-variant" aria-hidden="true" />
            <span className="font-medium text-on-surface-variant">{pageName}</span>
        </div>
    );
}
