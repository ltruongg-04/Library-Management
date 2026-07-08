package library.controller.admin;

import library.common.base.ApiResponse;
import library.dto.admin.AdminSettingsResponse;
import library.service.AdminSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/settings")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminSettingsController {

    private final AdminSettingsService adminSettingsService;

    @GetMapping
    public ResponseEntity<ApiResponse<AdminSettingsResponse>> getSettings() {
        return ResponseEntity.ok(ApiResponse.success("Lấy cấu hình hệ thống thành công", adminSettingsService.getSettings()));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<AdminSettingsResponse>> updateSettings(@RequestBody AdminSettingsResponse request) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật cấu hình hệ thống thành công", adminSettingsService.updateSettings(request)));
    }
}
