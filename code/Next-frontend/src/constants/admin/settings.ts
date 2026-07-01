import { CircleDollarSign, DatabaseBackup, Sparkles } from "lucide-react";
import { UI_TEXT } from "@/constants/ui-text";

export const SETTINGS = UI_TEXT.ADMIN_SETTINGS;
export const STORAGE_KEY = "lumina_admin_business_policies";

export type AdminSettingsState = {
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

export const DEFAULT_SETTINGS: AdminSettingsState = {
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

export const borrowingFields = [
    { key: "maxDays", label: SETTINGS.BORROWING.MAX_DAYS, suffix: undefined },
    { key: "finePerDay", label: SETTINGS.BORROWING.FINE_PER_DAY, suffix: "đ" },
    { key: "maxBooks", label: SETTINGS.BORROWING.MAX_BOOKS, suffix: undefined },
    { key: "depositPercentage", label: SETTINGS.BORROWING.DEPOSIT_PERCENTAGE, suffix: "%" },
] as const;

export const featureItems = [
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

export const languageOptions = [
    { value: "vi", label: SETTINGS.LOCALIZATION.VIETNAMESE },
    { value: "en", label: SETTINGS.LOCALIZATION.ENGLISH },
    { value: "zh", label: SETTINGS.LOCALIZATION.LANGUAGES.ZH },
    { value: "hi", label: SETTINGS.LOCALIZATION.LANGUAGES.HI },
    { value: "es", label: SETTINGS.LOCALIZATION.LANGUAGES.ES },
    { value: "fr", label: SETTINGS.LOCALIZATION.LANGUAGES.FR },
    { value: "ar", label: SETTINGS.LOCALIZATION.LANGUAGES.AR },
    { value: "bn", label: SETTINGS.LOCALIZATION.LANGUAGES.BN },
    { value: "pt", label: SETTINGS.LOCALIZATION.LANGUAGES.PT },
    { value: "ru", label: SETTINGS.LOCALIZATION.LANGUAGES.RU },
    { value: "ja", label: SETTINGS.LOCALIZATION.LANGUAGES.JA },
];

export const timezoneOptions = [
    { value: "utc-minus-12", label: SETTINGS.LOCALIZATION.TIMEZONES.UTC_MINUS_12 },
    { value: "utc-minus-11", label: SETTINGS.LOCALIZATION.TIMEZONES.UTC_MINUS_11 },
    { value: "utc-minus-10", label: SETTINGS.LOCALIZATION.TIMEZONES.UTC_MINUS_10 },
    { value: "utc-minus-9", label: SETTINGS.LOCALIZATION.TIMEZONES.UTC_MINUS_9 },
    { value: "utc-minus-8", label: SETTINGS.LOCALIZATION.TIMEZONES.UTC_MINUS_8 },
    { value: "utc-minus-7", label: SETTINGS.LOCALIZATION.TIMEZONES.UTC_MINUS_7 },
    { value: "utc-minus-6", label: SETTINGS.LOCALIZATION.TIMEZONES.UTC_MINUS_6 },
    { value: "utc-minus-5", label: SETTINGS.LOCALIZATION.TIMEZONES.UTC_MINUS_5 },
    { value: "utc-minus-4", label: SETTINGS.LOCALIZATION.TIMEZONES.UTC_MINUS_4 },
    { value: "utc-minus-3", label: SETTINGS.LOCALIZATION.TIMEZONES.UTC_MINUS_3 },
    { value: "utc-minus-2", label: SETTINGS.LOCALIZATION.TIMEZONES.UTC_MINUS_2 },
    { value: "utc-minus-1", label: SETTINGS.LOCALIZATION.TIMEZONES.UTC_MINUS_1 },
    { value: "utc-plus-0", label: SETTINGS.LOCALIZATION.TIMEZONES.UTC_PLUS_0 },
    { value: "utc-plus-1", label: SETTINGS.LOCALIZATION.TIMEZONES.UTC_PLUS_1 },
    { value: "utc-plus-2", label: SETTINGS.LOCALIZATION.TIMEZONES.UTC_PLUS_2 },
    { value: "utc-plus-3", label: SETTINGS.LOCALIZATION.TIMEZONES.UTC_PLUS_3 },
    { value: "utc-plus-4", label: SETTINGS.LOCALIZATION.TIMEZONES.UTC_PLUS_4 },
    { value: "utc-plus-5", label: SETTINGS.LOCALIZATION.TIMEZONES.UTC_PLUS_5 },
    { value: "utc-plus-6", label: SETTINGS.LOCALIZATION.TIMEZONES.UTC_PLUS_6 },
    { value: "utc-plus-7", label: SETTINGS.LOCALIZATION.TIMEZONES.UTC_PLUS_7 },
    { value: "utc-plus-8", label: SETTINGS.LOCALIZATION.TIMEZONES.UTC_PLUS_8 },
    { value: "utc-plus-9", label: SETTINGS.LOCALIZATION.TIMEZONES.UTC_PLUS_9 },
    { value: "utc-plus-10", label: SETTINGS.LOCALIZATION.TIMEZONES.UTC_PLUS_10 },
    { value: "utc-plus-11", label: SETTINGS.LOCALIZATION.TIMEZONES.UTC_PLUS_11 },
    { value: "utc-plus-12", label: SETTINGS.LOCALIZATION.TIMEZONES.UTC_PLUS_12 },
    { value: "utc-plus-13", label: SETTINGS.LOCALIZATION.TIMEZONES.UTC_PLUS_13 },
    { value: "utc-plus-14", label: SETTINGS.LOCALIZATION.TIMEZONES.UTC_PLUS_14 },
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

export function readSavedSettings() {
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
