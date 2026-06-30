import type { ReactNode } from "react";
import { Sparkles, TrendingUp } from "lucide-react";
import { ANALYTICS_TEXT } from "@/constants/adminAnalytics";
import type { ActivityData, BorrowedBookData, CategoryData, InsightsData, LibraryStatusData, StatCardData, TrendData } from "@/types/admin-analytics";

function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
    return <section className={`rounded-xl border border-outline-variant/25 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] ${className}`}>{children}</section>;
}

const statToneClasses = {
    books: {
        card: "border-primary/20 bg-primary-50 text-primary",
        icon: "text-primary",
        value: "text-primary-950",
    },
    available: {
        card: "border-green-200 bg-green-50 text-green-700",
        icon: "text-green-700",
        value: "text-green-950",
    },
    borrowed: {
        card: "border-secondary-container/35 bg-secondary-fixed text-secondary-container",
        icon: "text-secondary-container",
        value: "text-primary-950",
    },
    danger: {
        card: "border-error/35 bg-error-50 text-error",
        icon: "text-error",
        value: "text-error",
    },
    members: {
        card: "border-purple-200 bg-purple-50 text-purple-700",
        icon: "text-purple-700",
        value: "text-purple-950",
    },
    requests: {
        card: "border-amber-200 bg-amber-50 text-amber-700",
        icon: "text-amber-700",
        value: "text-amber-950",
    },
};

export function StatCard({ label, value, icon: Icon, trend, tone }: StatCardData) {
    const toneClasses = statToneClasses[tone];

    return (
        <article className={`rounded-xl border p-lg shadow-[0_4px_12px_rgba(0,0,0,0.04)] ${toneClasses.card}`}>
            <div className="mb-md flex items-start justify-between gap-sm">
                <h2 className="text-body-md font-medium text-on-surface-variant">{label}</h2>
                <Icon size={22} strokeWidth={1.8} className={toneClasses.icon} />
            </div>
            <div className="flex items-end gap-sm">
                <strong className={`text-[30px] font-semibold leading-none ${toneClasses.value}`}>{value}</strong>
                {trend ? (
                    <span className="inline-flex items-center gap-1 rounded bg-moss-50 px-1.5 py-0.5 text-xs font-medium text-moss-600">
                        <TrendingUp size={12} strokeWidth={2.4} />
                        {trend}
                    </span>
                ) : null}
            </div>
        </article>
    );
}

function trendCoordinates(values: number[], maxValue: number) {
    const xStep = values.length > 1 ? 100 / (values.length - 1) : 100;
    return values.map((value, index) => {
        const x = values.length === 1 ? 50 : index * xStep;
        const y = 92 - (value / maxValue) * 84;
        return { x, y };
    });
}

