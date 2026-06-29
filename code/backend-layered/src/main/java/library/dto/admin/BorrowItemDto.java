package library.dto.admin;

import library.entity.BorrowOrderDetailStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BorrowItemDto {
    private Integer id;
    private String bookTitle;
    private String bookAuthor;
    private String barcode;
    private BigDecimal rentalFee;
    private BigDecimal depositPrice;
    private BorrowOrderDetailStatus status;
}
