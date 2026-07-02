import type { FormEvent } from "react";
import { useMemo } from "react";
import { Clock3, Info, User } from "lucide-react";
import { BOOK_VISIT_INPUT_CLASS_NAME } from "@/constants/book-visit";
import { UI_TEXT } from "@/constants/ui-text";
import type { SubmitStatus, VisitFormState } from "@/types/book-visit";
import { buildVisitTimeValue, getVisitTimeOptions, parseVisitTimeValue } from "@/utils/book-visit";
import { Field, FormSection } from "./FormField";

type BookVisitFormProps = {
    formState: VisitFormState;
    submitStatus: SubmitStatus;
    today: string;
    onFieldChange: (field: keyof VisitFormState, value: string) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function BookVisitForm({ formState, submitStatus, today, onFieldChange, onSubmit }: BookVisitFormProps) {
    const visitTimeOptions = useMemo(() => getVisitTimeOptions(formState.visitDate), [formState.visitDate]);
    const visitTimeValue = buildVisitTimeValue(formState);
    const isVisitTimeDisabled = !formState.visitDate;
    const timePlaceholder = formState.visitDate ? UI_TEXT.BOOK_VISIT.FORM.TIME_PLACEHOLDER : UI_TEXT.BOOK_VISIT.FORM.TIME_DISABLED_PLACEHOLDER;
    const visitTimeClassName = `${BOOK_VISIT_INPUT_CLASS_NAME} ${visitTimeValue ? "" : "text-outline dark:text-slate-500"}`;

    const handleVisitTimeChange = (value: string) => {
        const { hour, minute, period } = parseVisitTimeValue(value);

        onFieldChange("visitHour", hour);
        onFieldChange("visitMinute", minute);
        onFieldChange("visitPeriod", period);
    };

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
                        <Field label={UI_TEXT.BOOK_VISIT.FORM.TIME_LABEL} htmlFor="visitTime">
                            <select
                                id="visitTime"
                                name="visitTime"
                                required
                                disabled={isVisitTimeDisabled}
                                value={visitTimeValue}
                                onChange={(event) => handleVisitTimeChange(event.target.value)}
                                className={visitTimeClassName}
                                aria-label={UI_TEXT.BOOK_VISIT.FORM.TIME_LABEL}
                            >
                                <option value="" disabled>
                                    {timePlaceholder}
                                </option>
                                {visitTimeOptions.map((timeOption) => (
                                    <option key={timeOption.value} value={timeOption.value} className="text-on-surface dark:text-white">
                                        {timeOption.label}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <Field label={UI_TEXT.BOOK_VISIT.FORM.PURPOSE_LABEL} htmlFor="purpose" className="md:col-span-2">
                            <select
                                id="purpose"
                                name="purpose"
                                required
                                value={formState.purpose}
                                onChange={(event) => onFieldChange("purpose", event.target.value)}
                                className={`${BOOK_VISIT_INPUT_CLASS_NAME} ${formState.purpose ? "" : "text-outline dark:text-slate-500"}`}
                            >
                                <option value="" disabled>
                                    {UI_TEXT.BOOK_VISIT.FORM.PURPOSE_PLACEHOLDER}
                                </option>
                                <option value="read" className="text-on-surface dark:text-white">
                                    {UI_TEXT.BOOK_VISIT.FORM.PURPOSE_OPTIONS.READ}
                                </option>
                                <option value="study" className="text-on-surface dark:text-white">
                                    {UI_TEXT.BOOK_VISIT.FORM.PURPOSE_OPTIONS.STUDY}
                                </option>
                                <option value="research" className="text-on-surface dark:text-white">
                                    {UI_TEXT.BOOK_VISIT.FORM.PURPOSE_OPTIONS.RESEARCH}
                                </option>
                                <option value="consult" className="text-on-surface dark:text-white">
                                    {UI_TEXT.BOOK_VISIT.FORM.PURPOSE_OPTIONS.CONSULT}
                                </option>
                            </select>
                        </Field>
                    </div>
                </FormSection>

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
