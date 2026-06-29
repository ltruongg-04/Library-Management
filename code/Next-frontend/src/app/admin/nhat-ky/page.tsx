"use client";

import { type ElementType, type ReactNode, useState } from "react";
import {
    Bot,
    CalendarDays,
    CheckCircle2,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Download,
    Eye,
    MoreVertical,
    SearchCheck,
    ShieldX,
    User,
    UserX,
    XCircle,
    Zap,
} from "lucide-react";
import AdminBreadcrumb from "@/components/features/admin/AdminBreadcrumb";
import { UI_TEXT } from "@/constants/ui-text";

const TEXT = UI_TEXT.ADMIN_AUDIT_LOGS;
const TOTAL_RECORDS = 1000;
const PAGE_SIZE = 10;
const TOTAL_PAGES = TOTAL_RECORDS / PAGE_SIZE;

type AuditResult = "success" | "failed" | "blocked";
type TimeRangeFilter = "12h" | "1d" | "3d" | "7d" | "all";
type ActorFilter = "all" | "user" | "admin" | "automation";
type ExportFormat = "txt" | "csv" | "json";
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

type AuditLog = {
    id: string;
    timestamp: string;
    occurredAt: Date;
    actor: string;
    actorFilter: Exclude<ActorFilter, "all"> | "unknown";
    initials?: string;
    actorTone: "primary" | "secondary" | "system" | "muted";
    actorIcon?: ElementType;
    action: string;
    targetObject: string;
    ipAddress: string;
    result: AuditResult;
    description: string;
};

