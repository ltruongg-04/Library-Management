import { LucideIcon, TrendingUp, Clock, AlertTriangle } from "lucide-react";

type Tone = "brass" | "moss" | "rust";

const TONE_STYLES: Record<Tone, { bg: string; text: string; ring: string }> = {
  brass: { bg: "bg-brass-500/10", text: "text-brass-600", ring: "ring-brass-500/15" },
  moss: { bg: "bg-moss-500/10", text: "text-moss-600", ring: "ring-moss-500/15" },
  rust: { bg: "bg-rust-500/10", text: "text-rust-600", ring: "ring-rust-500/15" },
};

interface StatCardProps {
  eyebrow: string;
  value: string;
  icon: LucideIcon;
  tone: Tone;
  meta: {
    type: "trend" | "info" | "alert";
    text: string;
  };
}

function MetaLine({ meta }: { meta: StatCardProps["meta"] }) {
  if (meta.type === "trend") {
    return (
      <p className="mt-2.5 flex items-center gap-1 text-[12.5px] font-medium text-moss-600">
        <TrendingUp size={13} strokeWidth={2.5} />
        {meta.text}
      </p>
    );
  }
  if (meta.type === "alert") {
    return (
      <p className="mt-2.5 flex items-center gap-1 text-[12.5px] font-medium text-rust-600">
        <AlertTriangle size={13} strokeWidth={2.5} />
        {meta.text}
      </p>
    );
  }
  return (
    <p className="mt-2.5 flex items-center gap-1 text-[12.5px] font-medium text-ink-950/45">
      <Clock size={13} strokeWidth={2.5} />
      {meta.text}
    </p>
  );
}

export default function StatCard({ eyebrow, value, icon: Icon, tone, meta }: StatCardProps) {
  const styles = TONE_STYLES[tone];
  return (
    <div className="flex flex-1 items-start justify-between rounded-xl border border-ink-950/[0.06] bg-white p-5 shadow-card transition-shadow hover:shadow-panel">
      <div>
        <p className="text-[12.5px] font-medium uppercase tracking-wide text-ink-950/45">
          {eyebrow}
        </p>
        <p className="mt-2 font-mono text-[32px] font-semibold leading-none tracking-tight text-ink-950">
          {value}
        </p>
        <MetaLine meta={meta} />
      </div>
      <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg ${styles.bg} ring-1 ${styles.ring}`}>
        <Icon size={20} className={styles.text} strokeWidth={2} />
      </div>
    </div>
  );
}
