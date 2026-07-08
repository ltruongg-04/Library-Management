package library.entity;

import jakarta.persistence.*;
import library.common.base.BaseEntity;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserEntity extends BaseEntity {

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(name = "email", nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "phone", length = 15)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 20)
    @Builder.Default
    private Role role = Role.CUSTOMER;

    @Column(name = "active", nullable = false)
    @Builder.Default
    private boolean active = true;

    @Column(name = "last_login")
    private java.time.LocalDateTime lastLogin;

    @Column(name = "activation_token", length = 100)
    private String activationToken;

    @Column(name = "activation_token_expires_at")
    private java.time.LocalDateTime activationTokenExpiresAt;

    @Column(name = "failed_login_attempts", nullable = false)
    @Builder.Default
    private int failedLoginAttempts = 0;

    @Column(name = "locked_until")
    private java.time.LocalDateTime lockedUntil;

    public enum Role {
        CUSTOMER,
        USER,
        LIBRARIAN,
        ADMIN
    }
}
