package library.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ReviewResponse {
    private Integer id;
    private Integer userId;
    private String userName;
    private String avatarUrl; // Assuming we might have avatars later or just return default
    private Integer rating;
    private String comment;
    private java.time.LocalDateTime createdAt;
}
