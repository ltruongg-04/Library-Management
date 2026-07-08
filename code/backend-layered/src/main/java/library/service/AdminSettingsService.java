package library.service;

import library.dto.admin.AdminSettingsResponse;

public interface AdminSettingsService {
    AdminSettingsResponse getSettings();

    AdminSettingsResponse updateSettings(AdminSettingsResponse request);
}
