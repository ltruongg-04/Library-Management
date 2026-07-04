package library.dto.borrow;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BorrowHistoryResponseDto {
    private String id;
    private String title;
    private String author;
    private String borrowDate;
    private String dueDate;
    private String actualReturnDate;
    private String deposit;
    private String depositReturn;
    private String lateFee;
    private String status;
    private Integer extensionCount;
    private String imgSrc;
}
