package library.service.impl;

import library.service.EmailService;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final TemplateEngine templateEngine;
    private final Resend resend;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${resend.from-email}")
    private String senderEmail;

    private final String resendApiKey;

    public EmailServiceImpl(TemplateEngine templateEngine, @Value("${resend.api-key:}") String resendApiKey) {
        this.templateEngine = templateEngine;
        this.resendApiKey = resendApiKey;
        this.resend = (resendApiKey != null && !resendApiKey.trim().isEmpty()) ? new Resend(resendApiKey) : null;
    }

    @Override
    @Async
    public void sendGuestBorrowConfirmationEmail(String toEmail, String fullName, String orderCode, LocalDate pickupDate, LocalDate dueDate, String bookTitle, String status, String rentalFee, String depositPrice) {
        if (this.resend == null) {
            log.warn("Resend API key is not configured. Email will not be sent to {}", toEmail);
            return;
        }
        if (toEmail == null || toEmail.trim().isEmpty()) {
            log.warn("Cannot send email because toEmail is empty for order: {}", orderCode);
            return;
        }

        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

            Context context = new Context();
            context.setVariable("fullName", fullName);
            context.setVariable("orderCode", orderCode);
            context.setVariable("pickupDate", pickupDate != null ? pickupDate.format(formatter) : "N/A");
            context.setVariable("dueDate", dueDate != null ? dueDate.format(formatter) : "N/A");
            context.setVariable("bookTitle", bookTitle);
            context.setVariable("status", status);
            context.setVariable("rentalFee", rentalFee);
            context.setVariable("depositPrice", depositPrice);

            String htmlContent = templateEngine.process("email/guest-borrow-confirmation", context);

            CreateEmailOptions sendEmailRequest = CreateEmailOptions.builder()
                    .from(senderEmail)
                    .to(toEmail)
                    .subject("Xác nhận yêu cầu mượn sách - " + orderCode)
                    .html(htmlContent)
                    .build();

            CreateEmailResponse data = resend.emails().send(sendEmailRequest);
            log.info("Successfully sent borrow confirmation email to {} via Resend for order {}. Resend ID: {}", toEmail, orderCode, data.getId());

        } catch (ResendException e) {
            log.error("Failed to send borrow confirmation email to {} via Resend", toEmail, e);
        } catch (Exception e) {
            log.error("Unexpected error while sending email to {}", toEmail, e);
        }
    }

    @Override
    public void sendOtpEmail(String toEmail, String otp) {
        if (resendApiKey == null || resendApiKey.isEmpty()) {
            log.warn("No RESEND_API_KEY found. Skipping real email send. OTP is: {}", otp);
            return;
        }

        String url = "https://api.resend.com/emails";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(resendApiKey);

        Map<String, Object> body = new HashMap<>();
        body.put("from", senderEmail);
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
            log.info("OTP Email sent successfully via Resend to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send email via Resend: {}", e.getMessage());
        }
    }

    @Override
    public void sendForgotPasswordOtpEmail(String toEmail, String otp) {
        if (resendApiKey == null || resendApiKey.isEmpty()) {
            log.warn("No RESEND_API_KEY found. Skipping real email send. OTP is: {}", otp);
            return;
        }

        String url = "https://api.resend.com/emails";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(resendApiKey);

        Map<String, Object> body = new HashMap<>();
        body.put("from", senderEmail);
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
            log.info("Forgot Password OTP Email sent successfully via Resend to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send email via Resend: {}", e.getMessage());
        }
    }

    @Override
    @Async
    public void sendOverdueReminderEmail(String toEmail, String fullName, String orderCode, List<String> bookList, LocalDate dueDate, String finePerDay) {
        if (this.resend == null) return;
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            Context context = new Context();
            context.setVariable("fullName", fullName);
            context.setVariable("orderCode", orderCode);
            context.setVariable("bookList", bookList);
            context.setVariable("dueDate", dueDate != null ? dueDate.format(formatter) : "N/A");
            context.setVariable("finePerDay", finePerDay);

            String htmlContent = templateEngine.process("email/overdue-reminder", context);

            CreateEmailOptions sendEmailRequest = CreateEmailOptions.builder()
                    .from(senderEmail)
                    .to(toEmail)
                    .subject("Cảnh báo: Sách quá hạn trả - " + orderCode)
                    .html(htmlContent)
                    .build();

            resend.emails().send(sendEmailRequest);
            log.info("Successfully sent overdue reminder email to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send overdue email to {}", toEmail, e);
        }
    }

    @Override
    @Async
    public void sendPaymentSuccessEmail(String toEmail, String fullName, String orderCode, String amount, String transactionId, String payDate) {
        if (this.resend == null) return;
        try {
            Context context = new Context();
            context.setVariable("fullName", fullName);
            context.setVariable("orderCode", orderCode);
            context.setVariable("amount", amount);
            context.setVariable("transactionId", transactionId);
            context.setVariable("payDate", payDate);

            String htmlContent = templateEngine.process("email/payment-success", context);

            CreateEmailOptions sendEmailRequest = CreateEmailOptions.builder()
                    .from(senderEmail)
                    .to(toEmail)
                    .subject("Xác nhận thanh toán thành công - Thư viện Lumina")
                    .html(htmlContent)
                    .build();

            resend.emails().send(sendEmailRequest);
            log.info("Successfully sent payment success email to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send payment success email to {}", toEmail, e);
        }
    }

    @Override
    @Async
    public void sendReservationAvailableEmail(String toEmail, String fullName, String bookTitle, LocalDate holdUntilDate) {
        if (this.resend == null) return;
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            Context context = new Context();
            context.setVariable("fullName", fullName);
            context.setVariable("bookTitle", bookTitle);
            context.setVariable("holdUntilDate", holdUntilDate != null ? holdUntilDate.format(formatter) : "N/A");

            String htmlContent = templateEngine.process("email/reservation-available", context);

            CreateEmailOptions sendEmailRequest = CreateEmailOptions.builder()
                    .from(senderEmail)
                    .to(toEmail)
                    .subject("Thông báo: Sách bạn đặt trước đã có sẵn")
                    .html(htmlContent)
                    .build();

            resend.emails().send(sendEmailRequest);
            log.info("Successfully sent reservation available email to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send reservation available email to {}", toEmail, e);
        }
    }
}