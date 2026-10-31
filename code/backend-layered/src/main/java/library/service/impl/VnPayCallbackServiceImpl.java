package library.service.impl;

import library.common.constant.SystemLogConstants;
import library.common.utils.VnPayUtil;
import library.entity.BookCopyEntity;
import library.entity.BookCopyStatus;
import library.entity.BorrowExtensionStatus;
import library.entity.BorrowOrderDetailStatus;
import library.entity.BorrowOrderEntity;
import library.entity.BorrowOrderStatus;
import library.entity.CustomerEntity;
import library.entity.PaymentEntity;
import library.entity.PaymentMethod;
import library.entity.PaymentStatus;
import library.entity.PaymentType;
import library.entity.UserEntity;
import library.repository.BookCopyRepository;
import library.repository.BorrowExtensionRepository;
import library.repository.BorrowOrderDetailRepository;
import library.repository.BorrowOrderRepository;
import library.repository.PaymentRepository;
import library.service.AdminBorrowService;
import library.service.BookReturnService;
import library.service.CacheInvalidationService;
import library.service.EmailService;
import library.service.SystemLogService;
import library.service.VnPayCallbackService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class VnPayCallbackServiceImpl implements VnPayCallbackService {

    private static final int VND_AMOUNT_DIVISOR = 100;

    private final PaymentRepository paymentRepository;
    private final BorrowOrderRepository borrowOrderRepository;
    private final BorrowOrderDetailRepository borrowOrderDetailRepository;
    private final BookCopyRepository bookCopyRepository;
    private final BorrowExtensionRepository borrowExtensionRepository;
    private final AdminBorrowService adminBorrowService;
    private final BookReturnService bookReturnService;
    private final SystemLogService systemLogService;
    private final EmailService emailService;
    private final CacheInvalidationService cacheInvalidationService;

    @Override
    @Transactional
    public Result processCallback(Map<String, String> params) {
        String txnRef = params.get("vnp_TxnRef");

        // Khóa dòng để IPN và Return đến cùng lúc không xử lý một giao dịch hai lần
        PaymentEntity payment = paymentRepository.findByTransactionCodeForUpdate(txnRef).orElse(null);
        if (payment == null || payment.getPaymentMethod() != PaymentMethod.VNPAY) {
            log.warn("VNPay callback: Payment not found for txnRef={}", txnRef);
            return Result.PAYMENT_NOT_FOUND;
        }

        if (!isAmountMatched(payment, params.get("vnp_Amount"))) {
            log.error("VNPay callback: Amount mismatch for txnRef={}, expected={}, received={}",
                    txnRef, payment.getAmount(), params.get("vnp_Amount"));
            return Result.AMOUNT_MISMATCH;
        }

        boolean isPaid = VnPayUtil.isSuccessfulCallback(params);
        if (payment.getPaymentStatus() != PaymentStatus.PENDING) {
            if (isPaid && payment.getPaymentStatus() != PaymentStatus.SUCCESS) {
                logReconciliationNeeded(payment, "giao dịch đã ở trạng thái " + payment.getPaymentStatus());
            }
            return Result.ALREADY_PROCESSED;
        }

        if (isPaid) {
            handlePaymentSuccess(payment, params);
        } else {
            handlePaymentFailure(payment);
        }
        cacheInvalidationService.evictBookCaches();
        return Result.CONFIRMED;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<PaymentSummary> findPaymentSummary(String transactionCode) {
        return paymentRepository.findByTransactionCode(transactionCode)
                .map(payment -> new PaymentSummary(payment.getBorrowOrder().getOrderCode(), payment.getPaymentType()));
    }

    private boolean isAmountMatched(PaymentEntity payment, String vnpAmount) {
        try {
            return vnpAmount != null && Long.parseLong(vnpAmount) == VnPayUtil.toVnpAmount(payment.getAmount());
        } catch (NumberFormatException e) {
            return false;
        }
    }

    private void handlePaymentSuccess(PaymentEntity payment, Map<String, String> params) {
        BorrowOrderEntity order = payment.getBorrowOrder();
        String orderCode = order.getOrderCode();

        payment.setPaymentStatus(PaymentStatus.SUCCESS);
        payment.setPaymentDate(LocalDateTime.now());
        paymentRepository.save(payment);

        systemLogService.logAction(findCustomerUser(order), SystemLogConstants.ACTION_VNPAY_IPN,
                String.format(SystemLogConstants.DETAIL_VNPAY_IPN_SUCCESS, orderCode));
        log.info("VNPay: Payment SUCCESS for orderCode={}, transactionNo={}", orderCode, params.get("vnp_TransactionNo"));

        applyPaidPayment(payment, order);
        sendReceiptAfterCommit(order, params);
    }

    private void applyPaidPayment(PaymentEntity payment, BorrowOrderEntity order) {
        String orderCode = order.getOrderCode();
        if (payment.getPaymentType() == PaymentType.DEPOSIT) {
            // Tiền đã thu nên giao dịch vẫn phải được ghi nhận, kể cả khi phiếu đã bị hủy trong lúc khách thanh toán
            if (order.getStatus() == BorrowOrderStatus.PENDING) {
                adminBorrowService.approveBorrow(orderCode);
            } else {
                logReconciliationNeeded(payment, "phiếu đang ở trạng thái " + order.getStatus());
            }
        } else if (payment.getPaymentType() == PaymentType.RENTAL_FEE) {
            if (hasPendingExtension(order)) {
                adminBorrowService.processRenewal(orderCode, new library.dto.admin.AdminRenewalRequestDto(true));
            } else {
                logReconciliationNeeded(payment, "không có yêu cầu gia hạn đang chờ");
            }
        } else if (payment.getPaymentType() == PaymentType.FINE) {
            if (payment.getFineId() != null) {
                bookReturnService.completeVnPayFinePayment(payment.getFineId());
            } else if (payment.getBookReturnId() != null) {
                bookReturnService.finalizeReturnStatus(payment.getBookReturnId());
            }
        }
    }

    private void handlePaymentFailure(PaymentEntity payment) {
        BorrowOrderEntity order = payment.getBorrowOrder();
        String orderCode = order.getOrderCode();

        payment.setPaymentStatus(PaymentStatus.FAILED);
        payment.setPaymentDate(LocalDateTime.now());
        paymentRepository.save(payment);

        systemLogService.logAction(findCustomerUser(order), SystemLogConstants.ACTION_VNPAY_FAIL,
                String.format(SystemLogConstants.DETAIL_VNPAY_FAIL, orderCode), SystemLogConstants.STATUS_FAILED);
        log.info("VNPay: Payment FAILED for orderCode={}", orderCode);

        if (order.getStatus() == BorrowOrderStatus.PENDING) {
            cancelOrderAndReleaseCopies(order);
        } else if (order.getStatus() == BorrowOrderStatus.PENDING_RENEWAL && hasPendingExtension(order)) {
            adminBorrowService.processRenewal(orderCode, new library.dto.admin.AdminRenewalRequestDto(false));
        }
    }

    private void cancelOrderAndReleaseCopies(BorrowOrderEntity order) {
        order.setStatus(BorrowOrderStatus.CANCELLED);
        borrowOrderRepository.save(order);

        order.getOrderDetails().forEach(detail -> {
            detail.setStatus(BorrowOrderDetailStatus.CANCELLED);
            borrowOrderDetailRepository.save(detail);

            BookCopyEntity bookCopy = detail.getBookCopy();
            if (bookCopy != null && bookCopy.getStatus() == BookCopyStatus.MAINTENANCE) {
                bookCopy.setStatus(BookCopyStatus.AVAILABLE);
                bookCopyRepository.save(bookCopy);
            }
        });
    }

    private boolean hasPendingExtension(BorrowOrderEntity order) {
        return borrowExtensionRepository
                .findFirstByBorrowOrderIdAndStatusOrderByRequestedAtDesc(order.getId(), BorrowExtensionStatus.PENDING)
                .isPresent();
    }

    private void logReconciliationNeeded(PaymentEntity payment, String reason) {
        String orderCode = payment.getBorrowOrder().getOrderCode();
        log.error("VNPay: Money received but cannot be applied, orderCode={}, reason={}", orderCode, reason);
        systemLogService.logAction(findCustomerUser(payment.getBorrowOrder()), SystemLogConstants.ACTION_VNPAY_IPN,
                String.format(SystemLogConstants.DETAIL_VNPAY_RECONCILE, orderCode, reason), SystemLogConstants.STATUS_FAILED);
    }

    private UserEntity findCustomerUser(BorrowOrderEntity order) {
        return order.getCustomer() != null ? order.getCustomer().getUser() : null;
    }

    private void sendReceiptAfterCommit(BorrowOrderEntity order, Map<String, String> params) {
        CustomerEntity customer = order.getCustomer();
        if (customer == null) {
            return;
        }
        String toEmail = customer.getUser() != null ? customer.getUser().getEmail() : customer.getEmail();
        if (toEmail == null || toEmail.isEmpty()) {
            return;
        }

        String fullName = customer.getFullName();
        String orderCode = order.getOrderCode();
        String displayAmount = String.valueOf(Long.parseLong(params.get("vnp_Amount")) / VND_AMOUNT_DIVISOR);

        // Chỉ gửi biên lai khi giao dịch đã commit, tránh gửi rồi lại rollback và VNPay gọi lại
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCommit() {
                try {
                    emailService.sendPaymentSuccessEmail(toEmail, fullName, orderCode, displayAmount,
                            params.get("vnp_TransactionNo"), params.get("vnp_PayDate"));
                } catch (RuntimeException e) {
                    log.error("Failed to send payment receipt for orderCode={}", orderCode, e);
                }
            }
        });
    }
}
