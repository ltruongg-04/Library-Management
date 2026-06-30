import type { ElementType, ReactNode } from "react";
import { AlertTriangle, ChevronDown } from "lucide-react";
import { Toggle } from "@/components/base/Toggle";
import { UI_TEXT } from "@/constants/ui-text";

const SETTINGS = UI_TEXT.ADMIN_SETTINGS;

export function SectionCard({ icon: Icon, title, children }: { icon: ElementType; title: string; children: ReactNode }) {
    return (
        <section className="level-1-shadow rounded-lg border border-outline-variant/20 bg-surface-container-lowest p-lg">
            <div className="mb-lg flex items-center gap-sm border-b border-outline-variant/30 pb-sm">
                <Icon size={24} strokeWidth={2} className="text-primary" />
                <h2 className="text-title-md font-semibold text-primary">{title}</h2>
            </div>
            {children}
        </section>
    );
}

export function PolicyField({ label, value, suffix, onChange }: { label: string; value: string; suffix?: string; onChange: (value: string) => void }) {
    return (
        <label className="flex flex-col gap-xs">
            <span className="font-mono text-[13px] font-medium leading-5 tracking-[0.02em] text-on-surface-variant">{label}</span>
            <span className="relative">
                <input
                    type="number"
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    className={`h-10 w-full rounded-lg border-none bg-surface-bright py-sm pl-md text-body-md text-on-surface transition-shadow focus:ring-1 focus:ring-primary ${
                        suffix ? "pr-14" : "pr-md"
                    }`}
                />
                {suffix ? (
                    <span className="pointer-events-none absolute right-1 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md bg-surface-bright text-body-sm text-on-surface-variant">
                        {suffix}
                    </span>
                ) : null}
            </span>
        </label>
    );
}

export function FeatureToggle({
    title,
    description,
    icon: Icon,
    id,
    checked,
    onChange,
}: {
    title: string;
    description: string;
    icon: ElementType;
    id: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}) {
    return (
        <div className="flex items-start justify-between gap-md">
            <div className="min-w-0">
                <div className="mb-xs flex items-center gap-xs">
                    <h3 className="text-body-md font-semibold text-on-surface">{title}</h3>
                    <Icon size={16} strokeWidth={2} className="text-secondary" aria-hidden="true" />
                </div>
                <p className="text-body-sm text-on-surface-variant">{description}</p>
            </div>
            <div className="mt-1 shrink-0">
                <Toggle id={id} checked={checked} onChange={onChange} />
            </div>
        </div>
    );
}

export function GatewayRow({
    icon: Icon,
    name,
    description,
    note,
    token,
    active,
}: {
    icon: ElementType;
    name: string;
    description: string;
    note: string;
    token: string;
    active: boolean;
}) {
    return (
        <div className="flex flex-col gap-md rounded-lg border border-outline-variant/20 bg-surface-bright p-md transition-colors hover:border-primary/30">
            <div className="flex flex-col gap-md sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 items-start gap-md">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-surface-container-high text-on-surface-variant">
                        <Icon size={24} strokeWidth={1.8} />
                    </div>
                    <div className="min-w-0">
                        <h3 className="truncate text-body-md font-semibold text-on-surface">{name}</h3>
                        <p className="text-body-sm text-on-surface-variant">{description}</p>
                        <p className="mt-xs text-[13px] leading-5 text-on-surface-variant">{note}</p>
                    </div>
                </div>
                <div className="flex shrink-0 items-center gap-sm sm:justify-end">
                    <span
                        className={`inline-flex items-center gap-xs rounded-full px-3 py-1 text-[12px] font-semibold ${
                            active ? "bg-secondary-fixed text-on-secondary-fixed" : "bg-warning-100 text-warning-800"
                        }`}
                    >
                        <span className={`h-2 w-2 rounded-full ${active ? "bg-secondary" : "bg-warning-600"}`} />
                        {active ? SETTINGS.PAYMENTS.VERIFIED : SETTINGS.PAYMENTS.NEEDS_CONNECTION}
                    </span>
                </div>
            </div>

            <div className="flex flex-col gap-sm border-t border-outline-variant/20 pt-md sm:flex-row sm:items-center sm:justify-between">
                <span className="inline-flex w-fit items-center gap-xs rounded-md bg-surface-container-high px-3 py-1 font-mono text-[12px] font-medium text-on-surface-variant">
                    {SETTINGS.PAYMENTS.TOKEN_LABEL}: {token}
                </span>
                <button
                    type="button"
                    className={`focus-ring h-9 rounded-lg px-md text-body-sm font-semibold transition-colors ${
                        active
                            ? "border border-secondary bg-transparent text-secondary hover:bg-secondary/10"
                            : "bg-primary text-on-primary shadow-sm hover:bg-primary-container"
                    }`}
                >
                    {active ? SETTINGS.PAYMENTS.MANAGE_CONNECTION : SETTINGS.PAYMENTS.CONNECT_GATEWAY}
                </button>
            </div>
        </div>
    );
}

export function SelectField({
    label,
    value,
    onChange,
    options,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: Array<{ value: string; label: string }>;
}) {
    return (
        <label className="flex flex-col gap-xs">
            {label ? <span className="font-label-caps text-label-caps text-on-surface-variant">{label}</span> : null}
            <span className="relative">
                <select
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    className="h-12 w-full appearance-none rounded-lg border-none bg-surface-bright px-md pr-10 text-body-md text-on-surface focus:ring-1 focus:ring-primary"
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <ChevronDown size={20} strokeWidth={1.8} className="pointer-events-none absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant" />
            </span>
        </label>
    );
}

export function ConfirmDiscardModal({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: () => void; onConfirm: () => void }) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-md backdrop-blur-sm">
            <section className="level-2-shadow w-full max-w-md rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-lg text-center">
                <div className="mx-auto mb-md grid h-12 w-12 place-items-center rounded-full bg-error-50 text-error-500">
                    <AlertTriangle size={26} strokeWidth={2} />
                </div>
                <h2 className="text-title-md font-semibold text-on-surface">{SETTINGS.ACTION_BAR.DISCARD_CONFIRM_TITLE}</h2>
                <p className="mt-sm text-body-sm text-on-surface-variant">{SETTINGS.ACTION_BAR.DISCARD_CONFIRM_MESSAGE}</p>
                <div className="mt-lg grid grid-cols-1 gap-sm sm:grid-cols-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="focus-ring h-11 rounded-lg border border-secondary bg-transparent px-md text-body-md font-medium text-secondary transition-colors hover:bg-secondary/10"
                    >
                        {SETTINGS.ACTION_BAR.KEEP_EDITING}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="focus-ring h-11 rounded-lg bg-primary px-md text-body-md font-semibold text-on-primary shadow-md transition-colors hover:bg-primary-container"
                    >
                        {SETTINGS.ACTION_BAR.CONFIRM_DISCARD}
                    </button>
                </div>
            </section>
        </div>
    );
}
