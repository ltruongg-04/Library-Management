package library.repository;

import library.entity.RolePermissionEntity;
import library.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RolePermissionRepository extends JpaRepository<RolePermissionEntity, Integer> {
    List<RolePermissionEntity> findByRoleName(UserEntity.Role roleName);

    @Modifying
    @Query("DELETE FROM RolePermissionEntity r WHERE r.roleName = :roleName")
    void deleteByRoleName(@Param("roleName") UserEntity.Role roleName);
}
