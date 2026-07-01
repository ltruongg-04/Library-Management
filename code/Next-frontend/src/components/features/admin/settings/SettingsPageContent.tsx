"use client";

import type { ElementType, ReactNode } from "react";
import { useEffect, useState } from "react";
import {
    AlertTriangle,
    BookOpen,
    ChevronDown,
    CircleDollarSign,
    Clock3,
    CreditCard,
    DatabaseBackup,
    Globe2,
    Landmark,
    Save,
    Settings,
    Sparkles,
    ToggleRight,
    WalletCards,
} from "lucide-react";
import { Toggle } from "@/components/base/Toggle";
import { SuccessModal } from "@/components/base/success-modal";
import AdminBreadcrumb from "@/components/features/admin/AdminBreadcrumb";
import { UI_TEXT } from "@/constants/ui-text";

const SETTINGS = UI_TEXT.ADMIN_SETTINGS;
const STORAGE_KEY = "lumina_admin_business_policies";

type AdminSettingsState = {
    borrowing: {
        maxDays: string;
        finePerDay: string;
        maxBooks: string;
        depositPercentage: string;
        maxRenewals: string;
    };
    features: {
        aiSearch: boolean;
        onlinePayments: boolean;
        autoBackup: boolean;
    };
    localization: {
        language: string;
        timezone: string;
    };
};

const DEFAULT_SETTINGS: AdminSettingsState = {
    borrowing: {
        maxDays: "14",
        finePerDay: "5000",
        maxBooks: "5",
        depositPercentage: "10",
        maxRenewals: "2",
    },
    features: {
        aiSearch: true,
        onlinePayments: true,
        autoBackup: true,
    },
    localization: {
        language: "vi",
        timezone: "utc-plus-7",
    },
};

const borrowingFields = [
    { key: "maxDays", label: SETTINGS.BORROWING.MAX_DAYS, suffix: undefined },
    { key: "finePerDay", label: SETTINGS.BORROWING.FINE_PER_DAY, suffix: "đ" },
    { key: "maxBooks", label: SETTINGS.BORROWING.MAX_BOOKS, suffix: undefined },
    { key: "depositPercentage", label: SETTINGS.BORROWING.DEPOSIT_PERCENTAGE, suffix: "%" },
] as const;

const featureItems = [
    {
        key: "aiSearch",
        title: SETTINGS.FEATURES.AI_SEARCH_TITLE,
        description: SETTINGS.FEATURES.AI_SEARCH_DESC,
        icon: Sparkles,
    },
    {
        key: "onlinePayments",
        title: SETTINGS.FEATURES.ONLINE_PAYMENTS_TITLE,
        description: SETTINGS.FEATURES.ONLINE_PAYMENTS_DESC,
        icon: CircleDollarSign,
    },
    {
        key: "autoBackup",
        title: SETTINGS.FEATURES.AUTO_BACKUP_TITLE,
        description: SETTINGS.FEATURES.AUTO_BACKUP_DESC,
        icon: DatabaseBackup,
    },
] as const;

const languageOptions = [
    { value: "vi", label: SETTINGS.LOCALIZATION.VIETNAMESE },
    { value: "en", label: SETTINGS.LOCALIZATION.ENGLISH },
    { value: "zh", label: "中文 (简体)" },
    { value: "hi", label: "हिन्दी (IN)" },
    { value: "es", label: "Español (ES)" },
    { value: "fr", label: "Français (FR)" },
    { value: "ar", label: "العربية" },
    { value: "bn", label: "বাংলা (BD)" },
    { value: "pt", label: "Português (BR)" },
    { value: "ru", label: "Русский (RU)" },
    { value: "ja", label: "日本語 (JP)" },
];

