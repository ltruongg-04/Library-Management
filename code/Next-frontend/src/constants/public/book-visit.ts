import type { VisitFormState } from "@/types/book-visit";

export const INITIAL_VISIT_FORM_STATE: VisitFormState = {
    fullName: "",
    email: "",
    phone: "",
    visitDate: "",
    visitHour: "",
    visitMinute: "",
    visitPeriod: "",
    purpose: "",
    captchaToken: "",
};

export const VISIT_TIME_STEP_MINUTES = 30;
export const DEFAULT_VISIT_DURATION_MINUTES = 60;

export const WEEKDAY_VISIT_TIME_RANGE = {
    START_MINUTES: 8 * 60,
    END_MINUTES: 20 * 60,
};

export const WEEKEND_VISIT_TIME_RANGE = {
    START_MINUTES: 9 * 60 + 30,
    END_MINUTES: 17 * 60 + 30,
};

export const BOOK_VISIT_INPUT_CLASS_NAME =
    "h-12 w-full rounded-lg border border-transparent bg-surface px-4 font-body-md text-body-md text-on-surface outline-none transition-all duration-200 placeholder:text-outline focus:border-primary focus:ring-1 focus:ring-primary dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-secondary-300 dark:focus:ring-secondary-300";
