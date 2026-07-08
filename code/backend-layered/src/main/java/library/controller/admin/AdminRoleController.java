package library.controller.admin;

import library.common.base.ApiResponse;
import library.dto.admin.RolePermissionUpdateRequest;
import library.dto.admin.RoleResponse;
import library.entity.UserEntity;
import library.service.AdminRoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/roles")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminRoleController {

    private final AdminRoleService adminRoleService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<RoleResponse>>> getRoles() {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách vai trò thành công", adminRoleService.getRoles()));
    }

    @PutMapping("/{role}/permissions")
    public ResponseEntity<ApiResponse<RoleResponse>> updatePermissions(
            @PathVariable UserEntity.Role role,
            @RequestBody RolePermissionUpdateRequest request) {
        RoleResponse response = adminRoleService.updateRolePermissions(role, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật quyền thành công", response));
    }
}
