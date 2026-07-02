import type { LucideIcon } from "lucide-react";
import { CalendarDays, CalendarPlus, CheckCircle2, Clock3, Home, Info, MailCheck } from "lucide-react";
import Link from "next/link";
import { PublicFooter } from "@/components/layout/PublicFooter";
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
        <div className="flex min-h-screen flex-col bg-[linear-gradient(135deg,#f8f9fa_0%,#ffffff_52%,#e0f4ff_100%)] text-on-surface transition-colors duration-200 dark:bg-slate-950 dark:bg-none dark:text-white">
            <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                <section className="w-full max-w-3xl rounded-xl border border-t-4 border-white/70 border-t-secondary bg-white/90 p-6 text-center shadow-[0_12px_32px_rgba(0,0,0,0.08)] backdrop-blur-md transition-colors duration-200 dark:border-slate-800 dark:border-t-secondary-300 dark:bg-slate-900/95 sm:p-10 lg:p-12">
                    <div className="mb-8 flex justify-center">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-secondary-fixed shadow-[0_0_40px_rgba(45,188,254,0.2)] dark:bg-secondary-500/20">
                            <CheckCircle2 size={48} className="text-secondary dark:text-secondary-300" strokeWidth={2.5} aria-hidden="true" />
                        </div>
                    </div>

                    <div className="mx-auto mb-10 max-w-xl">
                        <h1 className="mb-3 font-display-lg text-headline-lg-mobile text-primary-700 dark:text-primary-100 md:text-headline-lg">
                            {text.TITLE}
                        </h1>
                        <p className="font-body-md text-body-md text-on-surface-variant dark:text-slate-300">{text.DESCRIPTION}</p>
                    </div>

                    <div className="mb-10 rounded-lg border border-outline-variant/30 bg-surface-bright p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] dark:border-slate-800 dark:bg-slate-950">
                        <span className="mb-2 block font-label-caps text-label-caps text-secondary dark:text-secondary-300">{text.REFERENCE_LABEL}</span>
                        <p className="break-words font-display-lg text-[40px] font-bold leading-tight text-primary-700 dark:text-primary-100 sm:text-display-lg">
                            {displayReferenceCode}
                        </p>
                    </div>

                    <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
                        {detailCards.map((item) => {
                            const Icon = item.icon;

                            return (
                                <article
                                    key={item.label}
                                    className="flex min-h-[150px] flex-col items-center justify-center rounded-lg border border-outline-variant/25 bg-white p-5 shadow-[0_4px_12px_rgba(0,0,0,0.04)] transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900"
                                >
                                    <Icon size={26} className="mb-3 text-secondary dark:text-secondary-300" aria-hidden="true" />
                                    <span className="mb-2 block font-label-caps text-label-caps text-on-surface-variant dark:text-slate-400">{item.label}</span>
                                    <p className="font-title-md text-title-md text-on-surface dark:text-white">{item.value}</p>
                                </article>
                            );
                        })}
                    </div>

                    <div className="mb-10 flex items-start gap-4 rounded-lg bg-surface-container-low p-5 text-left dark:bg-slate-800">
                        <MailCheck size={28} className="mt-1 shrink-0 text-secondary dark:text-secondary-300" aria-hidden="true" />
                        <div>
                            <h2 className="mb-2 font-title-md text-title-md text-on-surface dark:text-white">{text.INBOX_TITLE}</h2>
                            <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-slate-300">{text.INBOX_DESC}</p>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                        <a
                            href={calendarHref}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-lg bg-primary-700 px-6 py-3 font-title-md text-title-md text-white shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all hover:bg-primary-500 active:scale-95 dark:bg-primary-500 dark:hover:bg-primary-700 sm:w-auto"
                        >
                            <CalendarPlus size={22} aria-hidden="true" />
                            {text.ADD_TO_CALENDAR}
                        </a>
                        <Link
                            href="/"
                            className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-lg border border-secondary px-6 py-3 font-title-md text-title-md text-secondary transition-colors hover:bg-secondary-50 active:scale-95 dark:border-secondary-300 dark:text-secondary-300 dark:hover:bg-secondary-500/10 sm:w-auto"
                        >
                            <Home size={22} aria-hidden="true" />
                            {text.RETURN_HOME}
                        </Link>
                    </div>
                </section>
            </main>

            <PublicFooter />
        </div>
    );
}
