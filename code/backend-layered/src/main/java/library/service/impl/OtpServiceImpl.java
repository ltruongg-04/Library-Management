package library.service.impl;


import library.common.constant.ErrorMessages;
import library.common.exception.CustomBusinessException;
import library.service.EmailService;
import library.service.OtpService;
import library.service.RateLimitService;
import lombok.RequiredArgsConstructor;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Duration;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OtpServiceImpl implements OtpService {

    private static final SecureRandom secureRandom = new SecureRandom();

    private static final Duration OTP_TTL = Duration.ofMinutes(5);
    private static final Duration RESET_TOKEN_TTL = Duration.ofMinutes(15);
    private static final Duration RESEND_COOLDOWN = Duration.ofSeconds(60);
    private static final Duration SEND_WINDOW = Duration.ofHours(1);
    private static final int MAX_SENDS_PER_WINDOW = 5;
    private static final int MAX_ATTEMPTS_PER_OTP = 5;

    private static final String OTP_PREFIX = "otp:code:";
    private static final String ATTEMPTS_PREFIX = "otp:attempts:";
    private static final String COOLDOWN_PREFIX = "otp:cooldown:";
    private static final String SEND_COUNT_PREFIX = "otp:sends:";
    private static final String RESET_TOKEN_PREFIX = "otp:reset-token:";

    private final EmailService emailService;
    private final StringRedisTemplate redisTemplate;
    private final RateLimitService rateLimitService;

    @Override
    public void requestOtp(String email) {
        emailService.sendOtpEmail(email, issueOtp(Purpose.GUEST_LOOKUP, email));
    }

    @Override
    public void requestForgotPasswordOtp(String email) {
        emailService.sendForgotPasswordOtpEmail(email, issueOtp(Purpose.PASSWORD_RESET, email));
    }

    @Override
    public boolean validateOtp(Purpose purpose, String email, String otp) {
        String scopedEmail = scopedEmail(purpose, email);
        String expected = redisTemplate.opsForValue().get(OTP_PREFIX + scopedEmail);
        if (expected == null || otp == null) {
            return false;
        }

        // Nhập sai quá số lần thì hủy mã luôn, người dùng phải yêu cầu mã mới (bị giới hạn số lần gửi)
        if (!rateLimitService.tryAcquire(ATTEMPTS_PREFIX + scopedEmail, MAX_ATTEMPTS_PER_OTP, OTP_TTL)) {
            clearOtp(purpose, email);
            return false;
        }

        return MessageDigest.isEqual(expected.getBytes(StandardCharsets.UTF_8), otp.getBytes(StandardCharsets.UTF_8));
    }

    @Override
    public void clearOtp(Purpose purpose, String email) {
        String scopedEmail = scopedEmail(purpose, email);
        redisTemplate.delete(List.of(OTP_PREFIX + scopedEmail, ATTEMPTS_PREFIX + scopedEmail));
    }

    @Override
    public String generateResetToken(String email) {
        String token = UUID.randomUUID().toString();
        redisTemplate.opsForValue().set(RESET_TOKEN_PREFIX + token, email, RESET_TOKEN_TTL);
        return token;
    }

    @Override
    public String validateAndGetEmailFromResetToken(String token) {
        return redisTemplate.opsForValue().get(RESET_TOKEN_PREFIX + token);
    }

    @Override
    public void clearResetToken(String token) {
        redisTemplate.delete(RESET_TOKEN_PREFIX + token);
    }

    private String issueOtp(Purpose purpose, String email) {
        String scopedEmail = scopedEmail(purpose, email);
        boolean allowed = rateLimitService.tryAcquire(COOLDOWN_PREFIX + scopedEmail, 1, RESEND_COOLDOWN)
                && rateLimitService.tryAcquire(SEND_COUNT_PREFIX + scopedEmail, MAX_SENDS_PER_WINDOW, SEND_WINDOW);
        if (!allowed) {
            throw new CustomBusinessException(ErrorMessages.OTP_REQUEST_TOO_FREQUENT, HttpStatus.TOO_MANY_REQUESTS);
        }

        String otp = String.format("%06d", secureRandom.nextInt(1000000));
        redisTemplate.delete(ATTEMPTS_PREFIX + scopedEmail);
        redisTemplate.opsForValue().set(OTP_PREFIX + scopedEmail, otp, OTP_TTL);
        return otp;
    }

    private String scopedEmail(Purpose purpose, String email) {
        return purpose.name() + ":" + email.trim().toLowerCase(Locale.ROOT);
    }
}
