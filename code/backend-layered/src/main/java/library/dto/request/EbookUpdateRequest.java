package library.dto.request;

import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EbookUpdateRequest {

    @Min(value = 0, message = "Số trang đọc thử phải lớn hơn hoặc bằng 0")
    private Integer previewPages;

    private Boolean isFree;

    private Integer minMembershipTierId;

    private Boolean isActive;
}