const timezoneOptions = [
    { value: "utc-minus-12", label: "(UTC-12:00) Baker Island, Howland Island" },
    { value: "utc-minus-11", label: "(UTC-11:00) Pago Pago, Niue" },
    { value: "utc-minus-10", label: "(UTC-10:00) Honolulu, Papeete" },
    { value: "utc-minus-9", label: "(UTC-09:00) Anchorage, Juneau" },
    { value: "utc-minus-8", label: "(UTC-08:00) Los Angeles, Vancouver, San Francisco" },
    { value: "utc-minus-7", label: "(UTC-07:00) Denver, Phoenix, Calgary" },
    { value: "utc-minus-6", label: "(UTC-06:00) Chicago, Mexico City, Guatemala City" },
    { value: "utc-minus-5", label: "(UTC-05:00) New York, Toronto, Lima, Bogota" },
    { value: "utc-minus-4", label: "(UTC-04:00) Santiago, Caracas, La Paz" },
    { value: "utc-minus-3", label: "(UTC-03:00) Buenos Aires, Sao Paulo, Montevideo" },
    { value: "utc-minus-2", label: "(UTC-02:00) South Georgia, Fernando de Noronha" },
    { value: "utc-minus-1", label: "(UTC-01:00) Azores, Cape Verde" },
    { value: "utc-plus-0", label: "(UTC+00:00) London, Lisbon, Accra, Reykjavik" },
    { value: "utc-plus-1", label: "(UTC+01:00) Paris, Berlin, Rome, Madrid" },
    { value: "utc-plus-2", label: "(UTC+02:00) Athens, Cairo, Johannesburg, Helsinki" },
    { value: "utc-plus-3", label: "(UTC+03:00) Moscow, Istanbul, Riyadh, Nairobi" },
    { value: "utc-plus-4", label: "(UTC+04:00) Dubai, Abu Dhabi, Baku, Muscat" },
    { value: "utc-plus-5", label: "(UTC+05:00) Karachi, Tashkent, Yekaterinburg" },
    { value: "utc-plus-6", label: "(UTC+06:00) Dhaka, Almaty, Bishkek" },
    { value: "utc-plus-7", label: "(UTC+07:00) Hà Nội, Bangkok, Jakarta, Phnom Penh" },
    { value: "utc-plus-8", label: "(UTC+08:00) Singapore, Beijing, Hong Kong, Kuala Lumpur" },
    { value: "utc-plus-9", label: "(UTC+09:00) Tokyo, Seoul, Pyongyang" },
    { value: "utc-plus-10", label: "(UTC+10:00) Sydney, Melbourne, Brisbane, Port Moresby" },
    { value: "utc-plus-11", label: "(UTC+11:00) Nouméa, Honiara, Magadan" },
    { value: "utc-plus-12", label: "(UTC+12:00) Auckland, Wellington, Suva" },
    { value: "utc-plus-13", label: "(UTC+13:00) Apia, Nukuʻalofa, Fakaofo" },
    { value: "utc-plus-14", label: "(UTC+14:00) Kiritimati / Christmas Island, Line Islands" },
];

function normalizeTimezoneValue(value?: string) {
    if (!value) {
        return DEFAULT_SETTINGS.localization.timezone;
    }

    if (value.startsWith("utc-plus-") || value.startsWith("utc-minus-")) {
        return value;
    }

    if (value === "utc") {
        return "utc-plus-0";
    }

    const legacyOffset = value.match(/^utc-(\d+)$/)?.[1];
    if (legacyOffset) {
        return `utc-plus-${legacyOffset}`;
    }

    return DEFAULT_SETTINGS.localization.timezone;
}

function readSavedSettings() {
    if (typeof window === "undefined") {
        return DEFAULT_SETTINGS;
    }

    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) {
        return DEFAULT_SETTINGS;
    }

    try {
        const parsed = JSON.parse(saved) as Partial<AdminSettingsState>;
        return {
            borrowing: { ...DEFAULT_SETTINGS.borrowing, ...parsed.borrowing },
            features: { ...DEFAULT_SETTINGS.features, ...parsed.features },
            localization: {
                ...DEFAULT_SETTINGS.localization,
                ...parsed.localization,
                timezone: normalizeTimezoneValue(parsed.localization?.timezone),
            },
        };
    } catch {
        return DEFAULT_SETTINGS;
    }
}

