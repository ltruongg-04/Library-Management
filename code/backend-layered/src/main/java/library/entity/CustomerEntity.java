package library.entity;

import jakarta.persistence.*;
import library.common.base.BaseEntity;
import lombok.*;

@Entity
@Table(name = "customers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerEntity extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", unique = true)
    private UserEntity user;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "phone", nullable = false, length = 15)
    private String phone;

    @Column(name = "email")
    private String email;

    @Column(name = "address", length = 500)
    private String address;

    @Column(name = "identity_card", unique = true, length = 20)
    private String identityCard;

    @Column(name = "library_card_no", unique = true, length = 50)
    private String libraryCardNo;

    @Column(name = "membership_tier_id")
    private Integer membershipTierId;
}
