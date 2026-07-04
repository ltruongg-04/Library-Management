"use client";

import { useState } from "react";
import { ChevronDown, Download } from "lucide-react";
import { ANALYTICS_TEXT } from "@/constants/admin/analytics";

type AnalyticsExportFormat = "csv" | "json";
type AnalyticsSummaryRecord = {
    label: string;
    value: string;
    trend?: string;
};
type AnalyticsTrendData = {
    labels: string[];
    borrowed: number[];
    returned: number[];
    overdue: number[];
};
type AnalyticsLibraryStatusData = {
    available: number;
    borrowing: number;
    reserved: number;
    maintenance: number;
};
type AnalyticsCategoryData = {
    label: string;
    value: number;
};
type AnalyticsBorrowedBookData = {
    title: string;
    author: string;
    borrows: number;
    status: string;
};
type AnalyticsActivityData = {
    title: string;
    detail: string;
    time: string;
};
export type AnalyticsExportData = {
    periodLabel: string;
    summary: AnalyticsSummaryRecord[];
    trend: AnalyticsTrendData;
    libraryStatus: AnalyticsLibraryStatusData;
    categories: AnalyticsCategoryData[];
    borrowedBooks: AnalyticsBorrowedBookData[];
    recentActivities: AnalyticsActivityData[];
};
type BrowserWritableFile = {
    write: (data: Blob) => Promise<void>;
    close: () => Promise<void>;
};
type BrowserFileHandle = {
    createWritable: () => Promise<BrowserWritableFile>;
};
type BrowserSavePicker = {
    showSaveFilePicker?: (options: {
        suggestedName: string;
        types: Array<{
            description: string;
            accept: Record<string, string[]>;
        }>;
    }) => Promise<BrowserFileHandle>;
};

const TEXT = ANALYTICS_TEXT.EXPORT;

const exportFileConfig: Record<AnalyticsExportFormat, { extension: string; mimeType: string; description: string }> = {
    csv: {
        extension: "csv",
        mimeType: "text/csv;charset=utf-8",
        description: "CSV",
    },
    json: {
        extension: "json",
        mimeType: "application/json;charset=utf-8",
        description: "JSON",
    },
};

function escapeCsvValue(value: string) {
    return `"${value.replace(/"/g, '""')}"`;
}

function createCsvSection(title: string, headers: string[], rows: string[][]) {
    return [escapeCsvValue(title), headers.map(escapeCsvValue).join(","), ...rows.map((row) => row.map(escapeCsvValue).join(","))].join("\r\n");
}

function createExportPayload(data: AnalyticsExportData) {
    return {
        period: data.periodLabel,
        summary: data.summary,
        borrowingTrend: data.trend.labels.map((label, index) => ({
            period: label,
            borrowed: data.trend.borrowed[index],
            returned: data.trend.returned[index],
            overdue: data.trend.overdue[index],
        })),
        libraryStatus: {
            available: data.libraryStatus.available,
            borrowing: data.libraryStatus.borrowing,
            reserved: data.libraryStatus.reserved,
            maintenance: data.libraryStatus.maintenance,
        },
        topCategories: data.categories,
        mostBorrowedBooks: data.borrowedBooks,
        recentActivities: data.recentActivities,
    };
}

