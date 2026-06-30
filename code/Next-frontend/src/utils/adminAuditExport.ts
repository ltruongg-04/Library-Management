import { UI_TEXT } from "@/constants/ui-text";
import type { AuditLog, ExportFormat } from "@/types/admin-audit-log";

const TEXT = UI_TEXT.ADMIN_AUDIT_LOGS;
const DESCRIPTION_HEADER = "Mô tả";

type BrowserWritableFile = {
    write: (data: Blob) => Promise<void>;
    close: () => Promise<void>;
};

type BrowserFileHandle = {
    createWritable: () => Promise<BrowserWritableFile>;
};

export type BrowserSavePicker = {
    showSaveFilePicker?: (options: {
        suggestedName: string;
        types: Array<{
            description: string;
            accept: Record<string, string[]>;
        }>;
    }) => Promise<BrowserFileHandle>;
};

export const exportFileConfig: Record<ExportFormat, { extension: string; mimeType: string; description: string }> = {
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

function toExportRecord(log: AuditLog) {
    return {
        [TEXT.TABLE.TIMESTAMP]: log.timestamp,
        [TEXT.TABLE.USER_ENTITY]: log.actor,
        [TEXT.TABLE.ACTION]: log.action,
        [TEXT.TABLE.TARGET_OBJECT]: log.targetObject,
        [TEXT.TABLE.IP_ADDRESS]: log.ipAddress,
        [TEXT.TABLE.RESULT]: TEXT.RESULT[log.result.toUpperCase() as "SUCCESS" | "FAILED" | "BLOCKED"],
        [DESCRIPTION_HEADER]: log.description,
    };
}

function escapeCsvValue(value: string) {
    return `"${value.replace(/"/g, '""')}"`;
}

export function createExportContent(logs: AuditLog[], format: ExportFormat) {
    const records = logs.map(toExportRecord);

    if (format === "json") {
        return JSON.stringify(records, null, 2);
    }

    const headers = [
        TEXT.TABLE.TIMESTAMP,
        TEXT.TABLE.USER_ENTITY,
        TEXT.TABLE.ACTION,
        TEXT.TABLE.TARGET_OBJECT,
        TEXT.TABLE.IP_ADDRESS,
        TEXT.TABLE.RESULT,
        DESCRIPTION_HEADER,
    ];
    const rows = records.map((record) => headers.map((header) => escapeCsvValue(String(record[header as keyof typeof record]))).join(","));

    return [headers.map(escapeCsvValue).join(","), ...rows].join("\r\n");
}

export function createExportBlob(content: string, format: ExportFormat, mimeType: string) {
    const output = format === "csv" ? `\uFEFF${content}` : content;

    return new Blob([output], { type: mimeType });
}
