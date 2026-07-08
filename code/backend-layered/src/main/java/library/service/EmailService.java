package library.service;

import java.time.LocalDate;

public interface EmailService {
    void sendGuestBorrowConfirmationEmail(String toEmail, String fullName, String orderCode, LocalDate pickupDate, LocalDate dueDate, String bookTitle, String status, String rentalFee, String depositPrice);
    void sendOtpEmail(String toEmail, String otp);
    void sendForgotPasswordOtpEmail(String toEmail, String otp);
    void sendOverdueReminderEmail(String toEmail, String fullName, String orderCode, java.util.List<String> bookList, LocalDate dueDate, String finePerDay);
    void sendPaymentSuccessEmail(String toEmail, String fullName, String orderCode, String amount, String transactionId, String payDate);
    void sendReservationAvailableEmail(String toEmail, String fullName, String bookTitle, LocalDate holdUntilDate);
    void sendBookVisitConfirmationEmail(String toEmail, String fullName, String bookTitle, String confirmationCode, String visitDate, String visitTime, String phone);
    void sendBookVisitReminderEmail(String toEmail, String fullName, String bookTitle, String visitDate, String visitTime);
    void sendWelcomeEmail(String toEmail, String fullName, String rawPassword);
    void sendBookVisitStatusEmail(String toEmail, String fullName, String status, String notes);
    void sendAccountActivationEmail(String toEmail, String fullName, String activationToken);
    void sendGuestBorrowStatusEmail(String toEmail, String fullName, String orderCode, String status, String reason);
    void sendGuestReturnReceiptEmail(String toEmail, String fullName, String orderCode, String summary);
}
