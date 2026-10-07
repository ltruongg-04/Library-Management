package library.dto.admin;

import library.entity.PaymentMethod;
import library.entity.PaymentStatus;
import library.entity.PaymentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminPaymentDto {
    private Integer id;
    private String orderCode;
    private PaymentMethod paymentMethod;
    private String transactionCode;
    private BigDecimal amount;
    private PaymentType paymentType;
    private PaymentStatus paymentStatus;
    private LocalDateTime paymentDate;
    private String processedByName;
}
