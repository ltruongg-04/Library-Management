import type { FormEvent } from "react";
import { CheckCircle2, Clock3, Info, User } from "lucide-react";
import { BOOK_VISIT_INPUT_CLASS_NAME, VISIT_HOURS, VISIT_MINUTES, VISIT_PERIODS } from "@/constants/book-visit";
import { UI_TEXT } from "@/constants/ui-text";
import type { SubmitStatus, VisitFormState } from "@/types/book-visit";
import { Field, FormSection } from "./FormField";

type BookVisitFormProps = {
    formState: VisitFormState;
    submitStatus: SubmitStatus;
    today: string;
    isSubmitted: boolean;
    onFieldChange: (field: keyof VisitFormState, value: string) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function BookVisitForm({ formState, submitStatus, today, isSubmitted, onFieldChange, onSubmit }: BookVisitFormProps) {
    return (
        <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900 md:p-8 lg:col-span-8">
            <form className="space-y-8" onSubmit={onSubmit}>
                <FormSection icon={User} title={UI_TEXT.BOOK_VISIT.FORM.GUEST_SECTION}>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Field label={UI_TEXT.BOOK_VISIT.FORM.FULL_NAME_LABEL} htmlFor="fullName">
                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                required
                                value={formState.fullName}
                                onChange={(event) => onFieldChange("fullName", event.target.value)}
                                placeholder={UI_TEXT.BOOK_VISIT.FORM.FULL_NAME_PLACEHOLDER}
                                autoComplete="name"
                                className={BOOK_VISIT_INPUT_CLASS_NAME}
                            />
                        </Field>
                        <Field label={UI_TEXT.BOOK_VISIT.FORM.EMAIL_LABEL} htmlFor="email">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formState.email}
                                onChange={(event) => onFieldChange("email", event.target.value)}
                                placeholder={UI_TEXT.BOOK_VISIT.FORM.EMAIL_PLACEHOLDER}
                                autoComplete="email"
                                className={BOOK_VISIT_INPUT_CLASS_NAME}
                            />
                        </Field>
                        <Field label={UI_TEXT.BOOK_VISIT.FORM.PHONE_LABEL} htmlFor="phone" className="md:col-span-2">
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formState.phone}
                                onChange={(event) => onFieldChange("phone", event.target.value)}
                                placeholder={UI_TEXT.BOOK_VISIT.FORM.PHONE_PLACEHOLDER}
                                autoComplete="tel"
                                className={BOOK_VISIT_INPUT_CLASS_NAME}
                            />
                        </Field>
                    </div>
                </FormSection>

                <FormSection icon={Clock3} title={UI_TEXT.BOOK_VISIT.FORM.LOGISTICS_SECTION}>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Field label={UI_TEXT.BOOK_VISIT.FORM.DATE_LABEL} htmlFor="visitDate">
                            <input
                                id="visitDate"
                                name="visitDate"
                                type="date"
                                required
                                min={today}
                                value={formState.visitDate}
                                onChange={(event) => onFieldChange("visitDate", event.target.value)}
                                className={BOOK_VISIT_INPUT_CLASS_NAME}
                            />
                        </Field>
                        <Field label={UI_TEXT.BOOK_VISIT.FORM.TIME_LABEL} htmlFor="visitHour">
                            <div className="grid grid-cols-[1fr_1fr_0.8fr] gap-2">
                                <select
                                    id="visitHour"
                                    name="visitHour"
                                    required
                                    value={formState.visitHour}
                                    onChange={(event) => onFieldChange("visitHour", event.target.value)}
                                    className={BOOK_VISIT_INPUT_CLASS_NAME}
                                    aria-label={UI_TEXT.BOOK_VISIT.FORM.TIME_LABEL}
                                >
                                    <option value="" disabled>
                                        --
                                    </option>
                                    {VISIT_HOURS.map((hour) => (
                                        <option key={hour} value={hour}>
                                            {hour}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    id="visitMinute"
                                    name="visitMinute"
                                    required
                                    value={formState.visitMinute}
                                    onChange={(event) => onFieldChange("visitMinute", event.target.value)}
                                    className={BOOK_VISIT_INPUT_CLASS_NAME}
                                    aria-label={UI_TEXT.BOOK_VISIT.FORM.TIME_LABEL}
                                >
                                    <option value="" disabled>
                                        --
                                    </option>
                                    {VISIT_MINUTES.map((minute) => (
                                        <option key={minute} value={minute}>
                                            {minute}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    id="visitPeriod"
                                    name="visitPeriod"
                                    required
                                    value={formState.visitPeriod}
                                    onChange={(event) => onFieldChange("visitPeriod", event.target.value)}
                                    className={BOOK_VISIT_INPUT_CLASS_NAME}
                                    aria-label={UI_TEXT.BOOK_VISIT.FORM.TIME_LABEL}
                                >
                                    <option value="" disabled>
                                        --
                                    </option>
                                    {VISIT_PERIODS.map((period) => (
                                        <option key={period} value={period}>
                                            {period}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </Field>
                        <Field label={UI_TEXT.BOOK_VISIT.FORM.PURPOSE_LABEL} htmlFor="purpose" className="md:col-span-2">
                            <select
                                id="purpose"
                                name="purpose"
                                required
                                value={formState.purpose}
                                onChange={(event) => onFieldChange("purpose", event.target.value)}
                                className={BOOK_VISIT_INPUT_CLASS_NAME}
                            >
                                <option value="" disabled>
                                    {UI_TEXT.BOOK_VISIT.FORM.PURPOSE_PLACEHOLDER}
                                </option>
                                <option value="read">{UI_TEXT.BOOK_VISIT.FORM.PURPOSE_OPTIONS.READ}</option>
                                <option value="study">{UI_TEXT.BOOK_VISIT.FORM.PURPOSE_OPTIONS.STUDY}</option>
                                <option value="research">{UI_TEXT.BOOK_VISIT.FORM.PURPOSE_OPTIONS.RESEARCH}</option>
                                <option value="consult">{UI_TEXT.BOOK_VISIT.FORM.PURPOSE_OPTIONS.CONSULT}</option>
                            </select>
                        </Field>
                    </div>
                </FormSection>

                {isSubmitted && (
                    <div className="rounded-lg border border-secondary-300 bg-secondary-fixed p-4 text-on-secondary-fixed dark:border-secondary-300/40 dark:bg-secondary-500/20 dark:text-white">
                        <div className="flex items-start gap-3">
                            <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-secondary dark:text-secondary-300" />
                            <div>
                                <p className="font-semibold">{UI_TEXT.BOOK_VISIT.FORM.SUCCESS_TITLE}</p>
                                <p className="mt-1 text-body-sm">{UI_TEXT.BOOK_VISIT.FORM.SUCCESS_DESC}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex flex-col gap-4 border-t border-outline-variant/30 pt-6 dark:border-slate-800 md:flex-row md:items-center md:justify-between">
                    <p className="flex max-w-sm items-start gap-2 font-body-sm text-body-sm text-on-surface-variant dark:text-slate-300">
                        <Info size={18} className="mt-0.5 shrink-0 text-secondary dark:text-secondary-300" />
                        <span>{UI_TEXT.BOOK_VISIT.FORM.NOTE}</span>
                    </p>
                    <button
                        type="submit"
                        disabled={submitStatus === "sending"}
                        className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-lg bg-primary px-10 py-3 font-title-md text-title-md text-on-primary shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all duration-200 hover:bg-primary-container active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-primary-500 dark:hover:bg-primary-700 md:w-auto"
                    >
                        {submitStatus === "sending" ? UI_TEXT.BOOK_VISIT.FORM.TOAST_SENDING : UI_TEXT.BOOK_VISIT.FORM.SUBMIT}
                    </button>
                </div>
            </form>
        </div>
    );
}
