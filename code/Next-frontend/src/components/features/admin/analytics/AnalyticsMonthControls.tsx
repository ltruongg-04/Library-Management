"use client";

import { useState } from "react";
import { CalendarDays, X } from "lucide-react";
import { ANALYTICS_TEXT, CURRENT_MONTH_RANGE, MONTH_PICKER_OPTIONS, YEAR_PICKER_OPTIONS } from "@/constants/admin/analytics";
import type { MonthRangeSelection, TimeRange, TrendData } from "@/types/admin-analytics";

export function monthToAbsoluteIndex(year: number, month: number) {
    return year * 12 + month - 1;
}

export function normalizeMonthRange(selection: MonthRangeSelection): MonthRangeSelection {
    const startIndex = monthToAbsoluteIndex(selection.startYear, selection.startMonth);
    const endIndex = monthToAbsoluteIndex(selection.endYear, selection.endMonth);

    if (startIndex < endIndex) {
        return selection;
    }

    return {
        startYear: selection.endYear,
        startMonth: selection.endMonth,
        endYear: selection.startYear,
        endMonth: selection.startMonth,
    };
}

export function timeRangeFromMonthSelection(selection: MonthRangeSelection): TimeRange {
    const monthCount = monthToAbsoluteIndex(selection.endYear, selection.endMonth) - monthToAbsoluteIndex(selection.startYear, selection.startMonth) + 1;

    if (monthCount <= 1) return "1m";
    if (monthCount <= 3) return "3m";
    if (monthCount <= 6) return "6m";
    return "1y";
}

export function formatMonthPickerValue(year: number, month: number) {
    const monthLabel = MONTH_PICKER_OPTIONS.find((option) => option.value === month)?.label ?? `Th${month}`;
    return `${monthLabel.replace("Th", ANALYTICS_TEXT.MONTH_FORMAT.PREFIX)}${ANALYTICS_TEXT.MONTH_FORMAT.YEAR_SEPARATOR}${year}`;
}

