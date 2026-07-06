package library.service;

public interface OtpService {
    void requestOtp(String email);
    boolean validateOtp(String email, String otp);
}
