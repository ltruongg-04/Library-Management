import type { Metadata } from "next";
import { BookVisitSuccessPageContent } from "@/components/features/book-visit/BookVisitSuccessPageContent";
import { UI_TEXT } from "@/constants/ui-text";

type BookVisitSuccessPageProps = {
    searchParams?: {
        code?: string;
        date?: string;
        hour?: string;
        minute?: string;
        period?: string;
        purpose?: string;
    };
};

export const metadata: Metadata = {
    title: UI_TEXT.BOOK_VISIT.SUCCESS.PAGE_TITLE,
};

export default function BookVisitSuccessPage({ searchParams }: BookVisitSuccessPageProps) {
    return (
        <BookVisitSuccessPageContent
            referenceCode={searchParams?.code}
            visitDate={searchParams?.date}
            visitHour={searchParams?.hour}
            visitMinute={searchParams?.minute}
            visitPeriod={searchParams?.period}
            purpose={searchParams?.purpose}
        />
    );
}
