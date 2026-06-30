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

export const timezoneOptions = [
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
    { value: "utc-plus-13", label: "(UTC+13:00) Apia, NukuÊ»alofa, Fakaofo" },
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
