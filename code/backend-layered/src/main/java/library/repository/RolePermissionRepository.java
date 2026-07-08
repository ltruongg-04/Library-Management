package library.repository;

import library.entity.RolePermissionEntity;
import library.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RolePermissionRepository extends JpaRepository<RolePermissionEntity, Integer> {
    List<RolePermissionEntity> findByRoleName(UserEntity.Role roleName);

    void deleteByRoleName(UserEntity.Role roleName);
}
