import type { ElementType, ReactNode } from "react";
import { CheckCircle2, ChevronDown, ShieldX, User, XCircle } from "lucide-react";
import { UI_TEXT } from "@/constants/ui-text";
import type { AuditLog, AuditResult } from "@/types/admin-audit-log";

const TEXT = UI_TEXT.ADMIN_AUDIT_LOGS;

const actorToneClasses: Record<AuditLog["actorTone"], string> = {
    primary: "bg-primary-container text-on-primary-container",
    secondary: "bg-secondary-container text-on-secondary-container",
    system: "bg-surface-variant text-on-surface-variant",
    muted: "bg-outline-variant text-on-surface-variant",
};

const resultConfig: Record<
    AuditResult,
    {
        label: string;
        icon: ElementType;
        classes: string;
    }
> = {
    success: {
        label: TEXT.RESULT.SUCCESS,
        icon: CheckCircle2,
        classes: "bg-success-50 text-success-700",
    },
    failed: {
        label: TEXT.RESULT.FAILED,
        icon: XCircle,
        classes: "bg-error-50 text-error-700",
    },
    blocked: {
        label: TEXT.RESULT.BLOCKED,
        icon: ShieldX,
        classes: "bg-warning-100 text-warning-800",
    },
};

export function FilterControl({ label, icon: Icon, children }: { label: string; icon: ElementType; children: ReactNode }) {
    return (
        <label className="flex min-w-[220px] flex-1 flex-col gap-xs">
            <span className="font-label-caps text-label-caps text-on-surface-variant">{label}</span>
            <span className="relative">
                <Icon size={18} strokeWidth={1.9} className="pointer-events-none absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant" />
                {children}
            </span>
        </label>
    );
}

export function SelectControl({ value, onChange, children }: { value: string; onChange: (value: string) => void; children: ReactNode }) {
    return (
        <>
            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="h-11 w-full appearance-none rounded-lg border border-outline-variant/40 bg-surface-bright py-sm pl-11 pr-10 text-body-sm text-on-surface outline-none transition-shadow focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary"
            >
                {children}
            </select>
            <ChevronDown size={18} strokeWidth={1.9} className="pointer-events-none absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant" />
        </>
    );
}

export function ActorBadge({ log }: { log: AuditLog }) {
    const Icon = log.actorIcon ?? User;

    return (
        <div className="flex min-w-0 items-center gap-sm">
            <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-body-sm font-semibold ${actorToneClasses[log.actorTone]}`}>
                {log.initials ? log.initials : <Icon size={18} strokeWidth={1.9} />}
            </span>
            <span className="min-w-0 truncate text-body-sm font-medium text-on-surface">{log.actor}</span>
        </div>
    );
}

export function ResultBadge({ result }: { result: AuditResult }) {
    const config = resultConfig[result];
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-xs rounded-full px-3 py-1 text-[12px] font-semibold ${config.classes}`}>
            <Icon size={14} strokeWidth={2} />
            {config.label}
        </span>
    );
}

export function DetailItem({ label, value }: { label: string; value: string }) {
    return (
        <span className="flex min-w-0 flex-col gap-1">
            <span className="font-label-caps text-[11px] uppercase tracking-[0.08em] text-on-surface-variant">{label}</span>
            <span className="truncate text-body-sm text-on-surface">{value}</span>
        </span>
    );
}
