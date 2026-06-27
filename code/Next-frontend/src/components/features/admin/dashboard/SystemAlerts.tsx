import { AlertOctagon, Info } from "lucide-react";
import { UI_TEXT } from "@/constants/ui-text";

interface Alert {
  id: string;
  tone: "rust" | "brass";
  icon: typeof AlertOctagon;
  title: string;
  body: string;
}

const ALERTS: Alert[] = [
  {
    id: "a1",
    tone: "rust",
    icon: AlertOctagon,
    title: UI_TEXT.ADMIN_LAYOUT.ALERTS.SYNC_DELAY_TITLE,
    body: UI_TEXT.ADMIN_LAYOUT.ALERTS.SYNC_DELAY_DESC,
  },
  {
    id: "a2",
    tone: "brass",
    icon: Info,
    title: UI_TEXT.ADMIN_LAYOUT.ALERTS.AI_UPDATE_TITLE,
    body: UI_TEXT.ADMIN_LAYOUT.ALERTS.AI_UPDATE_DESC,
  },
];

const TONE_MAP = {
  rust: {
    bg: "bg-rust-50",
    border: "border-rust-500/15",
    icon: "text-rust-500",
    title: "text-rust-600",
  },
  brass: {
    bg: "bg-brass-500/[0.07]",
    border: "border-brass-500/15",
    icon: "text-brass-600",
    title: "text-brass-600",
  },
};

export default function SystemAlerts() {
  return (
    <div className="rounded-xl border border-ink-950/[0.06] bg-white p-5 shadow-card">
      <h2 className="font-serif text-[16px] font-semibold text-ink-950">
        {UI_TEXT.ADMIN_LAYOUT.ALERTS.HEADING}
      </h2>

      <div className="mt-3.5 space-y-2.5">
        {ALERTS.map((alert) => {
          const styles = TONE_MAP[alert.tone];
          return (
            <div
              key={alert.id}
              className={`flex gap-2.5 rounded-lg border ${styles.border} ${styles.bg} px-3.5 py-3`}
            >
              <alert.icon size={16} className={`mt-0.5 shrink-0 ${styles.icon}`} strokeWidth={2} />
              <div className="min-w-0">
                <p className={`text-[13px] font-semibold ${styles.title}`}>{alert.title}</p>
                <p className="mt-0.5 text-[12.5px] leading-snug text-ink-950/55">
                  {alert.body}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
