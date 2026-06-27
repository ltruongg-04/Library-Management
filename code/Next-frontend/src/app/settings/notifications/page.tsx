"use client";

import React, { useEffect, useState } from "react";
import { Mail, Smartphone } from "lucide-react";
import { Toggle } from "@/components/base/Toggle";
import { SuccessModal } from "@/components/base/success-modal";
import { UI_TEXT } from "@/constants/ui-text";

export default function NotificationSettingsPage() {
    const [emailNewArrivals, setEmailNewArrivals] = useState(true);
    const [emailDueDates, setEmailDueDates] = useState(true);
    const [emailReservations, setEmailReservations] = useState(true);
    const [pushMobileAlerts, setPushMobileAlerts] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Load from local storage on mount
    useEffect(() => {
        const savedSettings = localStorage.getItem("lumina_notification_settings");
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings);
                if (typeof parsed.emailNewArrivals === "boolean") setEmailNewArrivals(parsed.emailNewArrivals);
                if (typeof parsed.emailDueDates === "boolean") setEmailDueDates(parsed.emailDueDates);
                if (typeof parsed.emailReservations === "boolean") setEmailReservations(parsed.emailReservations);
                if (typeof parsed.pushMobileAlerts === "boolean") setPushMobileAlerts(parsed.pushMobileAlerts);
            } catch (e) {
                console.error("Failed to parse notification settings", e);
            }
        }
    }, []);

    const updateSetting = (key: "emailNewArrivals" | "emailDueDates" | "emailReservations" | "pushMobileAlerts", value: boolean) => {
        let newSettings = { emailNewArrivals, emailDueDates, emailReservations, pushMobileAlerts };
        if (key === "emailNewArrivals") {
            setEmailNewArrivals(value);
            newSettings.emailNewArrivals = value;
        }
        if (key === "emailDueDates") {
            setEmailDueDates(value);
            newSettings.emailDueDates = value;
        }
        if (key === "emailReservations") {
            setEmailReservations(value);
            newSettings.emailReservations = value;
        }
        if (key === "pushMobileAlerts") {
            setPushMobileAlerts(value);
            newSettings.pushMobileAlerts = value;
        }
        localStorage.setItem("lumina_notification_settings", JSON.stringify(newSettings));
        setShowSuccessModal(true);
        setTimeout(() => {
            setShowSuccessModal(false);
        }, 3000);
    };

    return (
        <div className="w-full max-w-4xl rounded-2xl border border-ink-200 bg-white p-xl shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-xl">
                <h1 className="mb-sm font-display-lg text-display-lg text-ink-950 dark:text-white">{UI_TEXT.SETTINGS_NOTIFICATIONS.PAGE.HEADING}</h1>
                <p className="max-w-2xl font-body-md text-body-md text-ink-600 dark:text-slate-400">{UI_TEXT.SETTINGS_NOTIFICATIONS.PAGE.SUBHEADING}</p>
            </div>

            <div className="space-y-xl">
                <section className="border-b border-ink-200 pb-xl dark:border-slate-800">
                    <div className="mb-lg flex items-center gap-sm">
                        <Mail className="text-ink-950 dark:text-white" size={24} />
                        <h2 className="font-title-md text-title-md text-ink-950 dark:text-white">{UI_TEXT.SETTINGS_NOTIFICATIONS.PAGE.EMAIL_NOTIFICATIONS}</h2>
                    </div>

                    <div className="space-y-md">
                        <div className="flex items-center justify-between py-sm">
                            <div>
                                <h3 className="font-body-md text-body-md font-semibold text-ink-950 dark:text-white">
                                    {UI_TEXT.SETTINGS_NOTIFICATIONS.PAGE.NEW_ARRIVALS_TITLE}
                                </h3>
                                <p className="font-body-sm text-body-sm text-ink-600 dark:text-slate-400">
                                    {UI_TEXT.SETTINGS_NOTIFICATIONS.PAGE.NEW_ARRIVALS_DESC}
                                </p>
                            </div>
                            <Toggle checked={emailNewArrivals} onChange={(val) => updateSetting("emailNewArrivals", val)} />
                        </div>

                        <div className="flex items-center justify-between border-t border-ink-200 py-sm dark:border-slate-800">
                            <div>
                                <h3 className="font-body-md text-body-md font-semibold text-ink-950 dark:text-white">
                                    {UI_TEXT.SETTINGS_NOTIFICATIONS.PAGE.DUE_DATE_TITLE}
                                </h3>
                                <p className="font-body-sm text-body-sm text-ink-600 dark:text-slate-400">
                                    {UI_TEXT.SETTINGS_NOTIFICATIONS.PAGE.DUE_DATE_DESC}
                                </p>
                            </div>
                            <Toggle checked={emailDueDates} onChange={(val) => updateSetting("emailDueDates", val)} />
                        </div>

                        <div className="flex items-center justify-between border-t border-ink-200 py-sm dark:border-slate-800">
                            <div>
                                <h3 className="font-body-md text-body-md font-semibold text-ink-950 dark:text-white">
                                    {UI_TEXT.SETTINGS_NOTIFICATIONS.PAGE.RESERVATION_TITLE}
                                </h3>
                                <p className="font-body-sm text-body-sm text-ink-600 dark:text-slate-400">
                                    {UI_TEXT.SETTINGS_NOTIFICATIONS.PAGE.RESERVATION_DESC}
                                </p>
                            </div>
                            <Toggle checked={emailReservations} onChange={(val) => updateSetting("emailReservations", val)} />
                        </div>
                    </div>
                </section>

                <section className="border-b border-ink-200 pb-xl dark:border-slate-800">
                    <div className="mb-lg flex items-center gap-sm">
                        <Smartphone className="text-ink-950 dark:text-white" size={24} />
                        <h2 className="font-title-md text-title-md text-ink-950 dark:text-white">{UI_TEXT.SETTINGS_NOTIFICATIONS.PAGE.PUSH_NOTIFICATIONS}</h2>
                    </div>

                    <div className="space-y-md">
                        <div className="flex items-center justify-between py-sm">
                            <div>
                                <h3 className="font-body-md text-body-md font-semibold text-ink-950 dark:text-white">
                                    {UI_TEXT.SETTINGS_NOTIFICATIONS.PAGE.MOBILE_ALERTS_TITLE}
                                </h3>
                                <p className="font-body-sm text-body-sm text-ink-600 dark:text-slate-400">
                                    {UI_TEXT.SETTINGS_NOTIFICATIONS.PAGE.MOBILE_ALERTS_DESC}
                                </p>
                            </div>
                            <Toggle checked={pushMobileAlerts} onChange={(val) => updateSetting("pushMobileAlerts", val)} />
                        </div>
                    </div>
                </section>
            </div>

            {/* Custom Success Modal */}
            <SuccessModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} message={UI_TEXT.SETTINGS_NOTIFICATIONS.PAGE.SUCCESS_MSG} />
        </div>
    );
}
