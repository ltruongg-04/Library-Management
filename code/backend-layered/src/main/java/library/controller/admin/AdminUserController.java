package library.controller.admin;

import library.common.base.ApiResponse;
import library.dto.admin.AdminUserResponseDto;
import library.service.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminUserResponseDto>>> getAllUsers() {
        List<AdminUserResponseDto> users = adminUserService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách người dùng thành công", users));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Void>> updateUserStatus(
            @org.springframework.web.bind.annotation.PathVariable Integer id,
            @org.springframework.web.bind.annotation.RequestParam boolean active) {
        adminUserService.updateUserStatus(id, active);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật trạng thái thành công", null));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> updateUser(
            @org.springframework.web.bind.annotation.PathVariable Integer id,
            @jakarta.validation.Valid @org.springframework.web.bind.annotation.RequestBody library.dto.admin.AdminUpdateUserDto request) {
        adminUserService.updateUser(id, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật thông tin thành công", null));
    }

    @org.springframework.web.bind.annotation.PostMapping
    public ResponseEntity<ApiResponse<Void>> createUser(
            @jakarta.validation.Valid @org.springframework.web.bind.annotation.RequestBody library.dto.admin.AdminCreateUserDto request) {
        adminUserService.createUser(request);
        return ResponseEntity.ok(ApiResponse.success("Thêm mới thành viên thành công", null));
    }
}
