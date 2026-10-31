package library.service;

public interface LoginAttemptService {
    /**
     * Ghi nhận một lần đăng nhập sai, tạm khóa tài khoản nếu vượt quá số lần cho phép.
     */
    void recordFailedLogin(Integer userId);
}
