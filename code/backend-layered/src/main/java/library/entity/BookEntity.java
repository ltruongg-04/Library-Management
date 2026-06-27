package library.entity;

import jakarta.persistence.*;
import library.common.base.BaseEntity;
import lombok.*;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "books")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookEntity extends BaseEntity {

    @Column(name = "title", nullable = false)
    private String title;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "book_authors",
        joinColumns = @JoinColumn(name = "book_id"),
        inverseJoinColumns = @JoinColumn(name = "author_id")
    )
    @Builder.Default
    private Set<AuthorEntity> authors = new HashSet<>();

    @Column(name = "isbn", unique = true, length = 20)
    private String isbn;

    @Column(name = "publisher")
    private String publisher;

    @Column(name = "publish_year")
    private Integer publishYear;

    @Column(name = "pages")
    private Integer pages;

    @org.hibernate.annotations.Formula("(SELECT COUNT(*) FROM book_copies bc WHERE bc.book_id = id)")
    @Builder.Default
    private int quantity = 0;

    @org.hibernate.annotations.Formula("(SELECT COUNT(*) FROM book_copies bc WHERE bc.book_id = id AND bc.status = 'AVAILABLE')")
    @Builder.Default
    private int availableQuantity = 0;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "book_categories",
        joinColumns = @JoinColumn(name = "book_id"),
        inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    @Builder.Default
    private Set<CategoryEntity> categories = new HashSet<>();

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "rating")
    @Builder.Default
    private Double rating = 0.0;

    @Column(name = "review_count")
    @Builder.Default
    private Integer reviewCount = 0;

    @Column(name = "shelf_location", length = 50)
    private String shelfLocation;

    @Column(name = "deposit_price", precision = 10, scale = 2)
    private BigDecimal depositPrice;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    @Builder.Default
    private BookStatus status = BookStatus.AVAILABLE;
}
