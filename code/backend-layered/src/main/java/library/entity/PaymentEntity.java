package library.entity;

import jakarta.persistence.*;
import library.common.base.BaseEntity;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentEntity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "borrow_order_id")
    private BorrowOrderEntity borrowOrder;

    @Column(name = "fine_id")
    private Integer fineId;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", length = 30)
    private PaymentMethod paymentMethod;

    @Column(name = "transaction_code", length = 255)
    private String transactionCode;

    @Column(name = "amount", precision = 10, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_type", length = 30)
    private PaymentType paymentType;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", length = 30)
    private PaymentStatus paymentStatus;

    @Column(name = "processed_by")
    private Integer processedBy;

    @Column(name = "payment_date")
    private LocalDateTime paymentDate;
}
