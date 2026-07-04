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
public class UserBorrowHistoryDto {
    private Integer id;
    private String orderCode;
    private String status;
    private LocalDate borrowDate;
    private LocalDate pickupDate;
    private LocalDate dueDate;
    private BigDecimal totalDeposit;

    // Thông tin cuốn sách (vì mỗi đơn chỉ có 1 cuốn)
    private String bookTitle;
    private String bookAuthor;
    private String bookCoverImage;
}
