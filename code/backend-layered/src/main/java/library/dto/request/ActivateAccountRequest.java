package library.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ActivateAccountRequest {
    @NotBlank(message = "Token kích hoạt là bắt buộc")
    private String token;
}
