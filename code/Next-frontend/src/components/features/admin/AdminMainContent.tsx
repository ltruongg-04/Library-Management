"use client";

import type { ReactNode } from "react";
import { useSidebar } from "@/providers/SidebarContext";

export default function AdminMainContent({ children }: { children: ReactNode }) {
    const { collapsed } = useSidebar();

    return <main className={`min-h-screen overflow-y-auto transition-all duration-300 ${collapsed ? "ml-[68px]" : "ml-sidebar-width"}`}>{children}</main>;
}
