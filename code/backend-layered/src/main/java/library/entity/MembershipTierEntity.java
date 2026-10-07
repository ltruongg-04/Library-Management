package library.entity;

import jakarta.persistence.*;
import library.common.base.BaseEntity;
import lombok.*;

@Entity
@Table(name = "membership_tiers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MembershipTierEntity extends BaseEntity {

    @Column(nullable = false, length = 50)
    private String name;

    @Column(name = "min_points", nullable = false)
    @Builder.Default
    private Integer minPoints = 0;

    @Column(name = "discount_percent", nullable = false)
    @Builder.Default
    private Integer discountPercent = 0;

    @Column(name = "max_borrow_days", nullable = false)
    @Builder.Default
    private Integer maxBorrowDays = 14;

    @Column(name = "max_borrow_books", nullable = false)
    @Builder.Default
    private Integer maxBorrowBooks = 5;
}
