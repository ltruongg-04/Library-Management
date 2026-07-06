package library.service;

import java.time.LocalDate;

public interface EmailService {
    void sendGuestBorrowConfirmationEmail(String toEmail, String fullName, String orderCode, LocalDate pickupDate, LocalDate dueDate, String bookTitle, String status, String rentalFee, String depositPrice);
    void sendOtpEmail(String toEmail, String otp);
    void sendForgotPasswordOtpEmail(String toEmail, String otp);
}
