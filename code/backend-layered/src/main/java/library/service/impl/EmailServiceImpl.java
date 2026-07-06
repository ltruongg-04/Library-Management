package library.service.impl;

import library.service.EmailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final TemplateEngine templateEngine;
    private final Resend resend;

    @Value("${resend.from-email}")
    private String senderEmail;

    public EmailServiceImpl(TemplateEngine templateEngine, @Value("${resend.api-key:}") String resendApiKey) {
        this.templateEngine = templateEngine;
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
}