const CURRENT_TIME = new Date("2026-06-29T15:30:00+07:00");
const timeRangeHours: Record<Exclude<TimeRangeFilter, "all">, number> = {
    "12h": 12,
    "1d": 24,
    "3d": 72,
    "7d": 168,
};
const exportFileConfig: Record<ExportFormat, { extension: string; mimeType: string; description: string }> = {
    txt: {
        extension: "txt",
        mimeType: "text/plain;charset=utf-8",
        description: "Text",
    },
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

function createDate(hoursAgo: number) {
    return new Date(CURRENT_TIME.getTime() - hoursAgo * 60 * 60 * 1000);
}

function formatDateTime(date: Date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

const auditLogs: AuditLog[] = [
    {
        id: "audit-001",
        occurredAt: createDate(2),
        timestamp: formatDateTime(createDate(2)),
        actor: "Nguyễn An (Quản trị viên)",
        actorFilter: "admin",
        initials: "NA",
        actorTone: "primary",
        action: "Cập nhật cấu hình",
        targetObject: "chinh_sach_gioi_han_tan_suat",
        ipAddress: "192.168.1.45",
        result: "success",
        description: "Quản trị viên cập nhật chính sách giới hạn tần suất truy cập API.",
    },
    {
        id: "audit-002",
        occurredAt: createDate(6),
        timestamp: formatDateTime(createDate(6)),
        actor: "Hệ thống tự động",
        actorFilter: "automation",
        actorTone: "system",
        actorIcon: Bot,
        action: "Đồng bộ dữ liệu",
        targetObject: "csdl_danh_muc_02",
        ipAddress: "10.0.0.22 (Nội bộ)",
        result: "failed",
        description: "Tác vụ đồng bộ dữ liệu danh mục bên ngoài kết thúc với trạng thái thất bại.",
    },
    {
        id: "audit-003",
        occurredAt: createDate(11),
        timestamp: formatDateTime(createDate(11)),
        actor: "Trần Minh (Người dùng)",
        actorFilter: "user",
        initials: "TM",
        actorTone: "secondary",
        action: "Tạo bản ghi",
        targetObject: "ma_bien_muc: 88472A",
        ipAddress: "203.0.113.88",
        result: "success",
        description: "Người dùng tạo bản ghi biên mục mới trong kho dữ liệu.",
    },
    {
        id: "audit-004",
        occurredAt: createDate(20),
        timestamp: formatDateTime(createDate(20)),
        actor: "Nguồn không xác định",
        actorFilter: "unknown",
        actorTone: "muted",
        actorIcon: UserX,
        action: "Thử xác thực",
        targetObject: "diem_cuoi_quan_tri_/v1",
        ipAddress: "198.51.100.14",
        result: "blocked",
        description: "Hệ thống chặn yêu cầu xác thực bất thường vào điểm cuối quản trị.",
    },
    {
        id: "audit-005",
        occurredAt: createDate(30),
        timestamp: formatDateTime(createDate(30)),
        actor: "Nguyễn An (Quản trị viên)",
        actorFilter: "admin",
        initials: "NA",
        actorTone: "primary",
        action: "Đăng nhập",
        targetObject: "tao_phien_dang_nhap",
        ipAddress: "192.168.1.45",
        result: "success",
        description: "Quản trị viên đăng nhập và hệ thống tạo phiên làm việc mới.",
    },
    {
        id: "audit-006",
        occurredAt: createDate(48),
        timestamp: formatDateTime(createDate(48)),
        actor: "Hệ thống tự động",
        actorFilter: "automation",
        actorTone: "system",
        actorIcon: Bot,
        action: "Tạo báo cáo",
        targetObject: "bao_cao_su_dung_tuan.pdf",
        ipAddress: "10.0.0.5 (Nội bộ)",
        result: "success",
        description: "Hệ thống tạo báo cáo thống kê sử dụng theo tuần.",
    },
    {
        id: "audit-007",
        occurredAt: createDate(70),
        timestamp: formatDateTime(createDate(70)),
        actor: "Lê Hương (Người dùng)",
        actorFilter: "user",
        initials: "LH",
        actorTone: "secondary",
        action: "Cập nhật hồ sơ",
        targetObject: "ho_so_doc_gia_10294",
        ipAddress: "203.0.113.41",
        result: "success",
        description: "Người dùng cập nhật thông tin hồ sơ độc giả.",
    },
    {
        id: "audit-008",
        occurredAt: createDate(96),
        timestamp: formatDateTime(createDate(96)),
        actor: "Hệ thống tự động",
        actorFilter: "automation",
        actorTone: "system",
        actorIcon: Bot,
        action: "Sao lưu dữ liệu",
        targetObject: "snapshot_du_lieu_ngay_20231025",
        ipAddress: "10.0.0.8 (Nội bộ)",
        result: "success",
        description: "Hệ thống tạo snapshot sao lưu dữ liệu định kỳ.",
    },
    {
        id: "audit-009",
        occurredAt: createDate(132),
        timestamp: formatDateTime(createDate(132)),
        actor: "Phạm Khoa (Người dùng)",
        actorFilter: "user",
        initials: "PK",
        actorTone: "secondary",
        action: "Gia hạn lượt mượn",
        targetObject: "phieu_muon_20231025_7781",
        ipAddress: "198.51.100.21",
        result: "failed",
        description: "Người dùng gia hạn lượt mượn nhưng không đáp ứng điều kiện nghiệp vụ.",
    },
    {
        id: "audit-010",
        occurredAt: createDate(160),
        timestamp: formatDateTime(createDate(160)),
        actor: "Mai Linh (Người dùng)",
        actorFilter: "user",
        initials: "ML",
        actorTone: "secondary",
        action: "Đặt mượn sách",
        targetObject: "yeu_cau_dat_muon_sach_88472A_nguoi_dung_20941",
        ipAddress: "192.0.2.73",
        result: "success",
        description: "Người dùng tạo yêu cầu đặt mượn sách từ danh mục trực tuyến.",
    },
];

const actorToneClasses: Record<AuditLog["actorTone"], string> = {
    primary: "bg-primary-container text-on-primary-container",
    secondary: "bg-secondary-container text-on-secondary-container",
    system: "bg-surface-variant text-on-surface-variant",
    muted: "bg-outline-variant text-on-surface-variant",
};

const resultConfig: Record<
    AuditResult,
    {
        label: string;
        icon: ElementType;
        classes: string;
    }
> = {
    success: {
        label: TEXT.RESULT.SUCCESS,
        icon: CheckCircle2,
        classes: "bg-success-50 text-success-700",
    },
    failed: {
        label: TEXT.RESULT.FAILED,
        icon: XCircle,
        classes: "bg-error-50 text-error-700",
    },
    blocked: {
        label: TEXT.RESULT.BLOCKED,
        icon: ShieldX,
        classes: "bg-warning-100 text-warning-800",
    },
};

function FilterControl({ label, icon: Icon, children }: { label: string; icon: ElementType; children: ReactNode }) {
    return (
        <label className="flex min-w-[220px] flex-1 flex-col gap-xs">
            <span className="font-label-caps text-label-caps text-on-surface-variant">{label}</span>
            <span className="relative">
                <Icon size={17} strokeWidth={1.9} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
                {children}
            </span>
        </label>
    );
}

function SelectControl({ value, onChange, children }: { value: string; onChange: (value: string) => void; children: ReactNode }) {
    return (
        <>
            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="h-11 w-full appearance-none rounded border-none bg-surface px-10 text-body-md text-on-surface outline-none transition-shadow focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary"
            >
                {children}
            </select>
            <ChevronDown size={18} strokeWidth={1.9} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-outline" />
        </>
    );
}

function ActorBadge({ log }: { log: AuditLog }) {
    const Icon = log.actorIcon;

    return (
        <div className="flex min-w-0 items-center gap-sm">
            <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full font-mono text-[10px] ${actorToneClasses[log.actorTone]}`}>
                {Icon ? <Icon size={14} strokeWidth={1.8} /> : log.initials}
            </span>
            <span className={`truncate font-medium ${log.actorTone === "muted" ? "text-outline" : "text-on-surface"}`}>{log.actor}</span>
        </div>
    );
}

function ResultBadge({ result }: { result: AuditResult }) {
    const config = resultConfig[result];
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-xs whitespace-nowrap rounded-full px-3 py-1 font-label-caps text-[11px] ${config.classes}`}>
            <Icon size={14} strokeWidth={2} />
            {config.label}
        </span>
    );
}

function DetailItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col gap-xs">
            <dt className="font-label-caps text-label-caps text-on-surface-variant">{label}</dt>
            <dd className="text-body-sm font-medium text-on-surface">{value}</dd>
        </div>
    );
}

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