function trendPoints(values: number[], maxValue: number) {
    return trendCoordinates(values, maxValue)
        .map((point) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`)
        .join(" ");
}

function formatStatusLabel(label: string, value: number) {
    return `${label} (${value}%)`;
}

export function BorrowingTrend({ trend, controls }: { trend: TrendData; controls: ReactNode }) {
    const maxValue = Math.max(...trend.borrowed, ...trend.returned, ...trend.overdue);
    const hasSinglePoint = trend.labels.length === 1;
    const borrowedDots = trendCoordinates(trend.borrowed, maxValue);
    const returnedDots = trendCoordinates(trend.returned, maxValue);
    const overdueDots = trendCoordinates(trend.overdue, maxValue);

    return (
        <Panel className="p-lg">
            <div className="mb-md flex flex-col gap-sm sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-title-md font-semibold text-on-surface">{ANALYTICS_TEXT.TREND_TITLE}</h2>
                <div className="flex flex-wrap items-center gap-md text-sm text-on-surface">
                    <span className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-secondary-container" />
                        {ANALYTICS_TEXT.TREND_BORROWED}
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-green-500" />
                        {ANALYTICS_TEXT.TREND_RETURNED}
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-error-400" />
                        {ANALYTICS_TEXT.TREND_OVERDUE}
                    </span>
                </div>
            </div>
            <div className="mb-md">{controls}</div>

            <div className="relative h-64 overflow-hidden rounded-lg bg-surface-container-low px-md pb-10 pt-md">
                <svg
                    className="absolute inset-x-0 top-0 h-[calc(100%-2.5rem)] w-full"
                    preserveAspectRatio="none"
                    viewBox="0 0 100 100"
                    role="img"
                    aria-label={ANALYTICS_TEXT.TREND_ARIA}
                >
                    {hasSinglePoint ? (
                        <>
                            {borrowedDots.map((point) => (
                                <circle
                                    key={`borrowed-${point.x}-${point.y}`}
                                    cx={point.x}
                                    cy={point.y}
                                    r="2.5"
                                    fill="#2dbcfe"
                                    vectorEffect="non-scaling-stroke"
                                />
                            ))}
                            {returnedDots.map((point) => (
                                <circle
                                    key={`returned-${point.x}-${point.y}`}
                                    cx={point.x}
                                    cy={point.y}
                                    r="2.5"
                                    fill="#22c55e"
                                    vectorEffect="non-scaling-stroke"
                                />
                            ))}
                            {overdueDots.map((point) => (
                                <circle
                                    key={`overdue-${point.x}-${point.y}`}
                                    cx={point.x}
                                    cy={point.y}
                                    r="2.5"
                                    fill="#ff3730"
                                    vectorEffect="non-scaling-stroke"
                                />
                            ))}
                        </>
                    ) : (
                        <>
                            <polyline
                                points={trendPoints(trend.borrowed, maxValue)}
                                fill="none"
                                stroke="#2dbcfe"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                vectorEffect="non-scaling-stroke"
                            />
                            <polyline
                                points={trendPoints(trend.returned, maxValue)}
                                fill="none"
                                stroke="#22c55e"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                vectorEffect="non-scaling-stroke"
                            />
                            <polyline
                                points={trendPoints(trend.overdue, maxValue)}
                                fill="none"
                                stroke="#ff3730"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                vectorEffect="non-scaling-stroke"
                            />
                        </>
                    )}
                </svg>
                <div className="absolute bottom-3 left-0 flex w-full justify-between px-lg text-xs text-outline">
                    {trend.labels.map((label) => (
                        <span key={label}>{label}</span>
                    ))}
                </div>
            </div>
        </Panel>
    );
}

export function LibraryStatus({ status }: { status: LibraryStatusData }) {
    const borrowingOffset = -status.available;
    const reservedOffset = -(status.available + status.borrowing);
    const maintenanceOffset = -(status.available + status.borrowing + status.reserved);

    return (
        <Panel className="flex flex-col p-lg">
            <h2 className="mb-md text-title-md font-semibold text-on-surface">{ANALYTICS_TEXT.STATUS_TITLE}</h2>
            <div className="relative flex min-h-56 flex-1 items-center justify-center">
                <svg className="h-48 w-48 -rotate-90" viewBox="0 0 36 36" aria-label={ANALYTICS_TEXT.STATUS_ARIA} role="img">
                    <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#22c55e" strokeDasharray={`${status.available} 100`} strokeWidth="4" />
                    <circle
                        cx="18"
                        cy="18"
                        r="15.9155"
                        fill="none"
                        stroke="#2dbcfe"
                        strokeDasharray={`${status.borrowing} 100`}
                        strokeDashoffset={borrowingOffset}
                        strokeWidth="4"
                    />
                    <circle
                        cx="18"
                        cy="18"
                        r="15.9155"
                        fill="none"
                        stroke="#e1e3e4"
                        strokeDasharray={`${status.reserved} 100`}
                        strokeDashoffset={reservedOffset}
                        strokeWidth="4"
                    />
                    <circle
                        cx="18"
                        cy="18"
                        r="15.9155"
                        fill="none"
                        stroke="#ff3730"
                        strokeDasharray={`${status.maintenance} 100`}
                        strokeDashoffset={maintenanceOffset}
                        strokeWidth="4"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <strong className="text-[28px] leading-none text-on-surface">100%</strong>
                    <span className="mt-2 text-xs text-on-surface-variant">{ANALYTICS_TEXT.STATUS_CAPACITY}</span>
                </div>
            </div>
            <div className="mt-md grid grid-cols-2 gap-x-md gap-y-sm text-sm text-on-surface">
                <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                    {formatStatusLabel(ANALYTICS_TEXT.STATUS_AVAILABLE_LABEL, status.available)}
                </span>
                <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                    {formatStatusLabel(ANALYTICS_TEXT.STATUS_BORROWING_LABEL, status.borrowing)}
                </span>
                <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-surface-variant" />
                    {formatStatusLabel(ANALYTICS_TEXT.STATUS_RESERVED_LABEL, status.reserved)}
                </span>
                <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                    {formatStatusLabel(ANALYTICS_TEXT.STATUS_MAINTENANCE_LABEL, status.maintenance)}
                </span>
            </div>
        </Panel>
    );
}

export function TopCategories({ categories }: { categories: CategoryData[] }) {
    return (
        <Panel className="p-lg">
            <h2 className="mb-lg text-title-md font-semibold text-on-surface">{ANALYTICS_TEXT.CATEGORIES_TITLE}</h2>
            <div className="space-y-md">
                {categories.map((category) => (
                    <div key={category.label} className="grid grid-cols-[92px_1fr_44px] items-center gap-sm">
                        <span className="text-body-sm text-on-surface-variant">{category.label}</span>
                        <span className="h-2 overflow-hidden rounded-full bg-surface-container-low">
                            <span className={`block h-full rounded-full ${category.opacity}`} style={{ width: `${category.value}%` }} />
                        </span>
                        <span className="text-right text-body-sm font-medium text-on-surface">{category.value}%</span>
                    </div>
                ))}
            </div>
        </Panel>
    );
}

export function MostBorrowedBooks({ books }: { books: BorrowedBookData[] }) {
    return (
        <Panel className="p-lg">
            <div className="mb-md">
                <h2 className="text-title-md font-semibold text-on-surface">{ANALYTICS_TEXT.MOST_BORROWED_TITLE}</h2>
            </div>
            <div className="thin-scroll max-h-[320px] overflow-y-auto pr-sm">
                <table className="w-full table-fixed border-collapse text-left">
                    <colgroup>
                        <col className="w-[60px]" />
                        <col />
                        <col className="w-[96px]" />
                        <col className="w-[112px]" />
                    </colgroup>
                    <thead className="sticky top-0 z-10 bg-white">
                        <tr className="border-b border-surface-variant text-xs font-medium text-outline">
                            <th className="w-12 pb-sm font-medium">{ANALYTICS_TEXT.TABLE_BOOK}</th>
                            <th className="pb-sm font-medium">{ANALYTICS_TEXT.TABLE_TITLE_AUTHOR}</th>
                            <th className="pb-sm pl-md text-left font-medium">{ANALYTICS_TEXT.TABLE_BORROWS}</th>
                            <th className="pb-sm pl-sm text-left font-medium">{ANALYTICS_TEXT.TABLE_STATUS}</th>
                        </tr>
                    </thead>
                    <tbody className="text-body-sm text-on-surface">
                        {books.map((book) => (
                            <tr key={book.title} className="border-b border-surface-container-high last:border-0">
                                <td className="py-3">
                                    <div className="h-12 w-10 rounded bg-surface-variant" aria-hidden="true" />
                                </td>
                                <td className="py-3 pr-sm">
                                    <p className="truncate font-medium">{book.title}</p>
                                    <p className="truncate text-xs text-on-surface-variant">{book.author}</p>
                                </td>
                                <td className="py-3 pl-md text-left font-medium">{book.borrows}</td>
                                <td className="py-3 pl-sm text-left">
                                    <span className={`inline-flex rounded-full px-3 py-1 text-xs ${book.statusClass}`}>{book.status}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Panel>
    );
}

export function RecentActivities({ activities }: { activities: ActivityData[] }) {
    return (
        <Panel className="p-lg">
            <h2 className="mb-lg text-title-md font-semibold text-on-surface">{ANALYTICS_TEXT.ACTIVITIES_TITLE}</h2>
            <div className="thin-scroll max-h-[320px] space-y-0 overflow-y-auto pl-1 pr-sm">
                {activities.map((activity, index) => (
                    <div key={activity.title} className="relative pb-7 pl-7 last:pb-0">
                        {index < activities.length - 1 ? <span className="absolute left-[7px] top-5 h-full w-px bg-surface-variant" /> : null}
                        <span className={`absolute left-0 top-1 h-4 w-4 rounded-full border-2 bg-white ${activity.color}`} />
                        <p className="text-body-sm font-medium text-on-surface">{activity.title}</p>
                        <p className="mt-1 text-xs text-on-surface-variant">{activity.detail}</p>
                        <time className="mt-2 block text-xs text-outline">{activity.time}</time>
                    </div>
                ))}
            </div>
        </Panel>
    );
}

export function AiInsights({ insights }: { insights: InsightsData }) {
    return (
        <section className="rounded-xl bg-gradient-to-r from-primary to-secondary-container p-[2px] shadow-[0_12px_32px_rgba(0,0,0,0.1)]">
            <div className="flex flex-col gap-md rounded-[10px] bg-white p-lg sm:flex-row sm:items-center">
                <div className="grid h-[72px] w-[72px] shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                    <Sparkles size={34} strokeWidth={1.8} />
                </div>
                <div>
                    <div className="mb-sm flex flex-wrap items-center gap-sm">
                        <h2 className="text-title-md font-semibold text-on-surface">{ANALYTICS_TEXT.AI_TITLE}</h2>
                        <span className="rounded bg-secondary-fixed px-3 py-1 font-mono text-xs font-semibold text-on-secondary-fixed">
                            {ANALYTICS_TEXT.AI_BADGE}
                        </span>
                    </div>
                    <ul className="ml-5 list-disc space-y-1 text-body-md text-on-surface-variant">
                        <li>
                            {ANALYTICS_TEXT.AI_BORROW_PREFIX}
                            <strong className="text-on-surface">{insights.borrowChange}</strong>
                            {ANALYTICS_TEXT.AI_BORROW_SUFFIX}
                        </li>
                        <li>
                            {ANALYTICS_TEXT.AI_SCIENCE_PREFIX}
                            <strong className="text-on-surface">{insights.category}</strong>
                            {ANALYTICS_TEXT.AI_SCIENCE_SUFFIX}
                        </li>
                        <li>
                            {ANALYTICS_TEXT.AI_TRAFFIC_PREFIX}
                            <strong className="text-on-surface">{insights.traffic}</strong>
                            {ANALYTICS_TEXT.AI_TRAFFIC_SUFFIX}
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    );
}
