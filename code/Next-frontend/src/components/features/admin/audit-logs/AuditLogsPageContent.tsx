"use client";

import { useState } from "react";
import { Bot, CalendarDays, ChevronDown, ChevronLeft, ChevronRight, Download, Eye, MoreVertical, SearchCheck, User, Zap } from "lucide-react";
import AdminBreadcrumb from "@/components/features/admin/AdminBreadcrumb";
import { UI_TEXT } from "@/constants/ui-text";
import { CURRENT_TIME, auditLogs, timeRangeHours } from "@/mocks/adminAuditLogs";
import type { ActorFilter, AuditLog, ExportFormat, TimeRangeFilter } from "@/types/admin-audit-log";
import { type BrowserSavePicker, createExportBlob, createExportContent, exportFileConfig } from "@/utils/adminAuditExport";
import { ActorBadge, DetailItem, FilterControl, ResultBadge, SelectControl } from "./AuditLogControls";

const TEXT = UI_TEXT.ADMIN_AUDIT_LOGS;
const TOTAL_RECORDS = 1000;
const PAGE_SIZE = 10;
const TOTAL_PAGES = TOTAL_RECORDS / PAGE_SIZE;

function getPaginationItems(currentPage: number) {
    const pages = new Set([1, 2, TOTAL_PAGES - 1, TOTAL_PAGES, currentPage - 1, currentPage, currentPage + 1]);

    if (currentPage <= 3) {
        pages.add(3);
    }

    if (currentPage >= TOTAL_PAGES - 2) {
        pages.add(TOTAL_PAGES - 2);
    }

    const sortedPages = Array.from(pages)
        .filter((page) => page >= 1 && page <= TOTAL_PAGES)
        .sort((first, second) => first - second);

    return sortedPages.reduce<Array<number | "ellipsis">>((items, page) => {
        const previous = items[items.length - 1];
        if (typeof previous === "number" && page - previous > 1) {
            items.push("ellipsis");
        }
        items.push(page);
        return items;
    }, []);
}

