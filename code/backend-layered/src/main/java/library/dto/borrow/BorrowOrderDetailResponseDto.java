package library.dto.borrow;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BorrowOrderDetailResponseDto {
    private String id; // Borrow order code
    private String borrowDate;
    private String dueDate;
    private String actualReturnDate;
    private String deadlineDate;
    private String reminderDate;
    private String borrowSuccessDate;
    private String deposit;
    private String rentalFee;
    private String lateFee;
    private String total;
    private String paidOnline;
    private String customerName;
    private String customerPhone;
    private String status;
    private Integer overdueDays;
    private Integer extensionCount;
    private List<BookItemDto> books;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BookItemDto {
        private String title;
        private String author;
        private String status;
        private String imgSrc;
    }
}
