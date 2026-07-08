package library.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminReviewResponse {
    private Integer id;
    private String reviewerName;
    private String reviewerInitials;
    private String reviewerRole;
    private String bookTitle;
    private Integer rating;
    private String createdAt;
    private Integer createdDaysAgo;
    private String content;
    private String hideReason;
    private String status;
    private String accent;
}