function MonthInputControl({
    label,
    year,
    month,
    onChange,
    isMonthDisabled,
}: {
    label: string;
    year: number;
    month: number;
    onChange: (value: { year: number; month: number }) => void;
    isMonthDisabled: (value: { year: number; month: number }) => boolean;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [pickerYear, setPickerYear] = useState(year);

    return (
        <div className="relative inline-flex w-[288px] max-w-full">
            <button
                type="button"
                onClick={() => {
                    setPickerYear(year);
                    setIsOpen((current) => !current);
                }}
                className="focus-ring flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-surface px-3 text-center transition-colors hover:bg-surface-container-low"
                aria-label={label}
                aria-expanded={isOpen}
            >
                <CalendarDays size={18} className="text-on-surface-variant" />
                <span className="text-body-sm font-medium text-on-surface-variant">{label}</span>
                <span className="text-body-sm font-medium text-on-surface">{formatMonthPickerValue(year, month)}</span>
            </button>

            {isOpen ? (
                <div className="absolute left-0 top-12 z-30 w-[288px] rounded-xl border border-outline-variant/40 bg-white p-md shadow-[0_18px_40px_rgba(0,0,0,0.16)]">
                    <select
                        value={pickerYear}
                        onChange={(event) => setPickerYear(Number(event.target.value))}
                        className="mb-md h-9 w-full rounded-lg border border-outline-variant/40 bg-surface px-3 text-body-sm font-medium text-on-surface outline-none focus:border-primary"
                        aria-label={label}
                    >
                        {YEAR_PICKER_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                    <div className="grid grid-cols-4 gap-xs">
                        {MONTH_PICKER_OPTIONS.map((option) => {
                            const isActive = pickerYear === year && option.value === month;
                            const isDisabled = isMonthDisabled({ year: pickerYear, month: option.value });
                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    disabled={isDisabled}
                                    onClick={() => {
                                        onChange({ year: pickerYear, month: option.value });
                                        setIsOpen(false);
                                    }}
                                    className={`h-10 rounded-lg text-body-sm font-medium transition-colors ${
                                        isActive
                                            ? "bg-primary text-on-primary"
                                            : isDisabled
                                              ? "cursor-not-allowed bg-surface-container-low text-outline/45 opacity-60"
                                              : "bg-surface-container-low text-on-surface hover:bg-primary-50"
                                    }`}
                                    aria-disabled={isDisabled}
                                >
                                    {option.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ) : null}
        </div>
    );
}

export function MonthRangeControls({
    value,
    onChange,
    showReset,
}: {
    value: MonthRangeSelection;
    onChange: (value: MonthRangeSelection) => void;
    showReset: boolean;
}) {
    const latestAvailableIndex = monthToAbsoluteIndex(CURRENT_MONTH_RANGE.endYear, CURRENT_MONTH_RANGE.endMonth);
    const startIndex = monthToAbsoluteIndex(value.startYear, value.startMonth);
    const endIndex = monthToAbsoluteIndex(value.endYear, value.endMonth);
    const updateSelection = (nextSelection: MonthRangeSelection) => {
        onChange(normalizeMonthRange(nextSelection));
    };

    return (
        <span className="inline-flex flex-wrap items-center gap-3">
            <MonthInputControl
                label={ANALYTICS_TEXT.CALENDAR_FROM_LABEL}
                year={value.startYear}
                month={value.startMonth}
                isMonthDisabled={(inputValue) => {
                    const candidateIndex = monthToAbsoluteIndex(inputValue.year, inputValue.month);
                    return candidateIndex >= endIndex || candidateIndex > latestAvailableIndex;
                }}
                onChange={(inputValue) => updateSelection({ ...value, startYear: inputValue.year, startMonth: inputValue.month })}
            />
            <MonthInputControl
                label={ANALYTICS_TEXT.CALENDAR_TO_LABEL}
                year={value.endYear}
                month={value.endMonth}
                isMonthDisabled={(inputValue) => {
                    const candidateIndex = monthToAbsoluteIndex(inputValue.year, inputValue.month);
                    return candidateIndex <= startIndex || candidateIndex > latestAvailableIndex;
                }}
                onChange={(inputValue) => updateSelection({ ...value, endYear: inputValue.year, endMonth: inputValue.month })}
            />
            {showReset ? (
                <button
                    type="button"
                    onClick={() => onChange(CURRENT_MONTH_RANGE)}
                    className="focus-ring flex h-11 w-11 items-center justify-center rounded-lg border border-error/30 bg-error-50 text-error transition-colors hover:bg-error-100"
                    title={ANALYTICS_TEXT.CALENDAR_RESET_LABEL}
                    aria-label={ANALYTICS_TEXT.CALENDAR_RESET_LABEL}
                >
                    <X size={20} strokeWidth={2.2} />
                </button>
            ) : null}
        </span>
    );
}

function monthFromAbsoluteIndex(index: number) {
    return {
        year: Math.floor(index / 12),
        month: (index % 12) + 1,
    };
}

function formatTrendMonthLabel(year: number, month: number, selectedYear: number) {
    return year === selectedYear ? `Th${month}` : `Th${month}/${String(year).slice(-2)}`;
}

function metricForMonth(year: number, month: number, multiplier: number) {
    const yearLift = (year - 2022) * 36;
    const seasonalLift = Math.sin(((month - 2) / 12) * Math.PI * 2) * 32;
    return Math.round((230 + yearLift + month * 14 + seasonalLift) * multiplier);
}

export function buildTrendData(selection: MonthRangeSelection): TrendData {
    const selected = normalizeMonthRange(selection);
    const firstIndex = monthToAbsoluteIndex(selected.startYear, selected.startMonth);
    const lastIndex = monthToAbsoluteIndex(selected.endYear, selected.endMonth);
    const points = Array.from({ length: lastIndex - firstIndex + 1 }, (_, index) => monthFromAbsoluteIndex(firstIndex + index));

    return {
        labels: points.map((point) => formatTrendMonthLabel(point.year, point.month, selected.startYear)),
        borrowed: points.map((point) => metricForMonth(point.year, point.month, 1)),
        returned: points.map((point) => metricForMonth(point.year, point.month, 0.82)),
        overdue: points.map((point) => Math.max(18, metricForMonth(point.year, point.month, 0.13) + (point.month % 3) * 3)),
    };
}
