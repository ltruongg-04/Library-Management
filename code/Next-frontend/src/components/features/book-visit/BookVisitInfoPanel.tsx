import { BadgeCheck, BookOpen, CheckCircle2, Map } from "lucide-react";
import Image from "next/image";
import { UI_TEXT } from "@/constants/ui-text";
import { InfoCard } from "./InfoCard";

type BookVisitInfoPanelProps = {
    selectedBookTitle: string;
    hasBookError: boolean;
};

export function BookVisitInfoPanel({ selectedBookTitle, hasBookError }: BookVisitInfoPanelProps) {
    return (
        <aside className="space-y-4 lg:col-span-4">
            <div className="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:border-slate-800 dark:bg-slate-900">
                <div className="relative h-56">
                    <Image
                        src="/images/login-banner.jpg"
                        alt={UI_TEXT.BOOK_VISIT.INFO.IMAGE_ALT}
                        fill
                        sizes="(min-width: 1024px) 360px, 100vw"
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/85 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 text-on-primary">
                        <h2 className="font-title-md text-title-md">{UI_TEXT.BOOK_VISIT.INFO.IMAGE_TITLE}</h2>
                        <p className="font-body-sm text-body-sm text-on-primary/85">{UI_TEXT.BOOK_VISIT.INFO.IMAGE_DESC}</p>
                    </div>
                </div>
            </div>

            <InfoCard icon={BookOpen} title={UI_TEXT.BOOK_VISIT.INFO.BOOK_LABEL}>
                <p className="font-body-md text-body-md font-medium text-on-surface dark:text-white">{selectedBookTitle}</p>
                {hasBookError && <p className="mt-2 text-body-sm text-error dark:text-red-300">{UI_TEXT.BOOK_VISIT.INFO.BOOK_ERROR}</p>}
            </InfoCard>

            <InfoCard icon={Map} title={UI_TEXT.BOOK_VISIT.INFO.LOCATION_TITLE}>
                <div className="space-y-3 font-body-sm text-body-sm text-on-surface-variant dark:text-slate-300">
                    <p>
                        <strong className="text-on-surface dark:text-white">{UI_TEXT.BOOK_VISIT.INFO.BRANCH}</strong>
                        <br />
                        {UI_TEXT.BOOK_VISIT.INFO.ADDRESS_LINE_1}
                        <br />
                        {UI_TEXT.BOOK_VISIT.INFO.ADDRESS_LINE_2}
                    </p>
                    <div className="h-px bg-outline-variant/50 dark:bg-slate-800" />
                    <div className="space-y-1">
                        <div className="flex justify-between gap-4">
                            <span>{UI_TEXT.BOOK_VISIT.INFO.WEEKDAY_LABEL}</span>
                            <span>{UI_TEXT.BOOK_VISIT.INFO.WEEKDAY_TIME}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span>{UI_TEXT.BOOK_VISIT.INFO.WEEKEND_LABEL}</span>
                            <span>{UI_TEXT.BOOK_VISIT.INFO.WEEKEND_TIME}</span>
                        </div>
                    </div>
                </div>
            </InfoCard>

            <InfoCard icon={BadgeCheck} title={UI_TEXT.BOOK_VISIT.INFO.POLICY_TITLE}>
                <ul className="space-y-2 font-body-sm text-body-sm text-on-surface-variant dark:text-slate-300">
                    {UI_TEXT.BOOK_VISIT.INFO.POLICY_ITEMS.map((item) => (
                        <li key={item} className="flex gap-2">
                            <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-secondary dark:text-secondary-300" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </InfoCard>
        </aside>
    );
}
