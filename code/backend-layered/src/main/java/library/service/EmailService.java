package library.service;

import java.time.LocalDate;

public interface EmailService {
    void sendGuestBorrowConfirmationEmail(String toEmail, String fullName, String orderCode, LocalDate pickupDate, LocalDate dueDate, String bookTitle, String status, String rentalFee, String depositPrice);
    void sendOtpEmail(String toEmail, String otp);
    void sendForgotPasswordOtpEmail(String toEmail, String otp);
    void sendOverdueReminderEmail(String toEmail, String fullName, String orderCode, java.util.List<String> bookList, LocalDate dueDate, String finePerDay);
    void sendPaymentSuccessEmail(String toEmail, String fullName, String orderCode, String amount, String transactionId, String payDate);
    void sendReservationAvailableEmail(String toEmail, String fullName, String bookTitle, LocalDate holdUntilDate);
}
