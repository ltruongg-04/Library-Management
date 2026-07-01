package library.dto.borrow;

import library.entity.BorrowOrderStatus;
import library.entity.PaymentMethod;
import library.entity.PaymentStatus;
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
public class BorrowResponseDto {

    private Integer id;
    private String orderCode;
    private LocalDate pickupDate;
    private LocalDate dueDate;
    private BorrowOrderStatus status;
    private BigDecimal totalDeposit;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private String paymentUrl;

}
