package library.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewSummaryResponse {
    private long all;
    private long recent;
    private long reported;
    private long hidden;
    private long star5;
    private long star4;
    private long star3;
    private long star2;
    private long star1;
}