function toExportRecord(log: AuditLog) {
    return {
        [TEXT.DETAIL.TIMESTAMP]: log.timestamp,
        [TEXT.DETAIL.ACTOR]: log.actor,
        [TEXT.DETAIL.ACTION]: log.action,
        [TEXT.DETAIL.TARGET]: log.targetObject,
        [TEXT.DETAIL.IP_ADDRESS]: log.ipAddress,
        [TEXT.DETAIL.RESULT]: resultConfig[log.result].label,
        [TEXT.DETAIL.DESCRIPTION]: log.description,
    };
}

function escapeCsvValue(value: string) {
    return `"${value.replace(/"/g, '""')}"`;
}

function createExportContent(logs: AuditLog[], format: ExportFormat) {
    if (logs.length === 0) {
        return TEXT.TABLE.EMPTY_PAGE;
    }

    if (format === "json") {
        return JSON.stringify(logs.map(toExportRecord), null, 2);
    }

    if (format === "csv") {
        const headers = [
            TEXT.DETAIL.TIMESTAMP,
            TEXT.DETAIL.ACTOR,
            TEXT.DETAIL.ACTION,
            TEXT.DETAIL.TARGET,
            TEXT.DETAIL.IP_ADDRESS,
            TEXT.DETAIL.RESULT,
            TEXT.DETAIL.DESCRIPTION,
        ];
        const rows = logs.map((log) => {
            const record = toExportRecord(log);
            return headers.map((header) => escapeCsvValue(record[header])).join(",");
        });

        return [headers.map(escapeCsvValue).join(","), ...rows].join("\n");
    }

    return logs
        .map((log, index) => {
            const record = toExportRecord(log);
            return [
                `#${index + 1}`,
                `${TEXT.DETAIL.TIMESTAMP}: ${record[TEXT.DETAIL.TIMESTAMP]}`,
                `${TEXT.DETAIL.ACTOR}: ${record[TEXT.DETAIL.ACTOR]}`,
                `${TEXT.DETAIL.ACTION}: ${record[TEXT.DETAIL.ACTION]}`,
                `${TEXT.DETAIL.TARGET}: ${record[TEXT.DETAIL.TARGET]}`,
                `${TEXT.DETAIL.IP_ADDRESS}: ${record[TEXT.DETAIL.IP_ADDRESS]}`,
                `${TEXT.DETAIL.RESULT}: ${record[TEXT.DETAIL.RESULT]}`,
                `${TEXT.DETAIL.DESCRIPTION}: ${record[TEXT.DETAIL.DESCRIPTION]}`,
            ].join("\n");
        })
        .join("\n\n");
}

export default function AuditLogsPage() {
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [timeRange, setTimeRange] = useState<TimeRangeFilter>("all");
    const [actorFilter, setActorFilter] = useState<ActorFilter>("all");
    const [actionFilter, setActionFilter] = useState("all");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [exportFormat, setExportFormat] = useState<ExportFormat>("txt");
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
        const blob = new Blob([content], { type: exportConfig.mimeType });
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
                    <h1 className="flex items-center gap-2 font-serif text-2xl font-bold text-ink-950">
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
                            <option value="txt">{TEXT.EXPORT_FORMAT_TXT}</option>
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
                            <DetailItem label={TEXT.DETAIL.RESULT} value={resultConfig[selectedLog.result].label} />
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