function SectionCard({ icon: Icon, title, children }: { icon: ElementType; title: string; children: ReactNode }) {
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

function PolicyField({ label, value, suffix, onChange }: { label: string; value: string; suffix?: string; onChange: (value: string) => void }) {
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

function FeatureToggle({
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

function GatewayRow({
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

function SelectField({
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

function ConfirmDiscardModal({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: () => void; onConfirm: () => void }) {
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

export default function CaiDatPage() {
    const [adminSettings, setAdminSettings] = useState(DEFAULT_SETTINGS);
    const [savedSettings, setSavedSettings] = useState(DEFAULT_SETTINGS);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showDiscardModal, setShowDiscardModal] = useState(false);

    useEffect(() => {
        const loaded = readSavedSettings();
        setAdminSettings(loaded);
        setSavedSettings(loaded);
    }, []);

    const hasChanges = JSON.stringify(adminSettings) !== JSON.stringify(savedSettings);

    const updateBorrowing = (key: keyof AdminSettingsState["borrowing"], value: string) => {
        setAdminSettings((current) => ({
            ...current,
            borrowing: {
                ...current.borrowing,
                [key]: value,
            },
        }));
    };

    const updateFeature = (key: keyof AdminSettingsState["features"], value: boolean) => {
        setAdminSettings((current) => ({
            ...current,
            features: {
                ...current.features,
                [key]: value,
            },
        }));
    };

    const updateLocalization = (key: keyof AdminSettingsState["localization"], value: string) => {
        setAdminSettings((current) => ({
            ...current,
            localization: {
                ...current.localization,
                [key]: value,
            },
        }));
    };

    const handleSave = () => {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(adminSettings));
        setSavedSettings(adminSettings);
        setShowSuccessModal(true);
        window.setTimeout(() => setShowSuccessModal(false), 3000);
    };

    const confirmDiscard = () => {
        setAdminSettings(savedSettings);
        setShowDiscardModal(false);
    };

    return (
        <div className="flex min-h-screen w-full flex-col bg-surface pb-28 text-on-surface">
            <div className="px-8 pb-2 pt-8">
                <AdminBreadcrumb pageName={UI_TEXT.ADMIN.SIDEBAR.NAV_SETTINGS} />
            </div>

            <div className="flex items-center justify-between border-y border-surface-container-high bg-white px-8 py-6">
                <div>
                    <h1 className="flex items-center gap-2 text-[28px] font-semibold leading-tight text-ink-950">
                        <Settings size={24} className="text-primary-600" />
                        {SETTINGS.PAGE_TITLE}
                    </h1>
                    <p className="mt-1 text-[14px] text-on-surface-variant">{SETTINGS.PAGE_DESCRIPTION}</p>
                </div>
            </div>

            <main className="flex-1 overflow-auto p-8">
                <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-start gap-lg xl:grid-cols-12 xl:gap-xl">
                    <div className="xl:col-span-7">
                        <SectionCard icon={BookOpen} title={SETTINGS.BORROWING.TITLE}>
                            <div className="grid grid-cols-1 gap-lg md:grid-cols-2">
                                {borrowingFields.map((field) => (
                                    <PolicyField
                                        key={field.key}
                                        label={field.label}
                                        value={adminSettings.borrowing[field.key]}
                                        suffix={field.suffix}
                                        onChange={(value) => updateBorrowing(field.key, value)}
                                    />
                                ))}
                                <div className="md:col-span-2">
                                    <div className="max-w-sm">
                                        <PolicyField
                                            label={SETTINGS.BORROWING.MAX_RENEWALS}
                                            value={adminSettings.borrowing.maxRenewals}
                                            onChange={(value) => updateBorrowing("maxRenewals", value)}
                                        />
                                    </div>
                                    <p className="mt-xs text-[13px] leading-5 text-on-surface-variant">* {SETTINGS.BORROWING.RENEWALS_HELP}</p>
                                </div>
                            </div>
                        </SectionCard>
                    </div>

                    <div className="xl:col-span-5">
                        <SectionCard icon={ToggleRight} title={SETTINGS.FEATURES.TITLE}>
                            <div className="flex flex-col gap-lg">
                                {featureItems.map((item, index) => (
                                    <FeatureToggle
                                        key={item.title}
                                        id={`feature-toggle-${index}`}
                                        title={item.title}
                                        description={item.description}
                                        icon={item.icon}
                                        checked={adminSettings.features[item.key]}
                                        onChange={(checked) => updateFeature(item.key, checked)}
                                    />
                                ))}
                            </div>
                        </SectionCard>
                    </div>

                    <div className="xl:col-span-7">
                        <SectionCard icon={WalletCards} title={SETTINGS.PAYMENTS.TITLE}>
                            <div className="flex flex-col gap-md">
                                <GatewayRow
                                    icon={Landmark}
                                    name={SETTINGS.PAYMENTS.MOMO_NAME}
                                    description={SETTINGS.PAYMENTS.MOMO_DESC}
                                    note={SETTINGS.PAYMENTS.MOMO_NOTE}
                                    token={SETTINGS.PAYMENTS.MOMO_TOKEN}
                                    active
                                />
                                <GatewayRow
                                    icon={CreditCard}
                                    name={SETTINGS.PAYMENTS.VNPAY_NAME}
                                    description={SETTINGS.PAYMENTS.VNPAY_DESC}
                                    note={SETTINGS.PAYMENTS.VNPAY_NOTE}
                                    token={SETTINGS.PAYMENTS.VNPAY_TOKEN}
                                    active={false}
                                />
                            </div>
                        </SectionCard>
                    </div>

                    <div className="grid grid-cols-1 gap-lg md:grid-cols-2 xl:col-span-5 xl:grid-cols-1">
                        <SectionCard icon={Globe2} title={SETTINGS.LOCALIZATION.LANGUAGE}>
                            <SelectField
                                label=""
                                value={adminSettings.localization.language}
                                onChange={(value) => updateLocalization("language", value)}
                                options={languageOptions}
                            />
                        </SectionCard>

                        <SectionCard icon={Clock3} title={SETTINGS.LOCALIZATION.WORLD_CLOCK}>
                            <SelectField
                                label=""
                                value={adminSettings.localization.timezone}
                                onChange={(value) => updateLocalization("timezone", value)}
                                options={timezoneOptions}
                            />
                        </SectionCard>
                    </div>
                </div>
            </main>

            {hasChanges && (
                <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-surface-container-high bg-white px-8 py-4 shadow-lg">
                    <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-md">
                        <p className="text-body-sm text-on-surface-variant">{SETTINGS.ACTION_BAR.WARNING}</p>
                        <div className="flex gap-sm">
                            <button
                                type="button"
                                onClick={() => setShowDiscardModal(true)}
                                className="focus-ring h-10 rounded-lg border border-outline px-md text-body-md font-medium text-on-surface-variant transition-colors hover:bg-surface-container-low"
                            >
                                {SETTINGS.ACTION_BAR.DISCARD}
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                className="focus-ring flex h-10 items-center gap-sm rounded-lg bg-primary px-md text-body-md font-semibold text-on-primary shadow-md transition-colors hover:bg-primary-container"
                            >
                                <Save size={16} />
                                {SETTINGS.ACTION_BAR.SAVE}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <SuccessModal isOpen={showSuccessModal} message={SETTINGS.ACTION_BAR.SUCCESS} onClose={() => setShowSuccessModal(false)} />

            <ConfirmDiscardModal isOpen={showDiscardModal} onClose={() => setShowDiscardModal(false)} onConfirm={confirmDiscard} />
        </div>
    );
}
