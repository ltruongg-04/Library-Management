import type { Notification } from "@/types/notification";

export type NotificationSettings = {
    emailNewArrivals: boolean;
    emailDueDates: boolean;
    emailReservations: boolean;
    pushMobileAlerts: boolean;
};

export const NOTIFICATION_SETTINGS_STORAGE_KEY = "lumina_notification_settings";
export const NOTIFICATION_SETTINGS_UPDATED_EVENT = "lumina-notification-settings-updated";

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
    emailNewArrivals: true,
    emailDueDates: true,
    emailReservations: true,
    pushMobileAlerts: false,
};

export function readNotificationSettings() {
    if (typeof window === "undefined") return DEFAULT_NOTIFICATION_SETTINGS;

    const savedSettings = window.localStorage.getItem(NOTIFICATION_SETTINGS_STORAGE_KEY);
    if (!savedSettings) return DEFAULT_NOTIFICATION_SETTINGS;

    try {
        const parsed = JSON.parse(savedSettings) as Partial<NotificationSettings>;

        return {
            ...DEFAULT_NOTIFICATION_SETTINGS,
            ...parsed,
        };
    } catch {
        window.localStorage.removeItem(NOTIFICATION_SETTINGS_STORAGE_KEY);
        return DEFAULT_NOTIFICATION_SETTINGS;
    }
}

export function writeNotificationSettings(settings: NotificationSettings) {
    window.localStorage.setItem(NOTIFICATION_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    window.dispatchEvent(new Event(NOTIFICATION_SETTINGS_UPDATED_EVENT));
}

export function isNotificationEnabled(notification: Notification, settings: NotificationSettings) {
    if (notification.type === "OVERDUE" || notification.type === "RETURN") {
        return settings.emailDueDates;
    }

    if (notification.type === "BORROW") {
        return settings.emailReservations;
    }

    if (notification.type === "SYSTEM" || notification.type === "AI_INSIGHT") {
        return settings.emailNewArrivals;
    }

    return true;
}
