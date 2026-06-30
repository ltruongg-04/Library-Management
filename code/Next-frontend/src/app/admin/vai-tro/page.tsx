"use client";

import { useState } from "react";
import AdminBreadcrumb from "@/components/features/admin/AdminBreadcrumb";
import CreateRoleButton from "@/components/features/roles/CreateRoleButton";
import PermissionPanel from "@/components/features/roles/PermissionPanel";
import RoleList from "@/components/features/roles/RoleList";
import SecurityPolicy from "@/components/features/roles/SecurityPolicy";
import { UI_TEXT } from "@/constants/ui-text";
import { Role } from "@/types/role";

export default function RolesPage() {
    const [roles, setRoles] = useState<Role[]>([
        {
            id: "administrator",
            name: "Administrator",
            description: "Full system access & configuration.",
            modules: [
                {
                    id: "books",
                    name: "Books & Catalog",
                    icon: "library_books",
                    permissions: [
                        {
                            id: "add-book",
                            name: "Add New Books",
                            description: "Allow user to input new entries into the main catalog.",
                            enabled: true,
                        },
                        {
                            id: "edit-book",
                            name: "Edit Book Metadata",
                            description: "Allow user to modify titles, authors and classification data.",
                            enabled: true,
                        },
                        {
                            id: "delete-book",
                            name: "Delete Books",
                            description: "Allow user to permanently remove items from the catalog.",
                            enabled: true,
                        },
                    ],
                },
                {
                    id: "borrow",
                    name: "Borrowing & Circulation",
                    icon: "sync_alt",
                    permissions: [
                        {
                            id: "approve",
                            name: "Approve Borrows",
                            description: "Manually override or approve restricted borrowing requests.",
                            enabled: true,
                        },
                        {
                            id: "fine",
                            name: "Waive Fines",
                            description: "Authorize the removal of late fees from customer accounts.",
                            enabled: true,
                        },
                    ],
                },
            ],
        },

        {
            id: "librarian",
            name: "Librarian",
            description: "Catalog management & user support.",
            modules: [
                {
                    id: "books",
                    name: "Books & Catalog",
                    icon: "library_books",
                    permissions: [
                        {
                            id: "add-book",
                            name: "Add New Books",
                            description: "Allow user to input new entries into the main catalog.",
                            enabled: true,
                        },
                        {
                            id: "edit-book",
                            name: "Edit Book Metadata",
                            description: "Allow user to modify titles, authors and classification data.",
                            enabled: true,
                        },
                        {
                            id: "delete-book",
                            name: "Delete Books",
                            description: "Allow user to permanently remove items from the catalog.",
                            enabled: false,
                        },
                    ],
                },
                {
                    id: "borrow",
                    name: "Borrowing & Circulation",
                    icon: "sync_alt",
                    permissions: [
                        {
                            id: "approve",
                            name: "Approve Borrows",
                            description: "Manually override or approve restricted borrowing requests.",
                            enabled: true,
                        },
                        {
                            id: "fine",
                            name: "Waive Fines",
                            description: "Authorize the removal of late fees from customer accounts.",
                            enabled: false,
                        },
                    ],
                },
            ],
        },

        {
            id: "customer",
            name: "Customer",
            description: "Standard borrowing & browsing access.",
            modules: [],
        },

        {
            id: "guest",
            name: "Guest",
            description: "Read-only catalog access.",
            modules: [],
        },
    ]);

    const [selectedRoleId, setSelectedRoleId] = useState("librarian");

    const selectedRole = roles.find((role) => role.id === selectedRoleId) ?? roles[0];

    const handleTogglePermission = (moduleId: string, permissionId: string) => {
        setRoles((prev) =>
            prev.map((role) => {
                if (role.id !== selectedRoleId) {
                    return role;
                }

                return {
                    ...role,
                    modules: role.modules.map((module) => {
                        if (module.id !== moduleId) {
                            return module;
                        }

                        return {
                            ...module,
                            permissions: module.permissions.map((permission) => {
                                if (permission.id !== permissionId) {
                                    return permission;
                                }

                                return {
                                    ...permission,
                                    enabled: !permission.enabled,
                                };
                            }),
                        };
                    }),
                };
            }),
        );
    };

    return (
        <div className="flex min-h-screen w-full flex-col bg-surface">
            <div className="px-8 pb-2 pt-8">
                <AdminBreadcrumb pageName={UI_TEXT.ADMIN.SIDEBAR.NAV_ROLES} />
            </div>

            {/* Header */}

            <div className="flex items-center justify-between border-y border-surface-container-high bg-white px-8 py-6">
                <div>
                    <h1 className="flex items-center gap-2 text-[28px] font-semibold leading-tight text-ink-950">{UI_TEXT.ROLES.PAGE_TITLE}</h1>

                    <p className="mt-1 text-[14px] text-on-surface-variant">{UI_TEXT.ROLES.PAGE_DESCRIPTION}</p>
                </div>

                <CreateRoleButton />
            </div>

            <main className="flex flex-1 flex-col gap-6 overflow-auto p-8">
                <div className="grid gap-6 lg:grid-cols-12">
                    <div className="space-y-6 lg:col-span-4">
                        <RoleList roles={roles} selectedRole={selectedRole} onSelect={(role) => setSelectedRoleId(role.id)} />

                        <SecurityPolicy />
                    </div>

                    <div className="lg:col-span-8">
                        <PermissionPanel role={selectedRole} onTogglePermission={handleTogglePermission} />
                    </div>
                </div>
            </main>
        </div>
    );
}
