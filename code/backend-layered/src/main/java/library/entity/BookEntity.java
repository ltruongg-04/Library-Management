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
@org.hibernate.annotations.SQLDelete(sql = "UPDATE books SET is_deleted = true WHERE id=?")
@org.hibernate.annotations.SQLRestriction("is_deleted = false")
@org.hibernate.annotations.BatchSize(size = 50)
public class BookEntity extends BaseEntity {

    @Column(name = "title", nullable = false)
    private String title;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "book_authors",
        joinColumns = @JoinColumn(name = "book_id"),
        inverseJoinColumns = @JoinColumn(name = "author_id")
    )
    @org.hibernate.annotations.BatchSize(size = 50)
    @Builder.Default
    private Set<AuthorEntity> authors = new HashSet<>();

    @Column(name = "isbn", unique = true, length = 20)
    private String isbn;

    @Column(name = "publisher")
    private String publisher;

    @Column(name = "publication_date")
    private java.time.LocalDate publicationDate;

    @Column(name = "pages")
    private Integer pages;

    @org.hibernate.annotations.Formula("(SELECT COUNT(*) FROM book_copies bc WHERE bc.book_id = id)")
    @Builder.Default
    private int quantity = 0;

    @org.hibernate.annotations.Formula("(SELECT COUNT(*) FROM book_copies bc WHERE bc.book_id = id AND bc.status = 'AVAILABLE')")
    @Builder.Default
    private int availableQuantity = 0;

    @org.hibernate.annotations.Formula("(SELECT COUNT(bod.id) FROM borrow_order_details bod JOIN book_copies bc ON bod.book_copy_id = bc.id WHERE bc.book_id = id)")
    @Builder.Default
    private int borrowCount = 0;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "book_categories",
        joinColumns = @JoinColumn(name = "book_id"),
        inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    @org.hibernate.annotations.BatchSize(size = 50)
    @Builder.Default
    private Set<CategoryEntity> categories = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "book_tags",
        joinColumns = @JoinColumn(name = "book_id"),
        inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    @org.hibernate.annotations.BatchSize(size = 50)
    @Builder.Default
    private Set<TagEntity> tags = new HashSet<>();

    // Dummy field to satisfy abandoned NOT NULL DB column 'author'
    @Column(name = "author")
    @Builder.Default
    private String author = "";

    // Dummy fields to satisfy abandoned NOT NULL DB columns since we now use @Formula
    @Column(name = "available_quantity")
    @Builder.Default
    private Integer legacyAvailableQuantity = 0;

    @Column(name = "total_quantity")
    @Builder.Default
    private Integer legacyTotalQuantity = 0;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "cover_image", length = 500)
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

    @Column(name = "is_deleted", nullable = false)
    @Builder.Default
    private boolean isDeleted = false;

}
