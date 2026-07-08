package library.dto.request;

import lombok.Data;

import java.time.LocalDate;

@Data
public class BookVisitRequest {
    private String email;
    private String fullName;
    private String phone;
    private LocalDate visitDate;
    private String visitHour;
    private String visitMinute;
    private String visitPeriod;
    private String purpose;
    private Integer bookId;
    private String bookTitle;
    private String confirmationCode;
}
