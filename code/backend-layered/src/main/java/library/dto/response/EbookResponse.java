package library.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EbookResponse {
    private Integer id;
    private Integer bookId;
    private String bookTitle;
    private String fileName;
    private String fileFormat;
    private Long fileSizeBytes;
    private Integer totalPages;
    private Integer previewPages;
    private Boolean isFree;
    private Integer minMembershipTierId;
    private String minMembershipTierName;
    private Boolean isActive;

    // Phân quyền theo người dùng hiện tại
    private Boolean canReadFull;
    private Boolean previewOnly;
    private Integer allowedPages;
    private String accessReason;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
