"use client";

import { Calendar, CheckCircle, Clock, XCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ADMIN_BOOK_VISITS } from "@/constants/ui-text/admin";

export default function BookVisitTable({
    visits,
    loading,
    onUpdateStatus,
}: {
    visits: any[];
    loading?: boolean;
    onUpdateStatus?: (id: number, status: string) => Promise<void>;
}) {
    const renderStatusBadge = (status: string) => {
        if (status === "COMPLETED") {
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-100 px-2.5 py-0.5 font-body-sm text-xs text-green-700 dark:border-green-900/50 dark:bg-green-900/30 dark:text-green-400">
                    <CheckCircle size={14} />
                    {ADMIN_BOOK_VISITS.STATUS_LABELS.COMPLETED}
                </span>
            );
        }
        if (status === "CANCELLED" || status === "NO_SHOW") {
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-100 px-2.5 py-0.5 font-body-sm text-xs font-medium text-red-700 dark:border-red-900/50 dark:bg-red-900/30 dark:text-red-400">
                    <XCircle size={14} />
                    {ADMIN_BOOK_VISITS.STATUS_LABELS.CANCELLED}
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-yellow-200 bg-yellow-100 px-2.5 py-0.5 font-body-sm text-xs text-yellow-700 dark:border-yellow-900/50 dark:bg-yellow-900/30 dark:text-yellow-400">
                <Clock size={14} />
                {ADMIN_BOOK_VISITS.STATUS_LABELS.PENDING}
            </span>
        );
    };

    return (
        <div className="level-1-shadow relative flex flex-1 flex-col overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest dark:border-white/10 dark:bg-zinc-900">
            {/* Table Header */}
            <div className="sticky top-0 z-10 grid grid-cols-12 gap-4 border-b border-outline-variant/30 bg-surface-bright/50 p-md font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant backdrop-blur-sm dark:border-white/10 dark:bg-zinc-800 dark:text-white/60">
                <div className="col-span-2 md:col-span-1">{ADMIN_BOOK_VISITS.TABLE.COL_ID}</div>
                <div className="col-span-4 md:col-span-3">{ADMIN_BOOK_VISITS.TABLE.COL_CUSTOMER}</div>
                <div className="col-span-3 hidden md:block">{ADMIN_BOOK_VISITS.TABLE.COL_DATE}</div>
                <div className="col-span-3 md:col-span-2">{ADMIN_BOOK_VISITS.TABLE.COL_STATUS}</div>
                <div className="col-span-3 text-right">{ADMIN_BOOK_VISITS.TABLE.COL_ACTIONS}</div>
            </div>

            {/* Table Body */}
            <div className="flex min-h-[400px] flex-col overflow-y-auto">
                {loading ? (
                    Array.from({ length: 5 }).map((_, idx) => (
                        <div key={idx} className="grid grid-cols-12 items-center gap-4 border-b border-surface-variant p-md dark:border-white/10">
                            <div className="col-span-2 md:col-span-1">
                                <Skeleton className="h-6 w-12 rounded-md" />
                            </div>
                            <div className="col-span-4 flex flex-col gap-2 md:col-span-3">
                                <Skeleton className="h-5 w-32 rounded-md" />
                                <Skeleton className="h-4 w-40 rounded-md" />
                            </div>
                            <div className="col-span-3 hidden md:block">
                                <Skeleton className="h-5 w-24 rounded-md" />
                            </div>
                            <div className="col-span-3 md:col-span-2">
                                <Skeleton className="h-6 w-20 rounded-full" />
                            </div>
                            <div className="col-span-3 flex justify-end gap-2">
                                <Skeleton className="h-8 w-16 rounded-md" />
                                <Skeleton className="h-8 w-16 rounded-md" />
                            </div>
                        </div>
                    ))
                ) : visits.length === 0 ? (
                    <div className="flex flex-1 flex-col items-center justify-center p-12 text-center opacity-70">
                        <Calendar size={64} className="mb-4 text-outline dark:text-white/40" />
                        <h3 className="font-title-lg text-title-lg text-on-surface dark:text-white">{ADMIN_BOOK_VISITS.NO_DATA}</h3>
                    </div>
                ) : (
                    visits.map((visit) => (
                        <div
                            key={visit.id}
                            className="grid grid-cols-12 items-center gap-4 border-b border-surface-variant p-md transition-colors hover:bg-surface-container-low dark:border-white/10 dark:hover:bg-zinc-800/50"
                        >
                            {/* ID */}
                            <div className="col-span-2 font-medium text-on-surface dark:text-white md:col-span-1">#{visit.id}</div>

                            {/* Customer */}
                            <div className="col-span-4 flex flex-col md:col-span-3">
                                <span className="line-clamp-1 font-medium text-on-surface dark:text-white">{visit.fullName}</span>
                                <span className="line-clamp-1 text-xs text-on-surface-variant dark:text-white/60">{visit.email}</span>
                            </div>

                            {/* Date */}
                            <div className="col-span-3 hidden text-sm text-on-surface dark:text-white/80 md:block">{visit.visitDate}</div>

                            {/* Status */}
                            <div className="col-span-3 md:col-span-2">{renderStatusBadge(visit.status)}</div>

                            {/* Actions */}
                            <div className="col-span-3 flex justify-end gap-2">
                                {visit.status === "PENDING" && onUpdateStatus && (
                                    <>
                                        <button
                                            onClick={() => onUpdateStatus(visit.id, "COMPLETED")}
                                            className="rounded bg-green-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-green-600 active:scale-95"
                                        >
                                            {ADMIN_BOOK_VISITS.BUTTONS.ARRIVED}
                                        </button>
                                        <button
                                            onClick={() => onUpdateStatus(visit.id, "CANCELLED")}
                                            className="rounded bg-red-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-red-600 active:scale-95"
                                        >
                                            {ADMIN_BOOK_VISITS.BUTTONS.NO_SHOW}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
