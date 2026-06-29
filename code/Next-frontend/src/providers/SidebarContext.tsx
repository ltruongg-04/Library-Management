"use client";

import { type ReactNode, createContext, useContext, useEffect, useState } from "react";

interface SidebarContextValue {
    collapsed: boolean;
    toggleCollapsed: () => void;
}

const SidebarContext = createContext<SidebarContextValue>({
    collapsed: false,
    toggleCollapsed: () => {},
});

export function SidebarProvider({ children }: { children: ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);

    // Persist state in localStorage
    useEffect(() => {
        const stored = localStorage.getItem("sidebar-collapsed");
        if (stored !== null) setCollapsed(stored === "true");
    }, []);

    const toggleCollapsed = () => {
        setCollapsed((prev) => {
            const next = !prev;
            localStorage.setItem("sidebar-collapsed", String(next));
            return next;
        });
    };

    return <SidebarContext.Provider value={{ collapsed, toggleCollapsed }}>{children}</SidebarContext.Provider>;
}

export function useSidebar() {
    return useContext(SidebarContext);
}
