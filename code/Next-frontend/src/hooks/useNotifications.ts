"use client";

import { useEffect, useState } from "react";
import { notifications as initialNotifications } from "@/mocks/notifications";
import { Notification } from "@/types/notification";

export function useNotifications() {
    const [items, setItems] = useState<Notification[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem("notifications");

        if (saved) {
            setItems(JSON.parse(saved));
        } else {
            setItems(initialNotifications);
            localStorage.setItem("notifications", JSON.stringify(initialNotifications));
        }
    }, []);

    const saveNotifications = (updatedItems: Notification[]) => {
        setItems(updatedItems);

        localStorage.setItem("notifications", JSON.stringify(updatedItems));
    };

    const markAsRead = (id: number) => {
        const updatedItems = items.map((item) =>
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
        const updatedItems = items.map((item) => ({
            ...item,
            isRead: true,
        }));

        saveNotifications(updatedItems);
    };

    const unreadCount = items.filter((item) => !item.isRead).length;

    return {
        items,
        unreadCount,
        markAsRead,
        markAllAsRead,
    };
}
