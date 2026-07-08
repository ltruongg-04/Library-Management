import { AlertTriangle, BookOpen, ClipboardList } from "lucide-react";
import Topbar from "@/components/features/admin/Topbar";
import PendingRequests from "@/components/features/admin/dashboard/PendingRequests";
import SmartCataloging from "@/components/features/admin/dashboard/SmartCataloging";
import StatCard from "@/components/features/admin/dashboard/StatCard";
import SystemAlerts from "@/components/features/admin/dashboard/SystemAlerts";
import { UI_TEXT } from "@/constants/ui-text";

export default function DashboardPage() {
    return (
        <div className="flex min-h-screen w-full flex-col bg-surface">
            <Topbar />
            <div className="flex flex-1 flex-col space-y-5 p-8">
                <div className="flex flex-col gap-5 sm:flex-row">
                    <StatCard
                        eyebrow={UI_TEXT.ADMIN_PAGES.DASHBOARD.BOOKS_TODAY}
                        value="342"
                        icon={BookOpen}
                        tone="brass"
                        meta={{ type: "trend", text: UI_TEXT.ADMIN_PAGES.DASHBOARD.BOOKS_TODAY_TREND }}
                    />
                    <StatCard
                        eyebrow={UI_TEXT.ADMIN_PAGES.DASHBOARD.PENDING_APPROVAL}
                        value="18"
                        icon={ClipboardList}
                        tone="moss"
                        meta={{ type: "info", text: UI_TEXT.ADMIN_PAGES.DASHBOARD.PENDING_APPROVAL_DESC }}
                    />
                    <StatCard
                        eyebrow={UI_TEXT.ADMIN_PAGES.DASHBOARD.OVERDUE_BOOKS}
                        value="45"
                        icon={AlertTriangle}
                        tone="rust"
                        meta={{ type: "alert", text: UI_TEXT.ADMIN_PAGES.DASHBOARD.OVERDUE_BOOKS_DESC }}
                    />
                </div>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
                    <PendingRequests />
                    <div className="space-y-5">
                        <SmartCataloging />
                        <SystemAlerts />
                    </div>
                </div>
            </div>
        </div>
    );
}
