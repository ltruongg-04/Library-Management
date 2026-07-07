"use client";

import { useEffect, useState } from "react";
import { notifications as initialNotifications } from "@/mocks/notifications";
import { Notification } from "@/types/notification";
import {
    NOTIFICATION_SETTINGS_STORAGE_KEY,
    NOTIFICATION_SETTINGS_UPDATED_EVENT,
    type NotificationSettings,
    isNotificationEnabled,
    readNotificationSettings,
} from "@/utils/notification-settings";

export function useNotifications() {
    const [allItems, setAllItems] = useState<Notification[]>([]);
    const [settings, setSettings] = useState<NotificationSettings>(() => readNotificationSettings());

    useEffect(() => {
        const saved = localStorage.getItem("notifications");

        if (saved) {
            setAllItems(JSON.parse(saved));
        } else {
            setAllItems(initialNotifications);
            localStorage.setItem("notifications", JSON.stringify(initialNotifications));
        }
    }, []);

    useEffect(() => {
        const syncSettings = () => {
            setSettings(readNotificationSettings());
        };

        const handleStorage = (event: StorageEvent) => {
            if (event.key === NOTIFICATION_SETTINGS_STORAGE_KEY) {
                syncSettings();
            }
        };

        window.addEventListener(NOTIFICATION_SETTINGS_UPDATED_EVENT, syncSettings);
        window.addEventListener("storage", handleStorage);

        return () => {
            window.removeEventListener(NOTIFICATION_SETTINGS_UPDATED_EVENT, syncSettings);
            window.removeEventListener("storage", handleStorage);
        };
    }, []);

    const saveNotifications = (updatedItems: Notification[]) => {
        setAllItems(updatedItems);

        localStorage.setItem("notifications", JSON.stringify(updatedItems));
    };

    const markAsRead = (id: number) => {
        const updatedItems = allItems.map((item) =>
            item.id === id
                ? {
                      ...item,
                      isRead: true,
                  }
                : item,
        );

        saveNotifications(updatedItems);
    };

    const markAllAsRead = () => {
        const updatedItems = allItems.map((item) =>
            isNotificationEnabled(item, settings)
                ? {
                      ...item,
                      isRead: true,
                  }
                : item,
        );

        saveNotifications(updatedItems);
    };

    const items = allItems.filter((item) => isNotificationEnabled(item, settings));
    const unreadCount = items.filter((item) => !item.isRead).length;

    return {
        items,
        unreadCount,
        markAsRead,
        markAllAsRead,
    };
}
