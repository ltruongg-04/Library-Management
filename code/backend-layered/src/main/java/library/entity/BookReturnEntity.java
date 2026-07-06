package library.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "book_returns")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookReturnEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "borrow_order_id", nullable = false)
    private BorrowOrderEntity borrowOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assistant_id", nullable = true)
    private AssistantEntity assistant;

    @Column(name = "return_date")
    private LocalDateTime returnDate;

    @Column(name = "overdue_days")
    private Integer overdueDays;

    @Column(name = "total_fine_amount")
    private BigDecimal totalFineAmount;

    @Column(columnDefinition = "TEXT")
    private String note;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "bookReturn", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BookReturnDetailEntity> details;
}
