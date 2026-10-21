"use client";

import { CheckCircle2, Clock, Library } from "lucide-react";
import { UI_TEXT } from "@/constants/ui-text";

export default function HowItWorks() {
    const steps = [
        {
            number: "01",
            title: UI_TEXT.HOME.HOW_IT_WORKS.STEP_1_TITLE,
            desc: UI_TEXT.HOME.HOW_IT_WORKS.STEP_1_DESC,
            icon: <Library className="text-primary" size={28} />,
        },
        {
            number: "02",
            title: UI_TEXT.HOME.HOW_IT_WORKS.STEP_2_TITLE,
            desc: UI_TEXT.HOME.HOW_IT_WORKS.STEP_2_DESC,
            icon: <CheckCircle2 className="text-secondary-500" size={28} />,
        },
        {
            number: "03",
            title: UI_TEXT.HOME.HOW_IT_WORKS.STEP_3_TITLE,
            desc: UI_TEXT.HOME.HOW_IT_WORKS.STEP_3_DESC,
            icon: <Clock className="text-amber-500" size={28} />,
        },
    ];

    return (
        <section className="mx-auto my-14 max-w-[1440px] px-4 lg:px-8">
            <div className="rounded-3xl border border-outline-variant/30 bg-gradient-to-br from-surface-container-low via-surface to-surface-container-low p-8 shadow-sm dark:border-slate-800 dark:from-slate-900/60 dark:via-slate-900 dark:to-slate-900/60 md:p-12">
                {/* Header */}
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="font-sans text-2xl font-bold tracking-tight text-on-surface dark:text-white md:text-3xl">
                        {UI_TEXT.HOME.HOW_IT_WORKS.TITLE}
                    </h2>
                    <p className="mt-2 text-sm text-on-surface-variant dark:text-slate-400">{UI_TEXT.HOME.HOW_IT_WORKS.SUBTITLE}</p>
                </div>

                {/* 3 Steps */}
                <div className="mt-10 grid gap-6 md:grid-cols-3">
                    {steps.map((step) => (
                        <div
                            key={step.number}
                            className="relative flex flex-col rounded-2xl border border-outline-variant/20 bg-surface p-6 shadow-sm transition-all hover:border-primary/40 dark:border-slate-800 dark:bg-slate-900/80"
                        >
                            <span className="font-mono text-3xl font-extrabold text-outline-variant/40 dark:text-slate-700">{step.number}</span>
                            <div className="my-3 flex h-12 w-12 items-center justify-center rounded-xl bg-surface-variant/60 dark:bg-slate-800">
                                {step.icon}
                            </div>
                            <h3 className="text-base font-bold text-on-surface dark:text-white">{step.title}</h3>
                            <p className="mt-1.5 text-xs leading-relaxed text-on-surface-variant dark:text-slate-400">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
