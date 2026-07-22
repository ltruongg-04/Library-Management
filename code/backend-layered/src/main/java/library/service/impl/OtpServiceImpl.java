package library.service.impl;


import library.service.EmailService;
import library.service.OtpService;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpServiceImpl implements OtpService {

    private static final SecureRandom secureRandom = new SecureRandom();
    private final EmailService emailService;

    // Email -> OtpData
    private final Map<String, OtpData> otpStorage = new ConcurrentHashMap<>();
    private final Map<String, ResetTokenData> resetTokenStorage = new ConcurrentHashMap<>();

    public OtpServiceImpl(EmailService emailService) {
        this.emailService = emailService;
    }

    @Override
    public void requestOtp(String email) {
        String otp = String.format("%06d", secureRandom.nextInt(1000000));
        
        // 5 minutes expiration
        long expirationTime = System.currentTimeMillis() + 5 * 60 * 1000;
        otpStorage.put(email, new OtpData(otp, expirationTime));

        emailService.sendOtpEmail(email, otp);
    }

    @Override
    public void requestForgotPasswordOtp(String email) {
        String otp = String.format("%06d", secureRandom.nextInt(1000000));
        
        // 5 minutes expiration
        long expirationTime = System.currentTimeMillis() + 5 * 60 * 1000;
        otpStorage.put(email, new OtpData(otp, expirationTime));

        emailService.sendForgotPasswordOtpEmail(email, otp);
    }

    @Override
    public boolean validateOtp(String email, String otp) {
        OtpData data = otpStorage.get(email);
        if (data == null) {
            return false;
        }
        if (System.currentTimeMillis() > data.expirationTime) {
            otpStorage.remove(email);
            return false;
        }
        if (data.otp.equals(otp)) {
            return true;
        }
        return false;
    }

    @Override
    public void clearOtp(String email) {
        otpStorage.remove(email);
    }

    @Override
    public String generateResetToken(String email) {
        String token = UUID.randomUUID().toString();
        // Token expires in 15 minutes
        resetTokenStorage.put(token, new ResetTokenData(email, System.currentTimeMillis() + 15 * 60 * 1000));
        return token;
    }

    @Override
    public String validateAndGetEmailFromResetToken(String token) {
        ResetTokenData data = resetTokenStorage.get(token);
        if (data == null || System.currentTimeMillis() > data.expirationTime) {
            return null;
        }
        return data.email;
    }

    @Override
    public void clearResetToken(String token) {
        resetTokenStorage.remove(token);
    }

    private static class OtpData {
        String otp;
        long expirationTime;

        OtpData(String otp, long expirationTime) {
            this.otp = otp;
            this.expirationTime = expirationTime;
        }
    }

    private static class ResetTokenData {
        String email;
        long expirationTime;

        ResetTokenData(String email, long expirationTime) {
            this.email = email;
            this.expirationTime = expirationTime;
        }
    }
}
