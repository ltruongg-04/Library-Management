import axiosInstance from "@/lib/axios";
import type { Role } from "@/types/role";

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export const adminRoleService = {
    async getRoles(): Promise<Role[]> {
        const response = await axiosInstance.get<ApiResponse<Role[]>>("/api/admin/roles");
        return response.data.data;
    },

    async getMyPermissions(): Promise<string[]> {
        const response = await axiosInstance.get<ApiResponse<string[]>>("/api/admin/roles/me/permissions");
        return response.data.data;
    },

    async updatePermissions(role: string, permissionIds: string[]): Promise<Role> {
        const response = await axiosInstance.put<ApiResponse<Role>>(`/api/admin/roles/${role.toUpperCase()}/permissions`, { permissionIds });
        return response.data.data;
    },
};
