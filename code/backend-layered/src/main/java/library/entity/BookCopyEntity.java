package library.entity;

import jakarta.persistence.*;
import library.common.base.BaseEntity;
import lombok.*;

@Entity
@Table(name = "book_copies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@org.hibernate.annotations.BatchSize(size = 50)
public class BookCopyEntity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    private BookEntity book;

    @Column(name = "barcode", unique = true, nullable = false, length = 50)
    private String barcode;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private BookCopyStatus status = BookCopyStatus.AVAILABLE;

    @Column(name = "condition_note", columnDefinition = "TEXT")
    private String conditionNote;

}
