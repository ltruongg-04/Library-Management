package library.dto.admin.returnbook;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class AdminReturnBookResponseDto {
    private Integer bookReturnId;
    private Integer borrowOrderId;
    private LocalDateTime returnDate;
    private Integer overdueDays;
    private BigDecimal totalFineAmount;
    private String note;
    private FineDto fine;

    private String orderCode;
    private BigDecimal subtotalFee;
    private BigDecimal totalDeposit;
    private BigDecimal totalAmountToPay;

    private java.util.List<ReturnDetailDto> details;
}
