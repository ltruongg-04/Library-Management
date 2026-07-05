package library.dto.admin;

import library.entity.BorrowOrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminBorrowOrderDto {
    private String id;
    private String customerName;
    private String customerCode;
    private String bookTitle;
    private String bookAuthor;
    private LocalDate borrowDate;
    private LocalDate dueDate;
    private BorrowOrderStatus status;
    private Integer overdayCount;
    private Boolean isGuest;
}