function createExportContent(format: AnalyticsExportFormat, data: AnalyticsExportData) {
    const payload = createExportPayload(data);

    if (format === "json") {
        return JSON.stringify(payload, null, 2);
    }

    const H = ANALYTICS_TEXT.EXPORT.CSV_HEADERS;
    return [
        createCsvSection(H.PERIOD_TITLE, [H.PERIOD_VAL], [[data.periodLabel]]),
        createCsvSection(
            H.SUMMARY_TITLE,
            [H.SUMMARY_METRIC, H.SUMMARY_VAL, H.SUMMARY_NOTE],
            data.summary.map((record) => [record.label, record.value, record.trend ? `${H.SUMMARY_UP}${record.trend}` : ""]),
        ),
        createCsvSection(
            H.TREND_TITLE,
            [H.TREND_TIME, H.TREND_BORROWED, H.TREND_RETURNED, H.TREND_OVERDUE],
            data.trend.labels.map((label, index) => [
                label,
                String(data.trend.borrowed[index]),
                String(data.trend.returned[index]),
                String(data.trend.overdue[index]),
            ]),
        ),
        createCsvSection(
            H.STATUS_TITLE,
            [H.STATUS_STATE, H.STATUS_RATE],
            [
                [H.STATUS_AVAILABLE, `${data.libraryStatus.available}%`],
                [H.STATUS_BORROWING, `${data.libraryStatus.borrowing}%`],
                [H.STATUS_RESERVED, `${data.libraryStatus.reserved}%`],
                [H.STATUS_MAINTENANCE, `${data.libraryStatus.maintenance}%`],
            ],
        ),
        createCsvSection(
            H.CAT_TITLE,
            [H.CAT_NAME, H.CAT_RATE],
            data.categories.map((category) => [category.label, `${category.value}%`]),
        ),
        createCsvSection(
            H.BOOK_TITLE,
            [H.BOOK_NAME, H.BOOK_AUTHOR, H.BOOK_BORROWS, H.BOOK_STATUS],
            data.borrowedBooks.map((book) => [book.title, book.author, String(book.borrows), book.status]),
        ),
        createCsvSection(
            H.ACT_TITLE,
            [H.ACT_NAME, H.ACT_DETAIL, H.ACT_TIME],
            data.recentActivities.map((activity) => [activity.title, activity.detail, activity.time]),
        ),
    ].join("\r\n\r\n");
}

function createExportBlob(content: string, format: AnalyticsExportFormat, mimeType: string) {
    const output = format === "csv" ? `\uFEFF${content}` : content;

    return new Blob([output], { type: mimeType });
}

export default function AnalyticsExportControls({ data }: { data: AnalyticsExportData }) {
    const [exportFormat, setExportFormat] = useState<AnalyticsExportFormat>("csv");

    const handleExportRecords = async () => {
        const exportConfig = exportFileConfig[exportFormat];
        const content = createExportContent(exportFormat, data);
        const blob = createExportBlob(content, exportFormat, exportConfig.mimeType);
        const fileName = TEXT.FILENAME.replace(/\.[^.]+$/, `.${exportConfig.extension}`);
        const savePicker = (window as Window & BrowserSavePicker).showSaveFilePicker;

        if (savePicker) {
            try {
                const fileHandle = await savePicker({
                    suggestedName: fileName,
                    types: [
                        {
                            description: exportConfig.description,
                            accept: {
                                [exportConfig.mimeType.split(";")[0]]: [`.${exportConfig.extension}`],
                            },
                        },
                    ],
                });
                const writableFile = await fileHandle.createWritable();
                await writableFile.write(blob);
                await writableFile.close();
                return;
            } catch (error) {
                if (error instanceof DOMException && error.name === "AbortError") {
                    return;
                }
            }
        }

        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = downloadUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(downloadUrl);
    };

    return (
        <div className="flex shrink-0 flex-col gap-sm sm:flex-row sm:items-center">
            <label className="relative">
                <span className="sr-only">{TEXT.FORMAT_LABEL}</span>
                <select
                    value={exportFormat}
                    onChange={(event) => setExportFormat(event.target.value as AnalyticsExportFormat)}
                    className="h-11 appearance-none rounded-lg border border-outline-variant/50 bg-surface-bright py-sm pl-md pr-9 text-body-sm font-medium text-on-surface shadow-sm outline-none transition-shadow focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary"
                    aria-label={TEXT.FORMAT_LABEL}
                >
                    <option value="csv">{TEXT.FORMAT_CSV}</option>
                    <option value="json">{TEXT.FORMAT_JSON}</option>
                </select>
                <ChevronDown size={17} strokeWidth={1.9} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-outline" />
            </label>
            <button
                type="button"
                onClick={handleExportRecords}
                className="focus-ring inline-flex h-11 items-center justify-center gap-sm rounded-lg bg-primary px-lg text-body-md font-semibold text-on-primary shadow-md transition-colors hover:bg-primary-container"
            >
                <Download size={20} strokeWidth={1.9} />
                {TEXT.RECORD_BTN}
            </button>
        </div>
    );
}
