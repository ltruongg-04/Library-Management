package library.entity;

import jakarta.persistence.*;
import library.common.base.BaseEntity;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "borrow_records")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BorrowRecordEntity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    private BookEntity book;

    @Column(name = "borrow_date")
    private LocalDate borrowDate;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "return_date")
    private LocalDate returnDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private Status status = Status.PENDING;

    public enum Status {
        PENDING,    // Request submitted but not yet approved
        APPROVED,   // Request approved, user can pick up the book
        REJECTED,   // Request rejected
        BORROWED,   // User has picked up the book
        RETURNED,   // User has returned the book
        OVERDUE     // Book was not returned before dueDate
    }
}
