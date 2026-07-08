"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AdminBreadcrumb from "@/components/features/admin/AdminBreadcrumb";
import UserFilters from "@/components/features/admin/member/UserFilters";
import UserManagementHeader from "@/components/features/admin/member/UserManagementHeader";
import UserModal from "@/components/features/admin/member/UserModal";
import UserTable from "@/components/features/admin/member/UserTable";
import { UI_TEXT } from "@/constants/ui-text";
import { API_ERRORS } from "@/constants/ui-text/shared/api";
import { createAdminUser, getAdminUsers, updateAdminUser, updateAdminUserStatus } from "@/services/adminUser";
import type { User } from "@/types/user";

export default function UserManagementPage() {
    const [open, setOpen] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editUser, setEditUser] = useState<User | null>(null);

    // Filter states
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const response = await getAdminUsers();
            if (response.success && response.data) {
                setUsers(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleToggleStatus = async (id: number, isActive: boolean) => {
        try {
            await updateAdminUserStatus(id, isActive);
            // Refresh data
            fetchUsers();
        } catch (error) {
            console.error("Failed to update status:", error);
            toast.error(API_ERRORS.UPDATE_STATUS_FAILED);
        }
    };

    const handleEditUser = (user: User) => {
        setEditUser(user);
        setOpen(true);
    };

    const handleSaveUser = async (data: { name: string; email: string; role: string; password?: string }) => {
        if (editUser) {
            // Edit
            await updateAdminUser(editUser.id, { fullName: data.name, role: data.role });
        } else {
            // Create
            if (!data.password) throw new Error("Mật khẩu không được để trống");
            await createAdminUser({
                fullName: data.name,
                email: data.email,
                role: data.role,
                password: data.password,
            });
        }
        fetchUsers();
    };

    const handleCloseModal = () => {
        setOpen(false);
        setEditUser(null);
    };

    const handleClearFilters = () => {
        setSearchQuery("");
        setRoleFilter("");
        setStatusFilter("");
    };

    // Filter logic
    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.id.toString().includes(searchQuery);

        const matchesRole = roleFilter === "" || user.role === roleFilter;
        const matchesStatus = statusFilter === "" || user.status === statusFilter;

        return matchesSearch && matchesRole && matchesStatus;
    });

    return (
        <div className="flex min-h-screen w-full flex-col bg-surface">
            <div className="px-8 pb-2 pt-8">
                <AdminBreadcrumb pageName={UI_TEXT.ADMIN.SIDEBAR.NAV_MEMBERS} />
            </div>

            <UserManagementHeader
                onCreate={() => {
                    setEditUser(null);
                    setOpen(true);
                }}
            />

            <main className="flex flex-1 flex-col gap-lg overflow-auto p-8">
                <UserFilters
                    search={searchQuery}
                    onSearchChange={setSearchQuery}
                    role={roleFilter}
                    onRoleChange={setRoleFilter}
                    status={statusFilter}
                    onStatusChange={setStatusFilter}
                    onClearFilters={handleClearFilters}
                />
                {isLoading ? (
                    <div className="flex h-64 items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    </div>
                ) : (
                    <UserTable users={filteredUsers} onEditUser={handleEditUser} onToggleStatus={handleToggleStatus} />
                )}
                <UserModal open={open} onClose={handleCloseModal} initialData={editUser} onSave={handleSaveUser} />
            </main>
        </div>
    );
}
