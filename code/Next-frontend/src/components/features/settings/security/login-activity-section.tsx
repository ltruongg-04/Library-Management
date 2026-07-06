"use client";

import { useState } from "react";
import { Laptop, Monitor, Smartphone } from "lucide-react";
import { UI_TEXT } from "@/constants/ui-text";

const securityText = UI_TEXT.SETTINGS_SECURITY.PAGE;

const initialSessions = [
    {
        id: 1,
        title: securityText.SESSIONS.MACBOOK_TITLE,
        subtitle: securityText.SESSIONS.MACBOOK_SUBTITLE,
        state: securityText.ACTIVE_NOW,
        icon: Laptop,
        active: true,
    },
    {
        id: 2,
        title: securityText.SESSIONS.IPHONE_TITLE,
        subtitle: securityText.SESSIONS.IPHONE_SUBTITLE,
        icon: Smartphone,
        active: false,
    },
    {
        id: 3,
        title: securityText.SESSIONS.WINDOWS_TITLE,
        subtitle: securityText.SESSIONS.WINDOWS_SUBTITLE,
        icon: Monitor,
        active: false,
    },
];

interface Props {
    showSuccess: (message: string) => void;
}

export function LoginActivitySection({ showSuccess }: Props) {
    const [sessions, setSessions] = useState(initialSessions);
    const hasSessions = sessions.length > 0;

    const handleLogoutAll = () => {
        if (!hasSessions) return;

        setSessions([]);
        showSuccess(securityText.SUCCESS_MESSAGES.LOGGED_OUT_ALL);
    };

    return (
        <section>
            <div className="mb-7 flex items-center justify-between gap-3">
                <div className="flex items-center gap-md">
                    <Monitor size={22} strokeWidth={2} className="text-ink-950 dark:text-white" />
                    <h2 className="font-title-md text-title-md font-semibold text-ink-950 dark:text-white">{securityText.LOGIN_ACTIVITY}</h2>
                </div>
                <button
                    type="button"
                    disabled={!hasSessions}
                    onClick={handleLogoutAll}
                    className="font-label-caps text-label-caps font-semibold uppercase text-primary transition hover:text-primary-500 disabled:cursor-not-allowed disabled:text-outline dark:text-primary-300 dark:hover:text-primary-100 dark:disabled:text-slate-500"
                >
                    {securityText.LOG_OUT_ALL_BTN}
                </button>
            </div>

            {hasSessions ? (
                <div className="grid gap-md md:grid-cols-2">
                    {sessions.map((session) => {
                        const DeviceIcon = session.icon;

                        return (
                            <div
                                key={session.id}
                                className="flex min-h-[92px] items-start gap-md rounded-xl border border-outline-variant/30 bg-surface p-md transition-colors duration-200 dark:border-slate-700 dark:bg-slate-800"
                            >
                                <DeviceIcon
                                    size={22}
                                    strokeWidth={2}
                                    className={`mt-1 shrink-0 ${session.active ? "text-primary dark:text-primary-300" : "text-outline dark:text-slate-400"}`}
                                />
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                                        <h3 className="text-body-md font-semibold text-on-surface dark:text-white">{session.title}</h3>
                                        {session.active && (
                                            <span className="font-label-caps text-label-caps font-semibold text-primary dark:text-primary-300">
                                                {session.state}
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-1 text-body-sm text-on-surface-variant dark:text-slate-300">{session.subtitle}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="rounded-xl border border-dashed border-ink-200 bg-surface p-md text-body-sm text-ink-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                    {securityText.EMPTY_SESSIONS}
                </div>
            )}
        </section>
    );
}
