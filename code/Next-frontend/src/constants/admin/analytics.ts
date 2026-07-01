import { UI_TEXT } from "@/constants/ui-text";
import type { MonthRangeSelection } from "@/types/admin-analytics";

export const ANALYTICS_TEXT = UI_TEXT.ADMIN_ANALYTICS;

export const CURRENT_MONTH_RANGE: MonthRangeSelection = {
    startYear: 2026,
    startMonth: 5,
    endYear: 2026,
    endMonth: 6,
};

export const MONTH_PICKER_OPTIONS = [
    { value: 1, label: UI_TEXT.ADMIN_ANALYTICS.MONTH_OPTIONS.M1 },
    { value: 2, label: UI_TEXT.ADMIN_ANALYTICS.MONTH_OPTIONS.M2 },
    { value: 3, label: UI_TEXT.ADMIN_ANALYTICS.MONTH_OPTIONS.M3 },
    { value: 4, label: UI_TEXT.ADMIN_ANALYTICS.MONTH_OPTIONS.M4 },
    { value: 5, label: UI_TEXT.ADMIN_ANALYTICS.MONTH_OPTIONS.M5 },
    { value: 6, label: UI_TEXT.ADMIN_ANALYTICS.MONTH_OPTIONS.M6 },
    { value: 7, label: UI_TEXT.ADMIN_ANALYTICS.MONTH_OPTIONS.M7 },
    { value: 8, label: UI_TEXT.ADMIN_ANALYTICS.MONTH_OPTIONS.M8 },
    { value: 9, label: UI_TEXT.ADMIN_ANALYTICS.MONTH_OPTIONS.M9 },
    { value: 10, label: UI_TEXT.ADMIN_ANALYTICS.MONTH_OPTIONS.M10 },
    { value: 11, label: UI_TEXT.ADMIN_ANALYTICS.MONTH_OPTIONS.M11 },
    { value: 12, label: UI_TEXT.ADMIN_ANALYTICS.MONTH_OPTIONS.M12 },
] as const;

export const YEAR_PICKER_OPTIONS = [2022, 2023, 2024, 2025, 2026] as const;
