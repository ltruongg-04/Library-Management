package library.dto.borrow;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserBorrowDetailDto {
    private Integer id;
    private String orderCode;
    private String status;
    private LocalDate borrowDate;
    private LocalDate pickupDate;
    private LocalDate dueDate;
    private BigDecimal totalDeposit;
    private BigDecimal totalFee;
    private BigDecimal lateFee;

    // Thông tin cuốn sách
    private String bookTitle;
    private String bookAuthor;
    private String bookCoverImage;
    private String bookDetailStatus;
}
