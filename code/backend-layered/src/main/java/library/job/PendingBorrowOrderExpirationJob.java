package library.job;

import library.entity.BookCopyEntity;
import library.entity.BookCopyStatus;
import library.entity.BorrowOrderDetailEntity;
import library.entity.BorrowOrderDetailStatus;
import library.entity.BorrowOrderEntity;
import library.entity.BorrowOrderStatus;
import library.entity.CustomerEntity;
import library.entity.PaymentEntity;
import library.entity.PaymentMethod;
import library.entity.PaymentStatus;
import library.entity.PaymentType;
import library.repository.BookCopyRepository;
import library.repository.BorrowOrderDetailRepository;
import library.repository.BorrowOrderRepository;
import library.repository.PaymentRepository;
import library.service.CacheInvalidationService;
import library.service.EmailService;
import library.service.NotificationService;
import library.service.SystemLogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.support.TransactionTemplate;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * Phiếu PENDING đang giữ một bản sao sách: nếu không ai thanh toán hay duyệt thì sách bị khóa vĩnh viễn.
 * Mỗi phiếu chạy trong transaction riêng để một phiếu lỗi không làm hỏng cả lượt.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class PendingBorrowOrderExpirationJob {

    // VNPay hết hạn thanh toán sau 15 phút; chờ thêm để IPN đến muộn vẫn kịp duyệt phiếu
    private static final int UNPAID_VNPAY_HOLD_MINUTES = 30;
    private static final int UNAPPROVED_HOLD_DAYS = 3;

    private final BorrowOrderRepository borrowOrderRepository;
    private final BorrowOrderDetailRepository borrowOrderDetailRepository;
    private final BookCopyRepository bookCopyRepository;
    private final PaymentRepository paymentRepository;
    private final EmailService emailService;
    private final NotificationService notificationService;
    private final SystemLogService systemLogService;
    private final CacheInvalidationService cacheInvalidationService;
    private final TransactionTemplate transactionTemplate;

    @Scheduled(fixedDelay = 5, timeUnit = TimeUnit.MINUTES)
    public void cancelUnpaidVnPayOrders() {
        LocalDateTime cutoff = LocalDateTime.now().minusMinutes(UNPAID_VNPAY_HOLD_MINUTES);
        cancelAll(borrowOrderRepository.findOrderCodesWithUnpaidVnPayDepositBefore(cutoff),
                "Phiếu mượn đã được tự động hủy vì chưa thanh toán tiền cọc.");
    }

    @Scheduled(cron = "0 45 1 * * ?")
    public void cancelUnapprovedOrders() {
        LocalDateTime cutoff = LocalDateTime.now().minusDays(UNAPPROVED_HOLD_DAYS);
        cancelAll(borrowOrderRepository.findPendingOrderCodesCreatedBefore(cutoff),
                "Phiếu mượn đã được tự động hủy vì quá thời gian chờ duyệt.");
    }

    private void cancelAll(List<String> orderCodes, String reason) {
        int cancelled = 0;
        for (String orderCode : orderCodes) {
            try {
                if (Boolean.TRUE.equals(transactionTemplate.execute(status -> cancelIfStillPending(orderCode, reason)))) {
                    cancelled++;
                }
            } catch (RuntimeException e) {
                log.error("Failed to auto-cancel borrow order {}", orderCode, e);
            }
        }

        if (cancelled > 0) {
            cacheInvalidationService.evictBookCaches();
            log.info("Auto-cancelled {} pending borrow orders.", cancelled);
        }
    }

    private boolean cancelIfStillPending(String orderCode, String reason) {
        // Khóa giao dịch cọc trước khi đọc phiếu để không ghi đè kết quả của IPN đang xử lý cùng lúc
        PaymentEntity deposit = paymentRepository.findByTransactionCodeForUpdate(orderCode).orElse(null);
        BorrowOrderEntity order = borrowOrderRepository.findByOrderCode(orderCode).orElse(null);
        if (order == null || order.getStatus() != BorrowOrderStatus.PENDING) {
            return false;
        }
        if (hasCollectedMoney(order)) {
            log.error("Borrow order {} is pending but already has a paid transaction, skipping auto-cancel", orderCode);
            return false;
        }

        order.setStatus(BorrowOrderStatus.CANCELLED);
        borrowOrderRepository.save(order);
        releaseCopies(order);

        // Giao dịch VNPay giữ nguyên PENDING để IPN đến muộn vẫn ghi nhận được tiền và báo cần đối soát
        if (deposit != null && deposit.getPaymentMethod() != PaymentMethod.VNPAY
                && deposit.getPaymentType() == PaymentType.DEPOSIT && deposit.getPaymentStatus() == PaymentStatus.PENDING) {
            deposit.setPaymentStatus(PaymentStatus.FAILED);
            paymentRepository.save(deposit);
        }

        notifyCustomer(order, reason);
        systemLogService.logAction("Tự hủy phiếu mượn", "Tự hủy phiếu " + orderCode + ": " + reason);
        return true;
    }

    private boolean hasCollectedMoney(BorrowOrderEntity order) {
        return paymentRepository.findByBorrowOrderIdAndPaymentStatus(order.getId(), PaymentStatus.SUCCESS).stream()
                .anyMatch(payment -> payment.getAmount() != null && payment.getAmount().compareTo(BigDecimal.ZERO) > 0);
    }

    private void releaseCopies(BorrowOrderEntity order) {
        for (BorrowOrderDetailEntity detail : borrowOrderDetailRepository.findByBorrowOrderId(order.getId())) {
            detail.setStatus(BorrowOrderDetailStatus.CANCELLED);
            borrowOrderDetailRepository.save(detail);

            BookCopyEntity copy = detail.getBookCopy();
            if (copy != null && copy.getStatus() == BookCopyStatus.MAINTENANCE) {
                copy.setStatus(BookCopyStatus.AVAILABLE);
                bookCopyRepository.save(copy);
            }
        }
    }

    private void notifyCustomer(BorrowOrderEntity order, String reason) {
        CustomerEntity customer = order.getCustomer();
        if (customer == null) {
            return;
        }

        if (customer.getUser() != null) {
            notificationService.createForUser(customer.getUser(), "Phiếu mượn đã bị hủy", reason, "BORROW");
        } else if (customer.getEmail() != null) {
            emailService.sendGuestBorrowStatusEmail(customer.getEmail(), customer.getFullName(), order.getOrderCode(), "CANCELLED", reason);
        }
    }
}
