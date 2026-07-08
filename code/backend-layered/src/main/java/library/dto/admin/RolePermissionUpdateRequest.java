package library.dto.admin;

import lombok.Data;

import java.util.List;

@Data
public class RolePermissionUpdateRequest {
    private List<String> permissionIds;
}
