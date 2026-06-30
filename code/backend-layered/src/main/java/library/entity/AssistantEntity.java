package library.entity;

import jakarta.persistence.*;
import library.common.base.BaseEntity;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "assistants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssistantEntity extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false, unique = true)
    private UserEntity user;

    @Column(name = "employee_code", length = 50, unique = true)
    private String employeeCode;

    @Column(name = "hire_date")
    private LocalDate hireDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    @Builder.Default
    private Status status = Status.ACTIVE;

    public enum Status {
        ACTIVE,
        INACTIVE
    }
}
