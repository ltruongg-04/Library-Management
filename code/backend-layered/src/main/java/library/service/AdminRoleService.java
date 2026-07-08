package library.service;

import library.dto.admin.RolePermissionUpdateRequest;
import library.dto.admin.RoleResponse;
import library.entity.UserEntity;

import java.util.List;

public interface AdminRoleService {
    List<RoleResponse> getRoles();

    RoleResponse updateRolePermissions(UserEntity.Role role, RolePermissionUpdateRequest request);

    List<String> getPermissionIds(UserEntity.Role role);
}
