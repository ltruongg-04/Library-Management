package library.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import library.common.base.BaseEntity;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "borrowing_policies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BorrowingPolicyEntity extends BaseEntity {

    @Column(name = "max_borrow_days")
    private Integer maxBorrowDays;

    @Column(name = "max_books")
    private Integer maxBooks;

    @Column(name = "rental_fee_per_day", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal rentalFeePerDay = new BigDecimal("5000");

    @Column(name = "overdue_fine_per_day", precision = 10, scale = 2)
    private BigDecimal overdueFinePerDay;

    @Column(name = "rental_fee_per_day", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal rentalFeePerDay = new BigDecimal("5000");

    @Column(name = "damage_fee_percent", precision = 5, scale = 2)
    private BigDecimal damageFeePercent;

    @Column(name = "lost_book_multiplier", precision = 5, scale = 2)
    private BigDecimal lostBookMultiplier;

    @Column(name = "max_extensions")
    @Builder.Default
    private Integer maxExtensions = 2; // Default to 2 extensions allowed

}
