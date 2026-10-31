package library.repository;

import library.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Integer> {

    Optional<UserEntity> findByEmail(String email);

    Optional<UserEntity> findByActivationToken(String activationToken);

    boolean existsByEmail(String email);

    // Khóa cũ đã hết hạn thì bắt đầu đếm lại từ đầu
    @Modifying
    @Query("""
            UPDATE UserEntity u
            SET u.failedLoginAttempts = CASE WHEN u.lockedUntil IS NOT NULL AND u.lockedUntil <= :now THEN 1 ELSE u.failedLoginAttempts + 1 END,
                u.lockedUntil = CASE WHEN u.lockedUntil IS NOT NULL AND u.lockedUntil <= :now THEN NULL ELSE u.lockedUntil END
            WHERE u.id = :userId
            """)
    void incrementFailedLoginAttempts(@Param("userId") Integer userId, @Param("now") LocalDateTime now);

    @Modifying
    @Query("""
            UPDATE UserEntity u
            SET u.lockedUntil = :lockedUntil
            WHERE u.id = :userId AND u.failedLoginAttempts >= :maxAttempts AND u.lockedUntil IS NULL
            """)
    int lockIfAttemptsReached(@Param("userId") Integer userId,
                              @Param("maxAttempts") int maxAttempts,
                              @Param("lockedUntil") LocalDateTime lockedUntil);
}
