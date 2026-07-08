import { Metadata } from "next";
import AuditLogsPageContent from "@/components/features/admin/audit-logs/AuditLogsPageContent";
import { UI_TEXT } from "@/constants/ui-text";

export const metadata: Metadata = {
    title: `${UI_TEXT.ADMIN_AUDIT_LOGS.SYSTEM_LOGS.PAGE_TITLE} | Admin`,
    description: UI_TEXT.ADMIN_AUDIT_LOGS.SYSTEM_LOGS.PAGE_DESCRIPTION,
};

export default function AuditLogsPage() {
    return <AuditLogsPageContent />;
}
