import { BookOpen, ClipboardList, AlertTriangle } from "lucide-react";
import Topbar from "@/components/features/admin/Topbar";
import StatCard from "@/components/features/admin/StatCard";
import PendingRequests from "@/components/features/admin/PendingRequests";
import SmartCataloging from "@/components/features/admin/SmartCataloging";
import SystemAlerts from "@/components/features/admin/SystemAlerts";

export default function DashboardPage() {
  return (
    <main className="space-y-5 px-8 py-6">
      <Topbar />
      <div className="flex flex-col gap-5 sm:flex-row">
        <StatCard
          eyebrow="Sách mượn hôm nay"
          value="342"
          icon={BookOpen}
          tone="brass"
          meta={{ type: "trend", text: "+12% so với tuần trước" }}
        />
        <StatCard
          eyebrow="Chờ phê duyệt"
          value="18"
          icon={ClipboardList}
          tone="moss"
          meta={{ type: "info", text: "Cần xem xét trong 24h" }}
        />
        <StatCard
          eyebrow="Sách quá hạn"
          value="45"
          icon={AlertTriangle}
          tone="rust"
          meta={{ type: "alert", text: "Cần xử lý ngay" }}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
        <PendingRequests />
        <div className="space-y-5">
          <SmartCataloging />
          <SystemAlerts />
        </div>
      </div>
    </main>
  );
}
