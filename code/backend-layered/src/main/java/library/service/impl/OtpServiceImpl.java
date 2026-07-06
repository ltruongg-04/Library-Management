package library.service.impl;

import library.common.exception.CustomBusinessException;
import library.service.EmailService;
import library.service.OtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpServiceImpl implements OtpService {

    private final EmailService emailService;

    // Email -> OtpData
    private final ConcurrentHashMap<String, OtpData> otpStorage = new ConcurrentHashMap<>();

    @Autowired
    public OtpServiceImpl(EmailService emailService) {
        this.emailService = emailService;
    }

    @Override
    public void requestOtp(String email) {
        String otp = String.format("%06d", new Random().nextInt(999999));
        
        // 5 minutes expiration
        long expirationTime = System.currentTimeMillis() + 5 * 60 * 1000;
        otpStorage.put(email, new OtpData(otp, expirationTime));

        emailService.sendOtpEmail(email, otp);
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
            otpStorage.remove(email);
            return true;
        }
        return false;
    }

    private static class OtpData {
        String otp;
        long expirationTime;

        OtpData(String otp, long expirationTime) {
            this.otp = otp;
            this.expirationTime = expirationTime;
        }
    }
}
