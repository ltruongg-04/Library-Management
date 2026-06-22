'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Smartphone, CheckCircle } from 'lucide-react';
import { Toggle } from '@/components/base/Toggle';

export default function NotificationSettingsPage() {
    const [emailNewArrivals, setEmailNewArrivals] = useState(true);
    const [emailDueDates, setEmailDueDates] = useState(true);
    const [emailReservations, setEmailReservations] = useState(true);
    const [pushMobileAlerts, setPushMobileAlerts] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    
    // Load from local storage on mount
    useEffect(() => {
        const savedSettings = localStorage.getItem('lumina_notification_settings');
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings);
                if (typeof parsed.emailNewArrivals === 'boolean') setEmailNewArrivals(parsed.emailNewArrivals);
                if (typeof parsed.emailDueDates === 'boolean') setEmailDueDates(parsed.emailDueDates);
                if (typeof parsed.emailReservations === 'boolean') setEmailReservations(parsed.emailReservations);
                if (typeof parsed.pushMobileAlerts === 'boolean') setPushMobileAlerts(parsed.pushMobileAlerts);
            } catch (e) {
                console.error("Failed to parse notification settings", e);
            }
        }
    }, []);

    const handleSave = () => {
        const settings = {
            emailNewArrivals,
            emailDueDates,
            emailReservations,
            pushMobileAlerts,
        };
        localStorage.setItem('lumina_notification_settings', JSON.stringify(settings));
        setShowSuccessModal(true);
        // Optional: Tự động đóng sau 3 giây
        setTimeout(() => {
            setShowSuccessModal(false);
        }, 3000);
    };

    const handleDiscard = () => {
        // Reset from local storage
        const savedSettings = localStorage.getItem('lumina_notification_settings');
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings);
                if (typeof parsed.emailNewArrivals === 'boolean') setEmailNewArrivals(parsed.emailNewArrivals);
                if (typeof parsed.emailDueDates === 'boolean') setEmailDueDates(parsed.emailDueDates);
                if (typeof parsed.emailReservations === 'boolean') setEmailReservations(parsed.emailReservations);
                if (typeof parsed.pushMobileAlerts === 'boolean') setPushMobileAlerts(parsed.pushMobileAlerts);
            } catch (e) {
                console.error("Failed to parse notification settings", e);
            }
        } else {
            // Default
            setEmailNewArrivals(true);
            setEmailDueDates(true);
            setEmailReservations(true);
            setPushMobileAlerts(false);
        }
    };

    return (
        <div className="w-full max-w-4xl bg-surface-container-lowest rounded-2xl p-xl shadow-sm border border-surface-variant">
            <div className="mb-xl">
                <h1 className="font-display-lg text-display-lg text-on-surface mb-sm">Notification Settings</h1>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                    Control how Lumina Library communicates with you. Tailor your alerts to stay informed without feeling overwhelmed.
                </p>
            </div>

            <div className="space-y-xl">
                <section className="border-b border-surface-variant pb-xl">
                    <div className="flex items-center gap-sm mb-lg">
                        <Mail className="text-on-surface" size={24} />
                        <h2 className="font-title-md text-title-md text-on-surface">Email Notifications</h2>
                    </div>

                    <div className="space-y-md">
                        <div className="flex items-center justify-between py-sm">
                            <div>
                                <h3 className="font-body-md text-body-md font-semibold text-on-surface">New Arrivals</h3>
                                <p className="font-body-sm text-body-sm text-on-surface-variant">Get notified when books from your favorite authors arrive.</p>
                            </div>
                            <Toggle checked={emailNewArrivals} onChange={setEmailNewArrivals} />
                        </div>

                        <div className="flex items-center justify-between py-sm border-t border-surface-variant">
                            <div>
                                <h3 className="font-body-md text-body-md font-semibold text-on-surface">Due Date Reminders</h3>
                                <p className="font-body-sm text-body-sm text-on-surface-variant">Receive alerts 3 days before your items are due.</p>
                            </div>
                            <Toggle checked={emailDueDates} onChange={setEmailDueDates} />
                        </div>

                        <div className="flex items-center justify-between py-sm border-t border-surface-variant">
                            <div>
                                <h3 className="font-body-md text-body-md font-semibold text-on-surface">Reservation Alerts</h3>
                                <p className="font-body-sm text-body-sm text-on-surface-variant">We&apos;ll let you know the moment a reserved book is ready.</p>
                            </div>
                            <Toggle checked={emailReservations} onChange={setEmailReservations} />
                        </div>
                    </div>
                </section>

                <section className="border-b border-surface-variant pb-xl">
                    <div className="flex items-center gap-sm mb-lg">
                        <Smartphone className="text-on-surface" size={24} />
                        <h2 className="font-title-md text-title-md text-on-surface">Push Notifications</h2>
                    </div>

                    <div className="space-y-md">
                        <div className="flex items-center justify-between py-sm">
                            <div>
                                <h3 className="font-body-md text-body-md font-semibold text-on-surface">Mobile Alerts</h3>
                                <p className="font-body-sm text-body-sm text-on-surface-variant">Instant notifications sent to your registered devices.</p>
                            </div>
                            <Toggle checked={pushMobileAlerts} onChange={setPushMobileAlerts} />
                        </div>
                    </div>
                </section>

                <div className="pt-xl flex justify-end gap-md border-t border-surface-variant mt-xl">
                    <button 
                        onClick={handleDiscard}
                        className="px-lg py-sm rounded border border-outline text-on-surface font-label-caps text-label-caps hover:bg-surface-variant/50 transition-colors"
                    >
                        Discard Changes
                    </button>
                    <button 
                        onClick={handleSave}
                        className="px-lg py-sm rounded bg-primary text-on-primary font-label-caps text-label-caps hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm"
                    >
                        Save Preferences
                    </button>
                </div>
            </div>

            {/* Custom Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300">
                    <div className="bg-surface-container-lowest rounded-2xl shadow-2xl max-w-sm w-full mx-4 animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-6 flex flex-col items-center text-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-success-50 flex items-center justify-center text-success-500">
                                <CheckCircle size={28} />
                            </div>
                            <div>
                                <h3 className="font-title-md text-title-md font-semibold text-on-surface mb-2">Thành công!</h3>
                                <p className="font-body-sm text-body-sm text-on-surface-variant">Cài đặt thông báo đã được lưu thành công.</p>
                            </div>
                            <button 
                                onClick={() => setShowSuccessModal(false)}
                                className="w-full mt-4 py-3 rounded bg-primary text-on-primary font-label-caps text-label-caps hover:bg-primary-700 transition-colors"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
