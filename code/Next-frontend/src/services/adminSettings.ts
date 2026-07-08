import { type AdminSettingsState, DEFAULT_SETTINGS } from "@/constants/admin/settings";
import axiosInstance from "@/lib/axios";

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

function normalizeSettings(settings?: Partial<AdminSettingsState> | null): AdminSettingsState {
    return {
        borrowing: { ...DEFAULT_SETTINGS.borrowing, ...settings?.borrowing },
        features: { ...DEFAULT_SETTINGS.features, ...settings?.features },
        localization: { ...DEFAULT_SETTINGS.localization, ...settings?.localization },
        payment: { ...DEFAULT_SETTINGS.payment, ...settings?.payment },
    };
}

export const adminSettingsService = {
    async getSettings(): Promise<AdminSettingsState> {
        const response = await axiosInstance.get<ApiResponse<AdminSettingsState>>("/api/admin/settings");
        return normalizeSettings(response.data.data);
    },

    async updateSettings(payload: AdminSettingsState): Promise<AdminSettingsState> {
        const response = await axiosInstance.put<ApiResponse<AdminSettingsState>>("/api/admin/settings", payload);
        return normalizeSettings(response.data.data);
    },
};
