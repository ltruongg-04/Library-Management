package library.dto.admin.returnbook;

import lombok.Data;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Data
public class AdminReturnBookRequestDto {
    @NotNull(message = "Mã phiếu mượn không được để trống")
    private Integer borrowOrderId;

    @NotNull(message = "Danh sách sách trả không được để trống")
    private List<BookReturnDetailRequestDto> details;

    private String generalNote;
}
