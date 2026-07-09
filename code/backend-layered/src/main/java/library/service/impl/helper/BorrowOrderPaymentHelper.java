package library.service.impl.helper;

import jakarta.servlet.http.HttpServletRequest;
import library.common.utils.VnPayUtil;
import library.entity.BorrowOrderEntity;
import library.entity.PaymentEntity;
import library.entity.PaymentMethod;
import library.entity.PaymentStatus;
import library.entity.PaymentType;
import library.repository.PaymentRepository;
import library.service.VnPayService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class BorrowOrderPaymentHelper {

    private final PaymentRepository paymentRepository;
    private final VnPayService vnPayService;

    public PaymentEntity createDepositPayment(BorrowOrderEntity borrowOrder, BigDecimal depositPrice, PaymentMethod paymentMethod) {
        PaymentEntity payment = PaymentEntity.builder()
                .borrowOrder(borrowOrder)
                .paymentMethod(paymentMethod)
                .transactionCode(borrowOrder.getOrderCode())
                .amount(depositPrice)
                .paymentType(PaymentType.DEPOSIT)
                .paymentStatus(PaymentStatus.PENDING)
                .paymentDate(LocalDateTime.now())
                .build();

        return paymentRepository.save(payment);
    }

    public String handleRenewalPayment(BorrowOrderEntity order, BigDecimal amountToPayOnline, BigDecimal overdueFee, HttpServletRequest httpRequest) {
        PaymentEntity payment = PaymentEntity.builder()
                .borrowOrder(order)
                .paymentMethod(PaymentMethod.VNPAY)
                .transactionCode(UUID.randomUUID().toString())
                .amount(amountToPayOnline)
                .paymentType(PaymentType.RENTAL_FEE)
                .paymentStatus(PaymentStatus.PENDING)
                .paymentDate(LocalDateTime.now())
                .build();
        paymentRepository.save(payment);

        String ipAddress = VnPayUtil.getIpAddress(httpRequest);
        String orderInfo = overdueFee.compareTo(BigDecimal.ZERO) > 0
                ? "Gia han va nop phat don hang " + order.getOrderCode()
                : "Gia han don hang " + order.getOrderCode();
        return vnPayService.createPaymentUrl(
                payment.getTransactionCode(),
                orderInfo,
                amountToPayOnline,
                ipAddress);
    }
}
