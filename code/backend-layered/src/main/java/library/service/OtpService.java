package library.service;

public interface OtpService {
    void requestOtp(String email);
    void requestForgotPasswordOtp(String email);
    boolean validateOtp(String email, String otp);
    void clearOtp(String email);

    String generateResetToken(String email);
    String validateAndGetEmailFromResetToken(String token);
    void clearResetToken(String token);
}
