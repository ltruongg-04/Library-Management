package library.service.impl;

import library.service.EmailService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EmailServiceImpl implements EmailService {

    @Value("${resend.api.key:}")
    private String resendApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public void sendOtpEmail(String toEmail, String otp) {
        if (resendApiKey == null || resendApiKey.isEmpty()) {
            System.out.println("No RESEND_API_KEY found. Skipping real email send. OTP is: " + otp);
            return;
        }

        String url = "https://api.resend.com/emails";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(resendApiKey);

        Map<String, Object> body = new HashMap<>();
        body.put("from", "onboarding@resend.dev");
        body.put("to", List.of(toEmail));
        body.put("subject", "Mã xác thực tra cứu đơn mượn - Thư viện Lumina");
        
        String htmlContent = "<div style=\"font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;\">" +
                "<h2 style=\"color: #2e6c80;\">Xác thực Email</h2>" +
                "<p>Chào bạn,</p>" +
                "<p>Bạn đang yêu cầu tra cứu đơn mượn tại hệ thống thư viện. Vui lòng nhập mã OTP dưới đây để xác nhận:</p>" +
                "<h1 style=\"color: #d9534f; letter-spacing: 5px; text-align: center; padding: 10px; background: #f9f9f9; border-radius: 4px;\">" + otp + "</h1>" +
                "<p>Mã này có hiệu lực trong 5 phút. Vui lòng không chia sẻ mã này cho người khác.</p>" +
                "<p>Trân trọng,<br>Ban quản trị Thư viện</p>" +
                "</div>";
                
        body.put("html", htmlContent);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            restTemplate.postForEntity(url, entity, String.class);
            System.out.println("OTP Email sent successfully via Resend to " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send email via Resend: " + e.getMessage());
        }
    }

    @Override
    public void sendForgotPasswordOtpEmail(String toEmail, String otp) {
        if (resendApiKey == null || resendApiKey.isEmpty()) {
            System.out.println("No RESEND_API_KEY found. Skipping real email send. OTP is: " + otp);
            return;
        }

        String url = "https://api.resend.com/emails";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(resendApiKey);

        Map<String, Object> body = new HashMap<>();
        body.put("from", "onboarding@resend.dev");
        body.put("to", List.of(toEmail));
        body.put("subject", "Mã xác thực quên mật khẩu - Thư viện Lumina");
        
        String htmlContent = "<div style=\"font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;\">" +
                "<h2 style=\"color: #2e6c80;\">Xác thực quên mật khẩu</h2>" +
                "<p>Chào bạn,</p>" +
                "<p>Bạn đang yêu cầu đặt lại mật khẩu tại hệ thống thư viện. Vui lòng nhập mã OTP dưới đây để xác nhận:</p>" +
                "<h1 style=\"color: #d9534f; letter-spacing: 5px; text-align: center; padding: 10px; background: #f9f9f9; border-radius: 4px;\">" + otp + "</h1>" +
                "<p>Mã này có hiệu lực trong 5 phút. Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.</p>" +
                "<p>Trân trọng,<br>Ban quản trị Thư viện</p>" +
                "</div>";
                
        body.put("html", htmlContent);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            restTemplate.postForEntity(url, entity, String.class);
            System.out.println("Forgot Password OTP Email sent successfully via Resend to " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send email via Resend: " + e.getMessage());
        }
    }
}
