"use client";

import { useState } from "react";
import { ChevronDown, Download } from "lucide-react";

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

const TEXT = {
    EXPORT_FORMAT_LABEL: "Định dạng file xuất",
    EXPORT_RECORD: "Xuất bản ghi",
    EXPORT_FORMAT_CSV: "CSV",
    EXPORT_FORMAT_JSON: "JSON",
    EXPORT_FILENAME: "thong-ke-thu-vien.csv",
};

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

    return [
        createCsvSection("Khoảng thời gian", ["Giá trị"], [[data.periodLabel]]),
        createCsvSection(
            "Tổng hợp thống kê",
            ["Chỉ số", "Giá trị", "Ghi chú"],
            data.summary.map((record) => [record.label, record.value, record.trend ? `Tăng ${record.trend}` : ""]),
        ),
        createCsvSection(
            "Biểu đồ xu hướng mượn sách",
            ["Thời gian", "Đã mượn", "Đã trả", "Quá hạn"],
            data.trend.labels.map((label, index) => [
                label,
                String(data.trend.borrowed[index]),
                String(data.trend.returned[index]),
                String(data.trend.overdue[index]),
            ]),
        ),
        createCsvSection(
            "Biểu đồ trạng thái thư viện",
            ["Trạng thái", "Tỷ lệ"],
            [
                ["Có sẵn", `${data.libraryStatus.available}%`],
                ["Đang mượn", `${data.libraryStatus.borrowing}%`],
                ["Đã đặt", `${data.libraryStatus.reserved}%`],
                ["Bảo trì", `${data.libraryStatus.maintenance}%`],
            ],
        ),
        createCsvSection(
            "Thể loại nổi bật",
            ["Thể loại", "Tỷ lệ"],
            data.categories.map((category) => [category.label, `${category.value}%`]),
        ),
        createCsvSection(
            "Sách được mượn nhiều",
            ["Tựa sách", "Tác giả", "Lượt mượn", "Trạng thái"],
            data.borrowedBooks.map((book) => [book.title, book.author, String(book.borrows), book.status]),
        ),
        createCsvSection(
            "Hoạt động gần đây",
            ["Hoạt động", "Chi tiết", "Thời gian"],
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
        const fileName = TEXT.EXPORT_FILENAME.replace(/\.[^.]+$/, `.${exportConfig.extension}`);
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
                <span className="sr-only">{TEXT.EXPORT_FORMAT_LABEL}</span>
                <select
                    value={exportFormat}
                    onChange={(event) => setExportFormat(event.target.value as AnalyticsExportFormat)}
                    className="h-11 appearance-none rounded-lg border border-outline-variant/50 bg-surface-bright py-sm pl-md pr-9 text-body-sm font-medium text-on-surface shadow-sm outline-none transition-shadow focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary"
                    aria-label={TEXT.EXPORT_FORMAT_LABEL}
                >
                    <option value="csv">{TEXT.EXPORT_FORMAT_CSV}</option>
                    <option value="json">{TEXT.EXPORT_FORMAT_JSON}</option>
                </select>
                <ChevronDown size={17} strokeWidth={1.9} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-outline" />
            </label>
            <button
                type="button"
                onClick={handleExportRecords}
                className="focus-ring inline-flex h-11 items-center justify-center gap-sm rounded-lg bg-primary px-lg text-body-md font-semibold text-on-primary shadow-md transition-colors hover:bg-primary-container"
            >
                <Download size={20} strokeWidth={1.9} />
                {TEXT.EXPORT_RECORD}
            </button>
        </div>
    );
}
