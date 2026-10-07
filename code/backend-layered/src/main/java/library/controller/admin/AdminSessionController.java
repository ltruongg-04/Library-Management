package library.controller.admin;

import library.common.base.ApiResponse;
import library.dto.admin.AdminSessionDto;
import library.service.AdminSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/sessions")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminSessionController {

    private final AdminSessionService adminSessionService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminSessionDto>>> getAllSessions() {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách phiên đăng nhập", adminSessionService.getAllSessions()));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<AdminSessionDto>>> getUserSessions(@PathVariable Integer userId) {
        return ResponseEntity.ok(ApiResponse.success("Lấy phiên đăng nhập của người dùng", adminSessionService.getUserSessions(userId)));
    }

    @DeleteMapping("/{sessionId}")
    public ResponseEntity<ApiResponse<Void>> terminateSession(@PathVariable String sessionId) {
        adminSessionService.terminateSession(sessionId);
        return ResponseEntity.ok(ApiResponse.success("Đã đăng xuất thiết bị", null));
    }

    @DeleteMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<Void>> terminateAllUserSessions(@PathVariable Integer userId) {
        adminSessionService.terminateAllUserSessions(userId);
        return ResponseEntity.ok(ApiResponse.success("Đã đăng xuất tất cả thiết bị của người dùng", null));
    }
}
