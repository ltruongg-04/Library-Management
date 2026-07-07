import { DEFAULT_VISIT_DURATION_MINUTES, VISIT_TIME_STEP_MINUTES, WEEKDAY_VISIT_TIME_RANGE, WEEKEND_VISIT_TIME_RANGE } from "@/constants/public/book-visit";
import { UI_TEXT } from "@/constants/ui-text";
import type { Book } from "@/types/book";
import type { VisitFormState } from "@/types/book-visit";

const VISIT_REFERENCE_PREFIX = "LM-APP";
const VISIT_REFERENCE_RANDOM_BASE = 1000;
const VISIT_REFERENCE_RANDOM_RANGE = 9000;
const VISIT_REFERENCE_PAD_LENGTH = 4;
const DATE_PART_COUNT = 3;
const SUNDAY_DAY_INDEX = 0;
const SATURDAY_DAY_INDEX = 6;
const MINUTES_PER_HOUR = 60;
const TWELVE_HOUR_CLOCK_MAX = 12;

type VisitTimeOption = {
    value: string;
    label: string;
    hour: string;
    minute: string;
    period: string;
};

export function getSelectedBookTitle({ book, loading }: { book?: Book | null; loading: boolean }) {
    if (loading) return UI_TEXT.BOOK_VISIT.INFO.BOOK_LOADING;

    return book?.title || UI_TEXT.BOOK_VISIT.INFO.BOOK_FALLBACK;
}

export function createVisitReferenceCode() {
    const randomPart = Math.floor(Math.random() * VISIT_REFERENCE_RANDOM_RANGE) + VISIT_REFERENCE_RANDOM_BASE;

    return `${VISIT_REFERENCE_PREFIX}-${randomPart.toString().padStart(VISIT_REFERENCE_PAD_LENGTH, "0")}`;
}

export function buildBookVisitSuccessUrl({ bookId, formState, confirmationCode }: { bookId: number; formState: VisitFormState; confirmationCode: string }) {
    const searchParams = new URLSearchParams({
        code: confirmationCode,
        date: formState.visitDate,
        hour: formState.visitHour,
        minute: formState.visitMinute,
        period: formState.visitPeriod,
        purpose: formState.purpose,
    });

    return `/sach/${bookId}/doc-tai-thu-vien/thanh-cong?${searchParams.toString()}`;
}

export function buildVisitTimeValue({ visitHour, visitMinute, visitPeriod }: VisitFormState) {
    if (!visitHour || !visitMinute || !visitPeriod) return "";

    return `${visitHour}:${visitMinute} ${visitPeriod}`;
}

export function parseVisitTimeValue(value: string) {
    const [time = "", period = ""] = value.split(" ");
    const [hour = "", minute = ""] = time.split(":");

    return { hour, minute, period };
}

export function getVisitTimeOptions(visitDate?: string): VisitTimeOption[] {
    const dateDay = getVisitDateDay(visitDate);

    if (dateDay === null) return [];

    const timeRange = isWeekendDay(dateDay) ? WEEKEND_VISIT_TIME_RANGE : WEEKDAY_VISIT_TIME_RANGE;
    const latestStartMinutes = timeRange.END_MINUTES - DEFAULT_VISIT_DURATION_MINUTES;
    const options: VisitTimeOption[] = [];

    for (let totalMinutes = timeRange.START_MINUTES; totalMinutes <= latestStartMinutes; totalMinutes += VISIT_TIME_STEP_MINUTES) {
        options.push(buildVisitTimeOption(totalMinutes));
    }

    return options;
}

export function formatVisitDateLabel(dateValue?: string) {
    const dateParts = dateValue?.split("-") || [];

    if (dateParts.length !== DATE_PART_COUNT) return UI_TEXT.BOOK_VISIT.SUCCESS.FALLBACK_DATE;

    const [year, month, day] = dateParts;

    if (!year || !month || !day) return UI_TEXT.BOOK_VISIT.SUCCESS.FALLBACK_DATE;

    return `${day}/${month}/${year}`;
}

export function formatVisitTimeLabel({ hour, minute, period }: { hour?: string; minute?: string; period?: string }) {
    const hour24 = toTwentyFourHour(hour, period);

    if (hour24 === null || !minute) return UI_TEXT.BOOK_VISIT.SUCCESS.FALLBACK_TIME;

    return `${hour24.toString().padStart(2, "0")}:${minute}`;
}

