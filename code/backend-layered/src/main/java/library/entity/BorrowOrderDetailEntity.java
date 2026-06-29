package library.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "borrow_order_details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BorrowOrderDetailEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "borrow_order_id", nullable = false)
    private BorrowOrderEntity borrowOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_copy_id", nullable = false)
    private BookCopyEntity bookCopy;

    @Column(name = "rental_fee", precision = 10, scale = 2)
    private BigDecimal rentalFee;

    @Column(name = "deposit_price", precision = 10, scale = 2)
    private BigDecimal depositPrice;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private BorrowOrderDetailStatus status = BorrowOrderDetailStatus.BORROWING;
}
