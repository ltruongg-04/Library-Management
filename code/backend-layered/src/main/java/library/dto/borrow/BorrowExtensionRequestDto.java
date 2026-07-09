package library.dto.borrow;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BorrowExtensionRequestDto {
    @NotNull(message = "Thời lượng gia hạn là bắt buộc")
    @Min(value = 1, message = "Duration must be at least 1 day")
    private Integer durationInDays;
}
