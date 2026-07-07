package library.entity;

import jakarta.persistence.*;
import library.common.base.BaseEntity;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "borrow_orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BorrowOrderEntity extends BaseEntity {

    @Column(name = "order_code", length = 50)
    private String orderCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private CustomerEntity customer;

    @Column(name = "borrow_date")
    private LocalDate borrowDate;

    @Column(name = "pickup_date")
    private LocalDate pickupDate;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "actual_return_date")
    private LocalDate actualReturnDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private BorrowOrderStatus status = BorrowOrderStatus.PENDING;

    @Column(name = "subtotal_fee", precision = 10, scale = 2)
    private BigDecimal subtotalFee;

    @Column(name = "discount_percent", precision = 5, scale = 2)
    private BigDecimal discountPercent;

    @Column(name = "discount_amount", precision = 10, scale = 2)
    private BigDecimal discountAmount;

    @Column(name = "total_fee", precision = 10, scale = 2)
    private BigDecimal totalFee;

    @Column(name = "total_deposit", precision = 10, scale = 2)
    private BigDecimal totalDeposit;

    @OneToMany(mappedBy = "borrowOrder", fetch = FetchType.LAZY)
    @org.hibernate.annotations.BatchSize(size = 50)
    @Builder.Default
    private List<BorrowOrderDetailEntity> orderDetails = new ArrayList<>();

    // Business Logic Methods
    public void addExtensionFee(BigDecimal fee) {
        BigDecimal currentSubtotal = this.subtotalFee != null ? this.subtotalFee : BigDecimal.ZERO;
        BigDecimal currentTotal = this.totalFee != null ? this.totalFee : BigDecimal.ZERO;
        this.subtotalFee = currentSubtotal.add(fee);
        this.totalFee = currentTotal.add(fee);
    }

    public void approveExtension(LocalDate newDueDate) {
        this.dueDate = newDueDate;
        this.status = BorrowOrderStatus.BORROWED;
    }

    public void rejectExtensionRevertStatus() {
        if (this.dueDate != null && this.dueDate.isBefore(LocalDate.now())) {
            this.status = BorrowOrderStatus.OVERDUE;
        } else {
            this.status = BorrowOrderStatus.BORROWED;
        }
    }
}
