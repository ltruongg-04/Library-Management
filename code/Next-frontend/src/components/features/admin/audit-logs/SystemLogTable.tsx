"use client";

import { useCallback, useEffect, useState } from "react";
import { History } from "lucide-react";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { UI_TEXT } from "@/constants/ui-text";
import { SystemLog, systemLogService } from "@/services/systemLog";

const textUI = UI_TEXT.ADMIN_AUDIT_LOGS.SYSTEM_LOGS;

export default function SystemLogTable() {
    const [logs, setLogs] = useState<SystemLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchLogs = useCallback(async (pageIndex: number) => {
        try {
            setLoading(true);
            setError(null);
            const data = await systemLogService.getSystemLogs(pageIndex, 10);
            setLogs(data.content);
            setTotalPages(data.totalPages);
            setPage(pageIndex);
        } catch (err: any) {
            setError(err.message || textUI.ERROR_FETCH);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLogs(0);
    }, [fetchLogs]);

    const formatDate = (dateString: string) => {
        const d = new Date(dateString);
        return new Intl.DateTimeFormat("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        }).format(d);
    };

    return (
        <div className="flex h-full flex-col bg-surface">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-surface-container-high bg-white px-8 py-6">
                <div>
                    <h1 className="flex items-center gap-2 text-[28px] font-semibold leading-tight text-ink-950">
                        <History size={24} className="text-primary-600" />
                        {textUI.PAGE_TITLE}
                    </h1>
                    <p className="mt-1 text-[14px] text-on-surface-variant">{textUI.PAGE_DESCRIPTION}</p>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-8">
                <div className="overflow-hidden rounded-xl border border-surface-container-high bg-white shadow-sm">
                    <table className="w-full text-left text-[14px]">
                        <thead className="border-b border-surface-container-high bg-surface-container-lowest">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-on-surface-variant">{textUI.TABLE_TIME}</th>
                                <th className="px-6 py-4 font-semibold text-on-surface-variant">{textUI.TABLE_ACTOR}</th>
                                <th className="px-6 py-4 font-semibold text-on-surface-variant">{textUI.TABLE_ACTION}</th>
                                <th className="px-6 py-4 font-semibold text-on-surface-variant">{textUI.TABLE_DETAILS}</th>
                                <th className="px-6 py-4 font-semibold text-on-surface-variant">{textUI.TABLE_IP}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-container-high">
                            {loading ? (
                                <TableSkeleton columns={5} rows={10} />
                            ) : error ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-error">
                                        <p>{error}</p>
                                        <button onClick={() => fetchLogs(page)} className="text-primary-600 mt-2 hover:underline">
                                            {textUI.BTN_RETRY}
                                        </button>
                                    </td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-outline">
                                        <History size={48} className="mx-auto mb-3 text-surface-container-highest" />
                                        <p>{textUI.EMPTY_STATE}</p>
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log.id} className="transition-colors hover:bg-surface-container-lowest/50">
                                        <td className="whitespace-nowrap px-6 py-4 text-on-surface-variant">{formatDate(log.createdAt)}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-ink-950">{log.userFullName || textUI.GUEST}</div>
                                            {log.userEmail && <div className="text-xs text-on-surface-variant">{log.userEmail}</div>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center rounded-md bg-primary-container px-2 py-1 text-xs font-medium text-on-primary-container">
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="max-w-xs truncate px-6 py-4 text-on-surface-variant" title={log.details}>
                                            {log.details}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs text-on-surface-variant">{log.ipAddress || textUI.NA_IP}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="mt-4 flex items-center justify-between">
                        <div className="text-sm text-on-surface-variant">
                            {textUI.PAGE_INFO} {page + 1} / {totalPages}
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => fetchLogs(page - 1)} disabled={page === 0} className="rounded border px-3 py-1 disabled:opacity-50">
                                {textUI.BTN_PREV}
                            </button>
                            <button
                                onClick={() => fetchLogs(page + 1)}
                                disabled={page >= totalPages - 1}
                                className="rounded border px-3 py-1 disabled:opacity-50"
                            >
                                {textUI.BTN_NEXT}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
