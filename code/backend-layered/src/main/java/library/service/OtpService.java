package library.service;

public interface OtpService {
    void requestOtp(String email);
    void requestForgotPasswordOtp(String email);
    boolean validateOtp(String email, String otp);
}