export default function AuditLogsPage() {
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [timeRange, setTimeRange] = useState<TimeRangeFilter>("all");
    const [actorFilter, setActorFilter] = useState<ActorFilter>("all");
    const [actionFilter, setActionFilter] = useState("all");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [exportFormat, setExportFormat] = useState<ExportFormat>("csv");
    const paginationItems = getPaginationItems(currentPage);
    const actionOptions = Array.from(new Set(auditLogs.map((log) => log.action)));
    const normalizedSearchKeyword = searchKeyword.trim().toLowerCase();
    const filteredLogs = auditLogs.filter((log) => {
        const isInTimeRange = timeRange === "all" || CURRENT_TIME.getTime() - log.occurredAt.getTime() <= timeRangeHours[timeRange] * 60 * 60 * 1000;
        const isInActorFilter = actorFilter === "all" || log.actorFilter === actorFilter;
        const isInActionFilter = actionFilter === "all" || log.action === actionFilter;
        const isInSearch =
            !normalizedSearchKeyword ||
            log.targetObject.toLowerCase().includes(normalizedSearchKeyword) ||
            log.ipAddress.toLowerCase().includes(normalizedSearchKeyword);

        return isInTimeRange && isInActorFilter && isInActionFilter && isInSearch;
    });
    const visibleLogs = currentPage === 1 ? filteredLogs.slice(0, PAGE_SIZE) : [];
    const paginationStart = currentPage === 1 ? 1 : (currentPage - 1) * PAGE_SIZE;
    const paginationEnd = currentPage * PAGE_SIZE;
    const paginationSummary = TEXT.TABLE.PAGINATION_SUMMARY.replace("{start}", String(paginationStart))
        .replace("{end}", String(paginationEnd))
        .replace("{total}", String(TOTAL_RECORDS));
    const handleExportRecords = async () => {
        const exportConfig = exportFileConfig[exportFormat];
        const content = createExportContent(filteredLogs, exportFormat);
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
        <div className="flex min-h-screen w-full flex-col bg-surface">
            <div className="px-8 pb-2 pt-8">
                <AdminBreadcrumb pageName={TEXT.BREADCRUMB_LABEL} />
            </div>
            <div className="flex items-center justify-between border-y border-surface-container-high bg-white px-8 py-6">
                <div>
                    <h1 className="flex items-center gap-2 text-[28px] font-semibold leading-tight text-ink-950">
                        <Bot size={24} className="text-primary-600" />
                        {TEXT.PAGE_TITLE}
                        {selectedLog ? (
                            <>
                                <ChevronDown size={28} strokeWidth={1.8} className="-rotate-90 text-on-surface-variant" aria-hidden="true" />
                                <span className="text-on-surface-variant">{TEXT.DETAIL_TITLE}</span>
                            </>
                        ) : null}
                    </h1>
                    <p className="mt-1 text-[14px] text-on-surface-variant">{TEXT.PAGE_DESCRIPTION}</p>
                </div>

                <div className="flex shrink-0 flex-col gap-sm sm:flex-row sm:items-center">
                    <label className="relative">
                        <span className="sr-only">{TEXT.EXPORT_FORMAT_LABEL}</span>
                        <select
                            value={exportFormat}
                            onChange={(event) => setExportFormat(event.target.value as ExportFormat)}
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
            </div>

            <main className="flex-1 overflow-auto p-8">
                <section className="level-1-shadow mb-lg flex flex-wrap items-end gap-md rounded-lg border border-outline-variant/20 bg-surface-container-lowest p-md">
                    <FilterControl label={TEXT.FILTERS.DATE_RANGE} icon={CalendarDays}>
                        <SelectControl
                            value={timeRange}
                            onChange={(value) => {
                                setTimeRange(value as TimeRangeFilter);
                                setCurrentPage(1);
                            }}
                        >
                            <option value="12h">{TEXT.FILTERS.DATE_12_HOURS}</option>
                            <option value="1d">{TEXT.FILTERS.DATE_1_DAY}</option>
                            <option value="3d">{TEXT.FILTERS.DATE_3_DAYS}</option>
                            <option value="7d">{TEXT.FILTERS.DATE_7_DAYS}</option>
                            <option value="all">{TEXT.FILTERS.DATE_ALL_TIME}</option>
                        </SelectControl>
                    </FilterControl>

                    <FilterControl label={TEXT.FILTERS.USER_ENTITY} icon={User}>
                        <SelectControl
                            value={actorFilter}
                            onChange={(value) => {
                                setActorFilter(value as ActorFilter);
                                setCurrentPage(1);
                            }}
                        >
                            <option value="all">{TEXT.FILTERS.ALL_USERS}</option>
                            <option value="user">{TEXT.FILTERS.USERS}</option>
                            <option value="admin">{TEXT.FILTERS.ADMINS}</option>
                            <option value="automation">{TEXT.FILTERS.AUTOMATION}</option>
                        </SelectControl>
                    </FilterControl>

                    <FilterControl label={TEXT.FILTERS.ACTION_TYPE} icon={Zap}>
                        <SelectControl
                            value={actionFilter}
                            onChange={(value) => {
                                setActionFilter(value);
                                setCurrentPage(1);
                            }}
                        >
                            <option value="all">{TEXT.FILTERS.ALL_ACTIONS}</option>
                            {actionOptions.map((action) => (
                                <option key={action} value={action}>
                                    {action}
                                </option>
                            ))}
                        </SelectControl>
                    </FilterControl>

                    <FilterControl label={TEXT.FILTERS.KEYWORD} icon={SearchCheck}>
                        <input
                            type="search"
                            value={searchKeyword}
                            onChange={(event) => {
                                setSearchKeyword(event.target.value);
                                setCurrentPage(1);
                            }}
                            placeholder={TEXT.FILTERS.KEYWORD_PLACEHOLDER}
                            className="h-11 w-full rounded border-none bg-surface py-sm pl-10 pr-md text-body-md text-on-surface outline-none transition-shadow placeholder:text-outline-variant focus:bg-surface-container-lowest focus:shadow-[0_0_0_2px_rgba(0,101,141,0.2)] focus:ring-1 focus:ring-secondary"
                        />
                    </FilterControl>
                </section>

                {selectedLog ? (
                    <section className="level-1-shadow mb-lg rounded-lg border border-outline-variant/20 bg-surface-container-lowest p-lg">
                        <div className="mb-md flex flex-col justify-between gap-sm border-b border-outline-variant/20 pb-md sm:flex-row sm:items-center">
                            <div>
                                <h2 className="text-title-md font-semibold text-primary">{TEXT.DETAIL_TITLE}</h2>
                                <p className="mt-xs text-body-sm text-on-surface-variant">{selectedLog.timestamp}</p>
                            </div>
                            <ResultBadge result={selectedLog.result} />
                        </div>
                        <dl className="grid grid-cols-1 gap-lg md:grid-cols-2 xl:grid-cols-3">
                            <DetailItem label={TEXT.DETAIL.TIMESTAMP} value={selectedLog.timestamp} />
                            <DetailItem label={TEXT.DETAIL.ACTOR} value={selectedLog.actor} />
                            <DetailItem label={TEXT.DETAIL.ACTION} value={selectedLog.action} />
                            <DetailItem label={TEXT.DETAIL.TARGET} value={selectedLog.targetObject} />
                            <DetailItem label={TEXT.DETAIL.IP_ADDRESS} value={selectedLog.ipAddress} />
                            <DetailItem label={TEXT.DETAIL.RESULT} value={TEXT.RESULT[selectedLog.result.toUpperCase() as "SUCCESS" | "FAILED" | "BLOCKED"]} />
                            <div className="md:col-span-2 xl:col-span-3">
                                <DetailItem label={TEXT.DETAIL.DESCRIPTION} value={selectedLog.description} />
                            </div>
                        </dl>
                    </section>
                ) : null}

                <section className="level-1-shadow flex min-h-[540px] flex-1 flex-col overflow-hidden rounded-lg border border-outline-variant/20 bg-surface-container-lowest">
                    <div className="flex-1 overflow-visible">
                        <table className="w-full table-fixed border-collapse text-left">
                            <colgroup>
                                <col className="w-[18%]" />
                                <col className="w-[19%]" />
                                <col className="w-[13%]" />
                                <col className="w-[17%]" />
                                <col className="w-[15%]" />
                                <col className="w-[18%]" />
                            </colgroup>
                            <thead className="sticky top-0 z-10 border-b border-outline-variant/30 bg-surface-bright">
                                <tr>
                                    <th className="px-lg py-md font-label-caps text-label-caps font-semibold text-on-surface-variant">
                                        {TEXT.TABLE.TIMESTAMP}
                                    </th>
                                    <th className="px-md py-md font-label-caps text-label-caps font-semibold text-on-surface-variant">
                                        {TEXT.TABLE.USER_ENTITY}
                                    </th>
                                    <th className="px-md py-md font-label-caps text-label-caps font-semibold text-on-surface-variant">{TEXT.TABLE.ACTION}</th>
                                    <th className="px-md py-md font-label-caps text-label-caps font-semibold text-on-surface-variant">
                                        {TEXT.TABLE.TARGET_OBJECT}
                                    </th>
                                    <th className="px-md py-md font-label-caps text-label-caps font-semibold text-on-surface-variant">
                                        {TEXT.TABLE.IP_ADDRESS}
                                    </th>
                                    <th className="px-lg py-md font-label-caps text-label-caps font-semibold text-on-surface-variant">{TEXT.TABLE.RESULT}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/10 text-body-sm">
                                {visibleLogs.map((log) => (
                                    <tr key={log.id} className="group transition-colors hover:bg-surface-container/40">
                                        <td className="truncate px-lg py-md font-mono text-[13px] text-on-surface-variant">{log.timestamp}</td>
                                        <td className="min-w-0 px-md py-md">
                                            <ActorBadge log={log} />
                                        </td>
                                        <td className="min-w-0 px-md py-md">
                                            <span className="inline-flex max-w-full truncate rounded border border-outline-variant/30 bg-surface-container px-sm py-xs font-label-caps text-[11px] text-on-surface-variant">
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="min-w-0 px-md py-md font-mono text-[13px] text-on-surface-variant transition-colors group-hover:text-primary">
                                            <span className="block truncate" title={log.targetObject}>
                                                {log.targetObject}
                                            </span>
                                        </td>
                                        <td className="truncate px-md py-md font-mono text-[13px] text-outline">{log.ipAddress}</td>
                                        <td className="relative px-lg py-md">
                                            <div className="grid grid-cols-[minmax(0,1fr)_32px] items-center gap-sm">
                                                <div className="flex justify-start">
                                                    <ResultBadge result={log.result} />
                                                </div>
                                                <button
                                                    type="button"
                                                    aria-label={TEXT.DETAIL_ACTION}
                                                    onClick={() => setOpenMenuId((current) => (current === log.id ? null : log.id))}
                                                    className="focus-ring grid h-8 w-8 place-items-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
                                                >
                                                    <MoreVertical size={18} strokeWidth={1.9} />
                                                </button>
                                            </div>
                                            {openMenuId === log.id ? (
                                                <div className="absolute right-lg top-12 z-20 w-40 rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-xs shadow-lg">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedLog(log);
                                                            setOpenMenuId(null);
                                                        }}
                                                        className="focus-ring flex h-10 w-full items-center gap-sm rounded-md px-sm text-left text-body-sm font-semibold text-on-surface transition-colors hover:bg-surface-container"
                                                    >
                                                        <Eye size={18} strokeWidth={1.8} className="text-on-surface-variant" />
                                                        {TEXT.DETAIL_ACTION}
                                                    </button>
                                                </div>
                                            ) : null}
                                        </td>
                                    </tr>
                                ))}
                                {visibleLogs.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-lg py-16 text-center text-body-md font-medium text-on-surface-variant">
                                            {TEXT.TABLE.EMPTY_PAGE}
                                        </td>
                                    </tr>
                                ) : null}
                            </tbody>
                        </table>
                    </div>

                    <footer className="flex flex-col gap-md border-t border-outline-variant/30 bg-surface-bright p-md sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-body-sm text-on-surface-variant">{paginationSummary}</p>
                        <nav className="flex flex-wrap items-center justify-end gap-xs" aria-label={TEXT.TABLE.PAGE_LABEL}>
                            <button
                                type="button"
                                disabled={currentPage === 1}
                                aria-label={TEXT.TABLE.PREVIOUS_PAGE}
                                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                                className="grid h-8 w-8 place-items-center rounded text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface disabled:opacity-50"
                            >
                                <ChevronLeft size={18} strokeWidth={1.9} />
                            </button>
                            {paginationItems.map((item, index) =>
                                item === "ellipsis" ? (
                                    <span key={`ellipsis-${index}`} className="px-xs text-body-sm text-outline-variant">
                                        ...
                                    </span>
                                ) : (
                                    <button
                                        key={item}
                                        type="button"
                                        aria-label={`${TEXT.TABLE.PAGE_LABEL} ${item}`}
                                        aria-current={item === currentPage ? "page" : undefined}
                                        onClick={() => setCurrentPage(item)}
                                        className={`h-8 min-w-8 rounded px-sm text-body-sm font-medium transition-colors ${
                                            item === currentPage ? "bg-primary-container text-on-primary" : "text-on-surface-variant hover:bg-surface-container"
                                        }`}
                                    >
                                        {item}
                                    </button>
                                ),
                            )}
                            <button
                                type="button"
                                aria-label={TEXT.TABLE.NEXT_PAGE}
                                disabled={currentPage === TOTAL_PAGES}
                                onClick={() => setCurrentPage((page) => Math.min(TOTAL_PAGES, page + 1))}
                                className="grid h-8 w-8 place-items-center rounded text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
                            >
                                <ChevronRight size={18} strokeWidth={1.9} />
                            </button>
                        </nav>
                    </footer>
                </section>
            </main>
        </div>
    );
}
