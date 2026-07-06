"use client";

import { useEffect, useState } from "react";
import { Smartphone } from "lucide-react";
import { UI_TEXT } from "@/constants/ui-text";

const securityText = UI_TEXT.SETTINGS_SECURITY.PAGE;
const TWO_FACTOR_STORAGE_KEY = "lumina_security_two_factor_enabled";

interface Props {
    showSuccess: (message: string) => void;
}

export function TwoFactorSection({ showSuccess }: Props) {
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

    useEffect(() => {
        setTwoFactorEnabled(localStorage.getItem(TWO_FACTOR_STORAGE_KEY) === "true");
    }, []);

    const handleTwoFactorChange = () => {
        const nextValue = !twoFactorEnabled;
        setTwoFactorEnabled(nextValue);
        localStorage.setItem(TWO_FACTOR_STORAGE_KEY, String(nextValue));
        showSuccess(nextValue ? securityText.SUCCESS_MESSAGES.TWO_FACTOR_ENABLED : securityText.SUCCESS_MESSAGES.TWO_FACTOR_DISABLED);
    };

    return (
        <section className="border-b border-ink-200 pb-xl dark:border-slate-800">
            <div className="flex items-start justify-between gap-lg">
                <div className="flex max-w-[720px] gap-md">
                    <Smartphone size={22} strokeWidth={2} className="mt-1 shrink-0 text-ink-950 dark:text-white" />
                    <div>
                        <h2 className="font-title-md text-title-md font-semibold text-ink-950 dark:text-white">{securityText.TWO_FACTOR_TITLE}</h2>
                        <p className="mt-1 font-body-md text-body-md text-ink-600 dark:text-slate-400">{securityText.TWO_FACTOR_DESC}</p>
                        <div className="mt-4 inline-flex items-center gap-sm rounded-full bg-surface-variant px-3 py-1 font-label-caps text-label-caps text-on-surface-variant dark:bg-slate-800 dark:text-slate-300">
                            <span className={`h-2 w-2 rounded-full ${twoFactorEnabled ? "bg-primary dark:bg-primary-500" : "bg-outline dark:bg-slate-500"}`} />
                            {twoFactorEnabled ? securityText.TWO_FACTOR_ENABLED : securityText.TWO_FACTOR_DISABLED}
                        </div>
                    </div>
                </div>

                <label className="relative mt-2 inline-flex shrink-0 cursor-pointer items-center">
                    <input
                        type="checkbox"
                        aria-label={securityText.TWO_FACTOR_TITLE}
                        checked={twoFactorEnabled}
                        onChange={handleTwoFactorChange}
                        className="peer sr-only"
                    />
                    <span className="h-6 w-11 rounded-full bg-surface-variant transition peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-white dark:bg-slate-700 dark:peer-checked:bg-primary-500 dark:peer-focus-visible:ring-offset-slate-900" />
                    <span className="absolute left-[2px] top-[2px] h-5 w-5 rounded-full border border-outline-variant bg-white transition peer-checked:translate-x-full dark:border-slate-500" />
                </label>
            </div>
        </section>
    );
}
