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
};

export const VISIT_HOURS = Array.from({ length: 12 }, (_, index) => index.toString().padStart(2, "0"));

export const VISIT_MINUTES = Array.from({ length: 60 }, (_, index) => index.toString().padStart(2, "0"));

export const VISIT_PERIODS = ["AM", "PM"];

export const BOOK_VISIT_INPUT_CLASS_NAME =
    "h-12 w-full rounded-lg border border-transparent bg-surface px-4 font-body-md text-body-md text-on-surface outline-none transition-all duration-200 placeholder:text-outline focus:border-primary focus:ring-1 focus:ring-primary dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-secondary-300 dark:focus:ring-secondary-300";
