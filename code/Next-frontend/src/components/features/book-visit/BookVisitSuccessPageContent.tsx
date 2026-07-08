import type { LucideIcon } from "lucide-react";
import { CalendarDays, CalendarPlus, CheckCircle2, Clock3, Home, Info, MailCheck } from "lucide-react";
import Link from "next/link";
import { UI_TEXT } from "@/constants/ui-text";
import { buildVisitCalendarHref, formatVisitDateLabel, formatVisitTimeLabel, getVisitPurposeLabel } from "@/utils/book-visit";

type BookVisitSuccessPageContentProps = {
    referenceCode?: string;
    visitDate?: string;
    visitHour?: string;
    visitMinute?: string;
    visitPeriod?: string;
    purpose?: string;
};

type DetailCard = {
    label: string;
    value: string;
    icon: LucideIcon;
};

export function BookVisitSuccessPageContent({ referenceCode, visitDate, visitHour, visitMinute, visitPeriod, purpose }: BookVisitSuccessPageContentProps) {
    const text = UI_TEXT.BOOK_VISIT.SUCCESS;
    const displayReferenceCode = referenceCode || text.FALLBACK_REFERENCE;
    const detailCards: DetailCard[] = [
        {
            label: text.DATE_LABEL,
            value: formatVisitDateLabel(visitDate),
            icon: CalendarDays,
        },
        {
            label: text.TIME_LABEL,
            value: formatVisitTimeLabel({ hour: visitHour, minute: visitMinute, period: visitPeriod }),
            icon: Clock3,
        },
        {
            label: text.PURPOSE_LABEL,
            value: getVisitPurposeLabel(purpose),
            icon: Info,
        },
    ];
    const calendarHref = buildVisitCalendarHref({
        referenceCode: displayReferenceCode,
        date: visitDate,
        hour: visitHour,
        minute: visitMinute,
        period: visitPeriod,
    });

    return (
        <div className="flex w-full flex-col bg-[linear-gradient(135deg,#f8f9fa_0%,#ffffff_52%,#e0f4ff_100%)] text-on-surface transition-colors duration-200 dark:bg-slate-950 dark:bg-none dark:text-white">
            <div className="flex flex-1 items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
                <section className="w-full max-w-xl rounded-xl border border-t-4 border-white/70 border-t-secondary bg-white/90 p-5 text-center shadow-[0_12px_32px_rgba(0,0,0,0.08)] backdrop-blur-md transition-colors duration-200 dark:border-slate-800 dark:border-t-secondary-300 dark:bg-slate-900/95 sm:p-6">
                    <div className="mb-4 flex justify-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-fixed shadow-[0_0_40px_rgba(45,188,254,0.2)] dark:bg-secondary-500/20">
                            <CheckCircle2 size={24} className="text-secondary dark:text-secondary-300" strokeWidth={2.5} aria-hidden="true" />
                        </div>
                    </div>

                    <div className="mx-auto mb-6 max-w-md">
                        <h1 className="font-display-sm text-title-lg md:text-headline-sm mb-2 text-primary-700 dark:text-primary-100">{text.TITLE}</h1>
                        <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-slate-300">{text.DESCRIPTION}</p>
                    </div>

                    <div className="mb-6 rounded-lg border border-outline-variant/30 bg-surface-bright p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] dark:border-slate-800 dark:bg-slate-950">
                        <span className="mb-1 block font-label-caps text-label-caps text-secondary dark:text-secondary-300">{text.REFERENCE_LABEL}</span>
                        <p className="break-words text-2xl font-bold leading-tight text-primary-700 dark:text-primary-100 sm:text-3xl">
                            {displayReferenceCode}
                        </p>
                    </div>

                    <div className="mb-6 grid grid-cols-1 gap-2 md:grid-cols-3">
                        {detailCards.map((item) => {
                            const Icon = item.icon;

                            return (
                                <article
                                    key={item.label}
                                    className="flex min-h-[90px] flex-col items-center justify-center rounded-lg border border-outline-variant/25 bg-white p-3 shadow-[0_4px_12px_rgba(0,0,0,0.04)] transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900"
                                >
                                    <Icon size={20} className="mb-1.5 text-secondary dark:text-secondary-300" aria-hidden="true" />
                                    <span className="mb-1 block font-label-caps text-label-caps text-on-surface-variant dark:text-slate-400">{item.label}</span>
                                    <p className="font-title-sm text-title-sm text-on-surface dark:text-white">{item.value}</p>
                                </article>
                            );
                        })}
                    </div>

                    <div className="mb-6 flex items-start gap-3 rounded-lg bg-surface-container-low p-3 text-left dark:bg-slate-800">
                        <MailCheck size={24} className="mt-0.5 shrink-0 text-secondary dark:text-secondary-300" aria-hidden="true" />
                        <div>
                            <h2 className="font-title-sm text-title-sm mb-1 text-on-surface dark:text-white">{text.INBOX_TITLE}</h2>
                            <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-slate-300">{text.INBOX_DESC}</p>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center gap-3 sm:flex-row">
                        <a
                            href={calendarHref}
                            target="_blank"
                            rel="noreferrer"
                            className="font-title-sm text-title-sm inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary-700 px-5 py-2 text-white shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all hover:bg-primary-500 active:scale-95 dark:bg-primary-500 dark:hover:bg-primary-700 sm:w-auto"
                        >
                            <CalendarPlus size={18} aria-hidden="true" />
                            {text.ADD_TO_CALENDAR}
                        </a>
                        <Link
                            href="/"
                            className="font-title-sm text-title-sm inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-secondary px-5 py-2 text-secondary transition-colors hover:bg-secondary-50 active:scale-95 dark:border-secondary-300 dark:text-secondary-300 dark:hover:bg-secondary-500/10 sm:w-auto"
                        >
                            <Home size={18} aria-hidden="true" />
                            {text.RETURN_HOME}
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
