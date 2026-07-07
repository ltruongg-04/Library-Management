package library.dto.request;

import lombok.Data;

@Data
public class ReCaptchaResponseDto {
    private boolean success;
    private String challenge_ts;
    private String hostname;
    private Double score;
    private String action;
}
