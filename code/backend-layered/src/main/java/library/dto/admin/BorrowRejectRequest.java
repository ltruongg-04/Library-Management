package library.dto.admin;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BorrowRejectRequest {
    @NotBlank(message = "Lý do từ chối là bắt buộc")
    private String reason;
}
