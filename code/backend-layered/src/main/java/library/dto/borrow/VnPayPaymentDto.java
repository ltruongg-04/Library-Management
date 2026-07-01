package library.dto.borrow;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO containing VNPay payment URL details returned to the client
 * when a borrow order is created with VNPay payment method.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VnPayPaymentDto {

    private String paymentUrl;
    private String orderCode;
    private BigDecimal amount;
}
