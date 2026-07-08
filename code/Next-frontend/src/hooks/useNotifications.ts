"use client";

import { useEffect, useState } from "react";
import { notificationService } from "@/services/notification";
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
    const [serverUnreadCount, setServerUnreadCount] = useState(0);
    const [settings, setSettings] = useState<NotificationSettings>(() => readNotificationSettings());

    useEffect(() => {
        let mounted = true;

        const loadNotifications = async () => {
            try {
                const [items, unreadCount] = await Promise.all([notificationService.list(), notificationService.unreadCount()]);

                if (mounted) {
                    setAllItems(items);
                    setServerUnreadCount(unreadCount);
                }
            } catch {
                if (mounted) {
                    setAllItems([]);
                    setServerUnreadCount(0);
                }
            }
        };

        loadNotifications();

        return () => {
            mounted = false;
        };
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
    };

    const markAsRead = (id: number) => {
        const shouldMark = allItems.some((item) => item.id === id && !item.isRead);
        const updatedItems = allItems.map((item) =>
            item.id === id
                ? {
                      ...item,
                      isRead: true,
                  }
                : item,
        );

        saveNotifications(updatedItems);
        if (shouldMark) {
            setServerUnreadCount((count) => Math.max(count - 1, 0));
        }
        notificationService.markAsRead(id).catch(() => {
            setAllItems(allItems);
            setServerUnreadCount(allItems.filter((item) => !item.isRead).length);
        });
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
        setServerUnreadCount(0);
        notificationService.markAllAsRead().catch(() => {
            setAllItems(allItems);
            setServerUnreadCount(allItems.filter((item) => !item.isRead).length);
        });
    };

    const items = allItems.filter((item) => isNotificationEnabled(item, settings));
    const unreadCount = items.length === allItems.length ? serverUnreadCount : items.filter((item) => !item.isRead).length;

    return {
        items,
        unreadCount,
        markAsRead,
        markAllAsRead,
    };
}
