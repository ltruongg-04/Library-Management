package library.service;

public interface OtpService {
    /**
     * Mục đích của OTP: mã cấp cho việc này không dùng được cho việc khác.
     */
    enum Purpose {
        GUEST_LOOKUP,
        PASSWORD_RESET
    }

    void requestOtp(String email);
    void requestForgotPasswordOtp(String email);
    boolean validateOtp(Purpose purpose, String email, String otp);
    void clearOtp(Purpose purpose, String email);

    String generateResetToken(String email);
    String validateAndGetEmailFromResetToken(String token);
    void clearResetToken(String token);
}
