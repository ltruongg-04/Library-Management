package library.entity;

import jakarta.persistence.*;
import library.common.base.BaseEntity;
import lombok.*;

@Entity
@Table(name = "ebooks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EbookEntity extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", referencedColumnName = "id", unique = true, nullable = false)
    private BookEntity book;

    @Column(name = "file_key", nullable = false, length = 500)
    private String fileKey;

    @Column(name = "file_name", length = 255)
    private String fileName;

    @Column(name = "file_format", length = 20)
    @Builder.Default
    private String fileFormat = "PDF";

    @Column(name = "file_size_bytes")
    private Long fileSizeBytes;

    @Column(name = "total_pages")
    @Builder.Default
    private Integer totalPages = 0;

    @Column(name = "preview_pages")
    @Builder.Default
    private Integer previewPages = 5;

    @Column(name = "is_free", nullable = false)
    @Builder.Default
    private Boolean isFree = false;

    @Column(name = "min_membership_tier_id")
    private Integer minMembershipTierId;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;
}
