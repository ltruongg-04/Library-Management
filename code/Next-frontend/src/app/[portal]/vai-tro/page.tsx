"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import AdminBreadcrumb from "@/components/features/admin/AdminBreadcrumb";
import CreateRoleButton from "@/components/features/roles/CreateRoleButton";
import PermissionPanel from "@/components/features/roles/PermissionPanel";
import RoleList from "@/components/features/roles/RoleList";
import SecurityPolicy from "@/components/features/roles/SecurityPolicy";
import { UI_TEXT } from "@/constants/ui-text";
import { adminRoleService } from "@/services/adminRole";
import { Role } from "@/types/role";
import { localizeRole, localizeRoles } from "@/utils/role-localization";

export default function RolesPage() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [originalRoles, setOriginalRoles] = useState<Role[]>([]);
    const [selectedRoleId, setSelectedRoleId] = useState("librarian");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const selectedRole = roles.find((role) => role.id === selectedRoleId) ?? roles[0];
    const originalSelectedRole = originalRoles.find((role) => role.id === selectedRoleId) ?? originalRoles[0];
    const hasChanges = JSON.stringify(selectedRole) !== JSON.stringify(originalSelectedRole);

    const loadRoles = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = localizeRoles(await adminRoleService.getRoles());
            setRoles(data);
            setOriginalRoles(data);
            setSelectedRoleId((current) => (data.some((role) => role.id === current) ? current : (data[0]?.id ?? current)));
        } catch (error) {
            console.error("Failed to load roles", error);
            toast.error(UI_TEXT.ROLES.LOAD_ERROR);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadRoles();
    }, [loadRoles]);

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

    const handleDiscardChanges = () => {
        loadRoles();
    };

    const handleSaveChanges = async () => {
        if (!selectedRole) return;

        setIsSaving(true);
        try {
            const permissionIds = selectedRole.modules.flatMap((module) =>
                module.permissions.filter((permission) => permission.enabled).map((permission) => `${module.id}.${permission.id}`),
            );
            const updatedRole = localizeRole(await adminRoleService.updatePermissions(selectedRole.id, permissionIds));
            setRoles((current) => current.map((role) => (role.id === updatedRole.id ? updatedRole : role)));
            setOriginalRoles((current) => current.map((role) => (role.id === updatedRole.id ? updatedRole : role)));
            toast.success(UI_TEXT.ROLES.SAVE_SUCCESS);
        } catch (error) {
            console.error("Failed to save role permissions", error);
            toast.error(UI_TEXT.ROLES.SAVE_ERROR);
        } finally {
            setIsSaving(false);
        }
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
                        {selectedRole ? (
                            <RoleList roles={roles} selectedRole={selectedRole} onSelect={(role) => setSelectedRoleId(role.id)} />
                        ) : (
                            <div className="rounded-xl border border-outline-variant/30 bg-white p-6 text-center text-on-surface-variant dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                                {UI_TEXT.ROLES.LOADING}
                            </div>
                        )}

                        <SecurityPolicy />
                    </div>

                    <div className="lg:col-span-8">
                        {isLoading ? (
                            <div className="rounded-xl border border-outline-variant/30 bg-white p-8 text-center text-on-surface-variant dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                                {UI_TEXT.ROLES.LOADING}
                            </div>
                        ) : selectedRole ? (
                            <PermissionPanel
                                role={selectedRole}
                                onTogglePermission={handleTogglePermission}
                                onDiscardChanges={handleDiscardChanges}
                                onSaveChanges={handleSaveChanges}
                                isSaving={isSaving}
                                hasChanges={hasChanges}
                            />
                        ) : null}
                    </div>
                </div>
            </main>
        </div>
    );
}
