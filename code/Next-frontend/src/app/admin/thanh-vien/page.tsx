"use client";

import { useState } from "react";
import AdminBreadcrumb from "@/components/features/admin/AdminBreadcrumb";
import UserFilters from "@/components/features/thanh-vien/UserFilters";
import UserManagementHeader from "@/components/features/thanh-vien/UserManagementHeader";
import UserModal from "@/components/features/thanh-vien/UserModal";
import UserTable from "@/components/features/thanh-vien/UserTable";
import { UI_TEXT } from "@/constants/ui-text";
import type { User } from "@/types/user";

//import { useUser } from "@/hooks/useUsers";

export default function UserManagementPage() {
    const [open, setOpen] = useState(false);
    //const { users, loading, error } = useUser();

    const users: User[] = [
        {
            id: 1,
            name: "Eleanor Vance",
            email: "eleanor.v@lumina.edu",
            role: "admin",
            status: "active",
            lastLogin: "2 mins ago",
        },
        {
            id: 2,
            name: "Marcus Lee",
            email: "m.lee@lumina.edu",
            role: "librarian",
            status: "active",
            lastLogin: "3 hours ago",
        },
        {
            id: 3,
            name: "Sarah Jenkins",
            email: "s.jenkins@mail.com",
            role: "customer",
            status: "locked",
            lastLogin: "Oct 12, 2023",
        },
    ];

    return (
        <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-lg p-md md:p-xl">
            <AdminBreadcrumb pageName={UI_TEXT.ADMIN.SIDEBAR.NAV_MEMBERS} />
            <UserManagementHeader onCreate={() => setOpen(true)} />
            <UserFilters />
            <UserTable users={users} />
            <UserModal open={open} onClose={() => setOpen(false)} />
        </div>
    );
}
