package library.service.impl;

import library.dto.admin.RolePermissionUpdateRequest;
import library.dto.admin.RoleResponse;
import library.common.constant.CacheNames;
import library.entity.RolePermissionEntity;
import library.entity.UserEntity;
import library.repository.RolePermissionRepository;
import library.service.AdminRoleService;
import library.service.CacheInvalidationService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminRoleServiceImpl implements AdminRoleService {

    private final RolePermissionRepository rolePermissionRepository;
    private final CacheInvalidationService cacheInvalidationService;

    private static final List<PermissionCatalogModule> PERMISSION_CATALOG = List.of(
            new PermissionCatalogModule("books", "Books & Catalog", "library_books", List.of(
                    new PermissionCatalogItem("add-book", "Add New Books", "Allow user to input new entries into the main catalog."),
                    new PermissionCatalogItem("edit-book", "Edit Book Metadata", "Allow user to modify titles, authors and classification data."),
                    new PermissionCatalogItem("delete-book", "Delete Books", "Allow user to permanently remove items from the catalog.")
            ), Set.of(UserEntity.Role.ADMIN, UserEntity.Role.LIBRARIAN)),
            new PermissionCatalogModule("borrow", "Borrowing & Circulation", "sync_alt", List.of(
                    new PermissionCatalogItem("approve", "Approve Borrows", "Manually override or approve restricted borrowing requests."),
                    new PermissionCatalogItem("fine", "Waive Fines", "Authorize the removal of late fees from customer accounts.")
            ), Set.of(UserEntity.Role.ADMIN, UserEntity.Role.LIBRARIAN)),
            new PermissionCatalogModule("reviews", "Reviews Moderation", "rate_review", List.of(
                    new PermissionCatalogItem("moderate", "Moderate Reviews", "Hide, restore or remove user reviews.")
            ), Set.of(UserEntity.Role.ADMIN, UserEntity.Role.LIBRARIAN)),
            new PermissionCatalogModule("settings", "System Settings", "settings", List.of(
                    new PermissionCatalogItem("manage", "Manage Settings", "Update borrowing policies and system settings.")
            ), Set.of(UserEntity.Role.ADMIN)),
            new PermissionCatalogModule("roles", "Roles & Permissions", "admin_panel_settings", List.of(
                    new PermissionCatalogItem("manage", "Manage Roles", "Update permissions for system roles.")
            ), Set.of(UserEntity.Role.ADMIN))
    );

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = CacheNames.ADMIN_ROLES, key = "'roles'")
    public List<RoleResponse> getRoles() {
        return Arrays.stream(UserEntity.Role.values())
                .filter(role -> role != UserEntity.Role.USER)
                .map(this::buildRoleResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public RoleResponse updateRolePermissions(UserEntity.Role role, RolePermissionUpdateRequest request) {
        Set<String> requestedPermissionIds = request != null && request.getPermissionIds() != null
                ? new LinkedHashSet<>(request.getPermissionIds())
                : new LinkedHashSet<>();

        rolePermissionRepository.deleteByRoleName(role);

        List<RolePermissionEntity> permissions = requestedPermissionIds.stream()
                .filter(permissionId -> isAllowedPermission(role, permissionId))
                .map(permissionId -> RolePermissionEntity.builder()
                        .roleName(role)
                        .permissionId(permissionId)
                        .build())
                .collect(Collectors.toList());

        rolePermissionRepository.saveAll(permissions);
        RoleResponse response = buildRoleResponse(role);
        cacheInvalidationService.evictRoleCaches();
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = CacheNames.ADMIN_ROLES, key = "'permissions:' + #role.name()")
    public List<String> getPermissionIds(UserEntity.Role role) {
        return rolePermissionRepository.findByRoleName(role).stream()
                .map(RolePermissionEntity::getPermissionId)
                .filter(permissionId -> isAllowedPermission(role, permissionId))
                .collect(Collectors.toList());
    }

    private RoleResponse buildRoleResponse(UserEntity.Role role) {
        Set<String> enabledPermissions = new LinkedHashSet<>(getPermissionIds(role));

        List<RoleResponse.PermissionModuleResponse> modules = PERMISSION_CATALOG.stream()
                .filter(module -> module.allowedRoles().contains(role))
                .map(module -> RoleResponse.PermissionModuleResponse.builder()
                        .id(module.id())
                        .name(module.name())
                        .icon(module.icon())
                        .permissions(module.permissions().stream()
                                .map(permission -> {
                                    String fullPermissionId = buildPermissionId(module.id(), permission.id());
                                    return RoleResponse.PermissionResponse.builder()
                                            .id(permission.id())
                                            .name(permission.name())
                                            .description(permission.description())
                                            .enabled(enabledPermissions.contains(fullPermissionId))
                                            .build();
                                })
                                .collect(Collectors.toList()))
                        .build())
                .collect(Collectors.toCollection(ArrayList::new));

        return RoleResponse.builder()
                .id(role.name().toLowerCase())
                .name(getRoleName(role))
                .description(getRoleDescription(role))
                .modules(modules)
                .build();
    }

    private boolean isAllowedPermission(UserEntity.Role role, String permissionId) {
        return PERMISSION_CATALOG.stream()
                .filter(module -> module.allowedRoles().contains(role))
                .flatMap(module -> module.permissions().stream().map(permission -> buildPermissionId(module.id(), permission.id())))
                .anyMatch(permissionId::equals);
    }

    private String buildPermissionId(String moduleId, String permissionId) {
        return moduleId + "." + permissionId;
    }

    private String getRoleName(UserEntity.Role role) {
        return switch (role) {
            case ADMIN -> "Administrator";
            case LIBRARIAN -> "Librarian";
            case CUSTOMER -> "Customer";
            case USER -> "Customer";
        };
    }

    private String getRoleDescription(UserEntity.Role role) {
        return switch (role) {
            case ADMIN -> "Full system access & configuration.";
            case LIBRARIAN -> "Catalog management & user support.";
            case CUSTOMER -> "Standard borrowing & browsing access.";
            case USER -> "Standard borrowing & browsing access.";
        };
    }

    private record PermissionCatalogModule(String id, String name, String icon, List<PermissionCatalogItem> permissions, Set<UserEntity.Role> allowedRoles) {
    }

    private record PermissionCatalogItem(String id, String name, String description) {
    }
}
