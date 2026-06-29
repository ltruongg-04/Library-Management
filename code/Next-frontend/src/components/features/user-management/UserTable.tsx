"use client";

import { ADMIN_USER_MANAGEMENT } from "@/constants/ui-text/admin";

export type User = {
    id: number;
    name: string;
    email: string;
    role: "admin" | "librarian" | "customer";
    status: "active" | "locked" | "inactive";
    lastLogin: string;
};

export default function UserTable({ users }: { users: User[] }) {
    const statusStyle = {
        active: "text-green-600",
        locked: "text-red-600",
        inactive: "text-gray-500",
    };

    return (
        <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
                <thead className="bg-gray-100 text-left">
                    <tr>
                        <th className="p-3">{ADMIN_USER_MANAGEMENT.TABLE.COL_USER}</th>
                        <th>{ADMIN_USER_MANAGEMENT.TABLE.COL_EMAIL}</th>
                        <th>{ADMIN_USER_MANAGEMENT.TABLE.COL_ROLE}</th>
                        <th>{ADMIN_USER_MANAGEMENT.TABLE.COL_STATUS}</th>
                        <th>{ADMIN_USER_MANAGEMENT.TABLE.COL_LAST_LOGIN}</th>
                        <th className="p-3 text-right">{ADMIN_USER_MANAGEMENT.TABLE.COL_ACTIONS}</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map((u) => (
                        <tr key={u.id} className="border-t transition hover:bg-gray-50">
                            <td className="p-3 font-medium">{u.name}</td>
                            <td>{u.email}</td>
                            <td className="capitalize">{u.role}</td>

                            <td className={statusStyle[u.status]}>{u.status}</td>
                            <td>{u.lastLogin}</td>

                            <td className="space-x-2 p-3 text-right">
                                <button className="text-blue-600 hover:underline">{ADMIN_USER_MANAGEMENT.TABLE.BTN_EDIT}</button>

                                <button className="text-red-600 hover:underline">
                                    {u.status === "locked" ? ADMIN_USER_MANAGEMENT.TABLE.BTN_UNLOCK : ADMIN_USER_MANAGEMENT.TABLE.BTN_LOCK}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
