package library.dto.admin;

import library.entity.BorrowOrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminBorrowOrderDetailDto {
    private Integer id;
    private String orderCode;
    private LocalDate borrowDate;
    private LocalDate pickupDate;
    private LocalDate dueDate;
    private BorrowOrderStatus status;
    private BigDecimal subtotalFee;
    private BigDecimal discountAmount;
    private BigDecimal totalFee;
    private BigDecimal totalDeposit;
    private BigDecimal totalPaidOnline;
    private BigDecimal actualAmountToPay;

    private String customerName;
    private String customerCode;
    private String customerPhone;
    private Boolean isGuest;

    private List<BorrowItemDto> items;
}