export function getVisitPurposeLabel(purpose?: string) {
    if (purpose === "read") return UI_TEXT.BOOK_VISIT.SUCCESS.PURPOSE_OPTIONS.READ;
    if (purpose === "study") return UI_TEXT.BOOK_VISIT.SUCCESS.PURPOSE_OPTIONS.STUDY;
    if (purpose === "research") return UI_TEXT.BOOK_VISIT.SUCCESS.PURPOSE_OPTIONS.RESEARCH;
    if (purpose === "consult") return UI_TEXT.BOOK_VISIT.SUCCESS.PURPOSE_OPTIONS.CONSULT;

    return UI_TEXT.BOOK_VISIT.SUCCESS.FALLBACK_PURPOSE;
}

export function buildVisitCalendarHref({
    referenceCode,
    date,
    hour,
    minute,
    period,
}: {
    referenceCode: string;
    date?: string;
    hour?: string;
    minute?: string;
    period?: string;
}) {
    const calendarRange = buildCalendarDateRange({ date, hour, minute, period });
    const calendarParams = new URLSearchParams({
        action: "TEMPLATE",
        text: UI_TEXT.BOOK_VISIT.SUCCESS.CALENDAR_TITLE,
        details: `${UI_TEXT.BOOK_VISIT.SUCCESS.CALENDAR_DETAILS_PREFIX}: ${referenceCode}`,
    });

    if (calendarRange) {
        calendarParams.set("dates", calendarRange);
    }

    return `https://calendar.google.com/calendar/render?${calendarParams.toString()}`;
}

function buildCalendarDateRange({ date, hour, minute, period }: { date?: string; hour?: string; minute?: string; period?: string }) {
    const dateParts = date?.split("-").map(Number) || [];
    const hour24 = toTwentyFourHour(hour, period);
    const minuteNumber = Number(minute);

    if (dateParts.length !== DATE_PART_COUNT || hour24 === null || Number.isNaN(minuteNumber)) return null;

    const [year, month, day] = dateParts;

    if (!year || !month || !day) return null;

    const startDate = new Date(Date.UTC(year, month - 1, day, hour24, minuteNumber));
    const endDate = new Date(startDate);
    endDate.setUTCMinutes(endDate.getUTCMinutes() + DEFAULT_VISIT_DURATION_MINUTES);

    return `${formatGoogleCalendarDate(startDate)}/${formatGoogleCalendarDate(endDate)}`;
}

function toTwentyFourHour(hour?: string, period?: string) {
    const hourNumber = Number(hour);

    if (Number.isNaN(hourNumber) || !period) return null;
    if (period === "PM" && hourNumber < 12) return hourNumber + 12;
    if (period === "AM" && hourNumber === 12) return 0;

    return hourNumber;
}

function formatGoogleCalendarDate(date: Date) {
    return date.toISOString().replace(/[-:]/g, "").replace(".000Z", "Z");
}

function getVisitDateDay(dateValue?: string) {
    const dateParts = dateValue?.split("-").map(Number) || [];

    if (dateParts.length !== DATE_PART_COUNT) return null;

    const [year, month, day] = dateParts;

    if (!year || !month || !day) return null;

    return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

function isWeekendDay(dayIndex: number) {
    return dayIndex === SUNDAY_DAY_INDEX || dayIndex === SATURDAY_DAY_INDEX;
}

function buildVisitTimeOption(totalMinutes: number): VisitTimeOption {
    const hour24 = Math.floor(totalMinutes / MINUTES_PER_HOUR);
    const minuteNumber = totalMinutes % MINUTES_PER_HOUR;
    const period = hour24 >= TWELVE_HOUR_CLOCK_MAX ? "PM" : "AM";
    const hour12 = hour24 % TWELVE_HOUR_CLOCK_MAX || TWELVE_HOUR_CLOCK_MAX;
    const hour = hour12.toString().padStart(2, "0");
    const minute = minuteNumber.toString().padStart(2, "0");

    return {
        value: `${hour}:${minute} ${period}`,
        label: `${hour24.toString().padStart(2, "0")}:${minute}`,
        hour,
        minute,
        period,
    };
}
