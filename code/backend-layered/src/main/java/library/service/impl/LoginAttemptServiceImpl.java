package library.service.impl;

import library.repository.UserRepository;
import library.service.LoginAttemptService;
import library.service.SystemLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class LoginAttemptServiceImpl implements LoginAttemptService {

    private static final int MAX_FAILED_LOGIN_ATTEMPTS = 5;
    private static final int LOCK_MINUTES = 15;

    private final UserRepository userRepository;
    private final SystemLogService systemLogService;

    /**
     * Chạy trong transaction riêng để bộ đếm không bị rollback theo exception đăng nhập sai,
     * và dùng câu lệnh UPDATE atomic để không mất lượt đếm khi có nhiều request song song.
     */
    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void recordFailedLogin(Integer userId) {
        LocalDateTime now = LocalDateTime.now();
        userRepository.incrementFailedLoginAttempts(userId, now);

        int locked = userRepository.lockIfAttemptsReached(userId, MAX_FAILED_LOGIN_ATTEMPTS, now.plusMinutes(LOCK_MINUTES));
        if (locked > 0) {
            userRepository.findById(userId).ifPresent(user -> systemLogService.logAction(user,
                    "Khóa tài khoản tạm thời", "Tài khoản " + user.getEmail() + " bị khóa do đăng nhập sai nhiều lần."));
        }
    }
}
