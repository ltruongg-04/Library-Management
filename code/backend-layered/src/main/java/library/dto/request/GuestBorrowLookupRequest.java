package library.dto.request;

import lombok.Data;

@Data
public class GuestBorrowLookupRequest {
    private String identifier;
    private String orderCode;
    private String phone;
    private String otp;
    private String recaptchaToken;
}
