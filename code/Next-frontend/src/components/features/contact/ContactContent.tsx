"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { MaterialIcon } from "@/components/base/material-icon";
import { UI_TEXT } from "@/constants/ui-text";
import { createSupportRequest } from "@/services/support";

const contactSchema = z.object({
    name: z.string().min(1, UI_TEXT.RECENT.TEXT_175),
    email: z.string().email(UI_TEXT.RECENT.TEXT_174),
    subject: z.string().min(1, UI_TEXT.RECENT.TEXT_173),
    message: z.string().min(10, UI_TEXT.RECENT.TEXT_172),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const FAQ_ITEMS = [
    {
        id: "faq-ai-search",
        question: UI_TEXT.CONTACT.FAQS[0].QUESTION,
        answer: UI_TEXT.CONTACT.FAQS[0].ANSWER,
    },
    {
        id: "faq-api-access",
        question: UI_TEXT.CONTACT.FAQS[1].QUESTION,
        answer: UI_TEXT.CONTACT.FAQS[1].ANSWER,
    },
    {
        id: "faq-library-hours",
        question: UI_TEXT.CONTACT.FAQS[2].QUESTION,
        answer: UI_TEXT.CONTACT.FAQS[2].ANSWER,
    },
];

export default function ContactContent() {
    const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            name: "",
            email: "",
            subject: "",
            message: "",
        },
    });

    const onSubmit = async (data: ContactFormValues) => {
        try {
            const res = await createSupportRequest(data);
            if (res.success) {
                toast.success(res.message || UI_TEXT.RECENT.TEXT_171);
                reset();
            } else {
                toast.error(res.message || UI_TEXT.RECENT.TEXT_170);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || UI_TEXT.RECENT.TEXT_169);
        }
    };

    const toggleAccordion = (id: string) => {
        setActiveAccordion((prev) => (prev === id ? null : id));
    };

    return (
        <main className="mx-auto w-full max-w-[1440px] flex-grow space-y-12 px-4 py-12 md:px-6">
            {/* Header Section */}
            <header className="mx-auto mb-12 max-w-3xl space-y-4 text-center">
                <h1 className="text-5xl font-bold leading-[56px] tracking-[-0.02em] text-primary transition-colors duration-200 dark:text-white">
                    {UI_TEXT.CONTACT.HEADING}
                </h1>
                <p className="text-base leading-6 text-on-surface-variant transition-colors duration-200 dark:text-white">{UI_TEXT.CONTACT.SUBHEADING}</p>
            </header>

            {/* Bento Grid Layout for Contact & Details */}
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
                {/* Contact Form Area (Main Focus) */}
                <section className="rounded-xl border border-surface-variant bg-surface-container-lowest p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900 md:p-12 lg:col-span-7 xl:col-span-8">
                    <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold leading-7 text-primary transition-colors duration-200 dark:text-white">
                        <MaterialIcon name="mail" className="text-secondary dark:text-white" />
                        {UI_TEXT.CONTACT.FORM_HEADING}
                    </h2>
                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-1">
                                <label
                                    className="font-mono text-xs font-medium uppercase leading-4 tracking-[0.05em] text-on-surface-variant transition-colors duration-200 dark:text-white"
                                    htmlFor="contact-name"
                                >
                                    {UI_TEXT.CONTACT.NAME_LABEL}
                                </label>
                                <input
                                    className={`w-full rounded-lg border-none bg-background p-4 text-base leading-6 text-on-surface transition-all focus:ring-1 focus:ring-primary dark:bg-slate-800 dark:text-white dark:focus:ring-white ${errors.name ? "ring-1 ring-error focus:ring-error" : ""}`}
                                    id="contact-name"
                                    placeholder={UI_TEXT.CONTACT.NAME_PLACEHOLDER}
                                    type="text"
                                    {...register("name")}
                                />
                                {errors.name && <p className="mt-1 text-xs text-error">{errors.name.message}</p>}
                            </div>
                            <div className="space-y-1">
                                <label
                                    className="font-mono text-xs font-medium uppercase leading-4 tracking-[0.05em] text-on-surface-variant transition-colors duration-200 dark:text-white"
                                    htmlFor="contact-email"
                                >
                                    {UI_TEXT.CONTACT.EMAIL_LABEL}
                                </label>
                                <input
                                    className={`w-full rounded-lg border-none bg-background p-4 text-base leading-6 text-on-surface transition-all focus:ring-1 focus:ring-primary dark:bg-slate-800 dark:text-white dark:focus:ring-white ${errors.email ? "ring-1 ring-error focus:ring-error" : ""}`}
                                    id="contact-email"
                                    placeholder="email@example.com"
                                    type="email"
                                    {...register("email")}
                                />
                                {errors.email && <p className="mt-1 text-xs text-error">{errors.email.message}</p>}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label
                                className="font-mono text-xs font-medium uppercase leading-4 tracking-[0.05em] text-on-surface-variant transition-colors duration-200 dark:text-white"
                                htmlFor="contact-subject"
                            >
                                {UI_TEXT.CONTACT.SUBJECT_LABEL}
                            </label>
                            <select
                                className={`w-full rounded-lg border-none bg-background p-4 text-base leading-6 text-on-surface transition-all focus:ring-1 focus:ring-primary dark:bg-slate-800 dark:text-white dark:focus:ring-white ${errors.subject ? "ring-1 ring-error focus:ring-error" : ""}`}
                                id="contact-subject"
                                {...register("subject")}
                            >
                                <option value="">{UI_TEXT.CONTACT.SUBJECT_OPTIONS.DEFAULT}</option>
                                <option value="access">{UI_TEXT.CONTACT.SUBJECT_OPTIONS.ACCESS}</option>
                                <option value="support">{UI_TEXT.CONTACT.SUBJECT_OPTIONS.TECH_SUPPORT}</option>
                                <option value="collection">{UI_TEXT.CONTACT.SUBJECT_OPTIONS.COLLECTION}</option>
                                <option value="other">{UI_TEXT.CONTACT.SUBJECT_OPTIONS.OTHER}</option>
                            </select>
                            {errors.subject && <p className="mt-1 text-xs text-error">{errors.subject.message}</p>}
                        </div>
                        <div className="space-y-1">
                            <label
                                className="font-mono text-xs font-medium uppercase leading-4 tracking-[0.05em] text-on-surface-variant transition-colors duration-200 dark:text-white"
                                htmlFor="contact-message"
                            >
                                {UI_TEXT.CONTACT.MESSAGE_LABEL}
                            </label>
                            <textarea
                                className={`w-full resize-none rounded-lg border-none bg-background p-4 text-base leading-6 text-on-surface transition-all focus:ring-1 focus:ring-primary dark:bg-slate-800 dark:text-white dark:focus:ring-white ${errors.message ? "ring-1 ring-error focus:ring-error" : ""}`}
                                id="contact-message"
                                placeholder={UI_TEXT.CONTACT.MESSAGE_PLACEHOLDER}
                                rows={5}
                                {...register("message")}
                            />
                            {errors.message && <p className="mt-1 text-xs text-error">{errors.message.message}</p>}
                        </div>
                        <div className="pt-2">
                            <button
                                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-12 py-4 text-xl font-semibold leading-7 text-on-primary shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all hover:bg-primary-container hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)] disabled:cursor-not-allowed disabled:opacity-70 md:w-auto"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? UI_TEXT.RECENT.TEXT_168 : UI_TEXT.CONTACT.SUBMIT_BTN}
                                {!isSubmitting && <MaterialIcon name="send" className="text-sm" />}
                            </button>
                        </div>
                    </form>
                </section>

                {/* Sidebar: Details & Map */}
                <aside className="flex h-full flex-col space-y-6 lg:col-span-5 xl:col-span-4">
                    {/* Contact Information Card */}
                    <div className="flex-grow space-y-4 rounded-xl border border-outline-variant/30 bg-surface-container-low p-6 transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900">
                        <h3 className="border-b border-outline-variant/30 pb-2 text-xl font-semibold leading-7 text-primary transition-colors duration-200 dark:border-slate-800 dark:text-white">
                            {UI_TEXT.CONTACT.INFO_HEADING}
                        </h3>
                        <ul className="space-y-4 pt-2">
                            <li className="group flex items-start gap-4">
                                <div className="rounded-full bg-surface-container-highest p-2 text-secondary transition-colors group-hover:bg-secondary-container dark:bg-slate-800 dark:text-white dark:group-hover:bg-secondary-500/20">
                                    <MaterialIcon name="location_on" />
                                </div>
                                <div>
                                    <p className="mb-1 font-mono text-xs font-medium uppercase leading-4 tracking-[0.05em] text-on-surface-variant transition-colors duration-200 dark:text-white">
                                        {UI_TEXT.CONTACT.ADDRESS_LABEL}
                                    </p>
                                    <p className="text-base font-medium leading-6 text-on-surface transition-colors duration-200 dark:text-white">
                                        {UI_TEXT.CONTACT.ADDRESS_LINE_1}
                                        <br />
                                        {UI_TEXT.CONTACT.ADDRESS_LINE_2}
                                        <br />
                                        {UI_TEXT.CONTACT.ADDRESS_LINE_3}
                                    </p>
                                </div>
                            </li>
                            <li className="group flex items-start gap-4">
                                <div className="rounded-full bg-surface-container-highest p-2 text-secondary transition-colors group-hover:bg-secondary-container dark:bg-slate-800 dark:text-white dark:group-hover:bg-secondary-500/20">
                                    <MaterialIcon name="phone" />
                                </div>
                                <div>
                                    <p className="mb-1 font-mono text-xs font-medium uppercase leading-4 tracking-[0.05em] text-on-surface-variant transition-colors duration-200 dark:text-white">
                                        {UI_TEXT.CONTACT.SUPPORT_LABEL}
                                    </p>
                                    <p className="text-base font-medium leading-6 text-on-surface transition-colors duration-200 dark:text-white">
                                        {UI_TEXT.CONTACT.PHONE}
                                    </p>
                                </div>
                            </li>
                            <li className="group flex items-start gap-4">
                                <div className="rounded-full bg-surface-container-highest p-2 text-secondary transition-colors group-hover:bg-secondary-container dark:bg-slate-800 dark:text-white dark:group-hover:bg-secondary-500/20">
                                    <MaterialIcon name="alternate_email" />
                                </div>
                                <div>
                                    <p className="mb-1 font-mono text-xs font-medium uppercase leading-4 tracking-[0.05em] text-on-surface-variant transition-colors duration-200 dark:text-white">
                                        {UI_TEXT.CONTACT.INFO_EMAIL_LABEL}
                                    </p>
                                    <p className="text-base font-medium leading-6 text-on-surface transition-colors duration-200 dark:text-white">
                                        {UI_TEXT.CONTACT.EMAIL}
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Map Component (Visual anchor) */}
                    <div className="map-container relative h-64 w-full overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-variant transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            className="h-full w-full object-cover transition-opacity dark:opacity-70"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYrrGABKWhsjlUQauZaA0B8xhhhlC-of7fsx3WYu8Qwpd6TCoS4Mp5bTfyGg96hI4woPHNS6KFIUC9Uiz7tSapcmFiuiydfU2Ytv2-L8vpshtr9sII7xxlGIQmFnsajRRfe6Om53yyXzgdKb2ofWqUIwhrmjbbrmVe8jzRo8SDX73ZkrTqLrrDF2JxINNA3qATvpnyPYE_Jq76Ywo0Wub_e8dXXti2Mp6ZEXv4AK01jU5quZmX3DS55IL9AzVxlfRBrfEIx4wMTN7L"
                            alt={UI_TEXT.CONTACT.MAP_ALT}
                        />
                        <div className="map-overlay pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/90 transition-colors duration-200 dark:to-slate-950/90" />
                        <div className="absolute bottom-4 left-4 right-4">
                            <button
                                className="flex w-full items-center justify-center gap-1 rounded-lg border border-outline-variant/30 bg-surface-container-lowest/90 px-4 py-2 text-xl font-semibold leading-7 text-primary shadow-sm backdrop-blur-sm transition-colors hover:bg-surface-container-lowest dark:border-slate-700 dark:bg-slate-800/90 dark:text-white dark:hover:bg-slate-800"
                                type="button"
                            >
                                <MaterialIcon name="directions" className="text-sm" />
                                {UI_TEXT.CONTACT.DIRECTIONS_BTN}
                            </button>
                        </div>
                    </div>
                </aside>
            </div>

            {/* FAQ Section */}
            <section className="mx-auto max-w-4xl pt-12">
                <div className="mb-6 text-center">
                    <h2 className="text-[32px] font-semibold leading-10 tracking-[-0.01em] text-primary transition-colors duration-200 dark:text-white">
                        {UI_TEXT.CONTACT.FAQ_HEADING}
                    </h2>
                    <p className="mt-2 text-base leading-6 text-on-surface-variant transition-colors duration-200 dark:text-white">
                        {UI_TEXT.CONTACT.FAQ_SUBHEADING}
                    </p>
                </div>
                <div className="space-y-2">
                    {FAQ_ITEMS.map((item) => (
                        <div
                            key={item.id}
                            className="overflow-hidden rounded-lg border border-surface-variant bg-surface-container-lowest transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900"
                        >
                            <button
                                className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-surface-container-low dark:hover:bg-slate-800/50"
                                onClick={() => toggleAccordion(item.id)}
                                type="button"
                                aria-expanded={activeAccordion === item.id}
                                aria-controls={`${item.id}-content`}
                            >
                                <span className="text-xl font-semibold leading-7 text-on-surface transition-colors duration-200 dark:text-white">
                                    {item.question}
                                </span>
                                <MaterialIcon
                                    name="expand_more"
                                    className={`text-secondary transition-transform duration-300 dark:text-white ${
                                        activeAccordion === item.id ? "rotate-180" : ""
                                    }`}
                                />
                            </button>
                            <div
                                id={`${item.id}-content`}
                                className={`overflow-hidden transition-all duration-300 ease-out ${
                                    activeAccordion === item.id ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                                }`}
                                role="region"
                                aria-labelledby={item.id}
                            >
                                <div className="border-t border-surface-variant bg-background px-6 pb-4 pt-2 text-base leading-6 text-on-surface-variant transition-colors duration-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                                    {item.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
