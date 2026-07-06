package library.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "book_return_details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookReturnDetailEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_return_id", nullable = false)
    private BookReturnEntity bookReturn;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_copy_id", nullable = false)
    private BookCopyEntity bookCopy;

    @Enumerated(EnumType.STRING)
    @Column(name = "condition_status")
    private ConditionStatus conditionStatus;

    @Column(name = "fine_amount")
    private BigDecimal fineAmount;

    @Column(columnDefinition = "TEXT")
    private String note;
}
