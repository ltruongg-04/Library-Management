package library.controller.user;
import library.entity.*;
import library.repository.BorrowOrderRepository;
import library.repository.BorrowOrderDetailRepository;
import library.repository.BookCopyRepository;
import library.repository.PaymentRepository;
import library.service.SystemLogService;
import library.service.VnPayService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.Map;

/**
 * Controller handling VNPay payment callbacks.
 * Includes both IPN (server-to-server) and Return URL (browser redirect) endpoints.
 */
@RestController
@RequestMapping("/api/vnpay")
@RequiredArgsConstructor
@Slf4j
public class VnPayController {

    private static final String RESPONSE_CODE_SUCCESS = "00";

    private final VnPayService vnPayService;
    private final PaymentRepository paymentRepository;
    private final BorrowOrderRepository borrowOrderRepository;
    private final BorrowOrderDetailRepository borrowOrderDetailRepository;
    private final BookCopyRepository bookCopyRepository;
    private final library.service.AdminBorrowService adminBorrowService;
    private final SystemLogService systemLogService;
    private final library.service.BookReturnService bookReturnService;
    private final library.service.EmailService emailService;
    private final library.service.CacheInvalidationService cacheInvalidationService;

    @Value("${vnpay.frontend-url:https://library-management-lovat-theta.vercel.app}")
    private String frontendUrl;

    /**
     * IPN (Instant Payment Notification) handler.
     * Called by VNPay server-to-server to notify payment result.
     * Must respond with specific JSON format for VNPay to acknowledge.
     */
    @GetMapping("/ipn")
    public ResponseEntity<Map<String, String>> handleIpn(@RequestParam Map<String, String> params) {
        log.info("VNPay IPN callback received: vnp_TxnRef={}, vnp_ResponseCode={}",
                params.get("vnp_TxnRef"), params.get("vnp_ResponseCode"));

        // Validate the callback hash
        if (!vnPayService.validateCallback(params)) {
            log.warn("VNPay IPN: Invalid secure hash");
            return ResponseEntity.ok(Map.of("RspCode", "97", "Message", "Invalid Checksum"));
        }

        String txnRef = params.get("vnp_TxnRef");
        String responseCode = params.get("vnp_ResponseCode");
        String transactionNo = params.get("vnp_TransactionNo");

        // Find the payment record
        PaymentEntity payment = paymentRepository.findByTransactionCode(txnRef)
                .orElse(null);

        if (payment == null) {
            log.warn("VNPay IPN: Payment not found for txnRef={}", txnRef);
            return ResponseEntity.ok(Map.of("RspCode", "01", "Message", "Order Not Found"));
        }
        
        String orderCode = payment.getBorrowOrder().getOrderCode();

        // Check if already processed
        if (payment.getPaymentStatus() == PaymentStatus.SUCCESS) {
            log.info("VNPay IPN: Payment already confirmed for orderCode={}", orderCode);
            return ResponseEntity.ok(Map.of("RspCode", "02", "Message", "Order Already Confirmed"));
        }

        if (RESPONSE_CODE_SUCCESS.equals(responseCode)) {
            // Payment successful
            payment.setPaymentStatus(PaymentStatus.SUCCESS);
            payment.setPaymentDate(LocalDateTime.now());
            paymentRepository.save(payment);

            systemLogService.logAction(
                payment.getBorrowOrder() != null && payment.getBorrowOrder().getCustomer() != null ? payment.getBorrowOrder().getCustomer().getUser() : null,
                library.common.constant.SystemLogConstants.ACTION_VNPAY_IPN, 
                String.format(library.common.constant.SystemLogConstants.DETAIL_VNPAY_IPN_SUCCESS, orderCode)
            );
            log.info("VNPay IPN: Payment SUCCESS for orderCode={}, transactionNo={}", orderCode, transactionNo);

            // Gửi email biên lai điện tử
            String toEmail = null;
            String fullName = null;
            if (payment.getBorrowOrder() != null && payment.getBorrowOrder().getCustomer() != null) {
                fullName = payment.getBorrowOrder().getCustomer().getFullName();
                if (payment.getBorrowOrder().getCustomer().getUser() != null) {
                    toEmail = payment.getBorrowOrder().getCustomer().getUser().getEmail();
                } else {
                    toEmail = payment.getBorrowOrder().getCustomer().getEmail();
                }
            }
            if (toEmail != null && !toEmail.isEmpty()) {
                String amountStr = params.get("vnp_Amount");
                String displayAmount = amountStr != null ? String.valueOf(Long.parseLong(amountStr) / 100) : "0";
                emailService.sendPaymentSuccessEmail(toEmail, fullName, orderCode, displayAmount, transactionNo, params.get("vnp_PayDate"));
            }

            // Auto-approve renewal if it's a renewal fee
            if (payment.getPaymentType() == PaymentType.RENTAL_FEE) {
                log.info("Auto-approving renewal for orderCode={}", orderCode);
                try {
                    adminBorrowService.processRenewal(orderCode, new library.dto.admin.AdminRenewalRequestDto(true));
                } catch (Exception e) {
                    log.error("Failed to auto-approve renewal", e);
                }
            } else if (payment.getPaymentType() == PaymentType.DEPOSIT) {
                log.info("Auto-approving new borrow order (DEPOSIT) for orderCode={}", orderCode);
                try {
                    adminBorrowService.approveBorrow(orderCode);
                } catch (Exception e) {
                    log.error("Failed to auto-approve new borrow order", e);
                }
            } else if (payment.getPaymentType() == PaymentType.FINE) {
                log.info("Auto-completing fine payment for orderCode={}", orderCode);
                try {
                    if (payment.getFineId() != null) {
                        bookReturnService.completeVnPayFinePayment(payment.getFineId());
                    } else if (payment.getBookReturnId() != null) {
                        bookReturnService.finalizeReturnStatus(payment.getBookReturnId());
                    }
                } catch (Exception e) {
                    log.error("Failed to complete fine payment", e);
                }
            }
            cacheInvalidationService.evictBookCaches();
        } else {
            // Payment failed — auto cancel the borrow order
            handlePaymentFailure(payment, orderCode);
            log.info("VNPay IPN: Payment FAILED for orderCode={}, responseCode={}", orderCode, responseCode);
        }

        return ResponseEntity.ok(Map.of("RspCode", "00", "Message", "Confirm Success"));
    }

    /**
     * Return URL handler.
     * Browser redirect after user completes/cancels payment on VNPay.
     * Validates hash and redirects to frontend result page.
     */
    @GetMapping("/return")
    public ResponseEntity<Void> handleReturn(@RequestParam Map<String, String> params) {
        log.info("VNPay Return callback received: vnp_TxnRef={}, vnp_ResponseCode={}",
                params.get("vnp_TxnRef"), params.get("vnp_ResponseCode"));

        String txnRef = params.get("vnp_TxnRef");
        String responseCode = params.get("vnp_ResponseCode");
        String transactionNo = params.get("vnp_TransactionNo");

        // Validate hash
        boolean isValid = vnPayService.validateCallback(params);

        PaymentEntity payment = paymentRepository.findByTransactionCode(txnRef).orElse(null);
        String orderCode = payment != null ? payment.getBorrowOrder().getOrderCode() : "UNKNOWN";

        String status;
        if (isValid && RESPONSE_CODE_SUCCESS.equals(responseCode)) {
            status = "success";

            // Also update payment status here (in case IPN hasn't arrived yet)
            if (payment != null && payment.getPaymentStatus() != PaymentStatus.SUCCESS) {
                payment.setPaymentStatus(PaymentStatus.SUCCESS);
                payment.setPaymentDate(LocalDateTime.now());
                paymentRepository.save(payment);
                
                systemLogService.logAction(
                    payment.getBorrowOrder() != null && payment.getBorrowOrder().getCustomer() != null ? payment.getBorrowOrder().getCustomer().getUser() : null,
                    library.common.constant.SystemLogConstants.ACTION_VNPAY_RETURN, 
                    String.format(library.common.constant.SystemLogConstants.DETAIL_VNPAY_RETURN_SUCCESS, orderCode)
                );
                
                // Gửi email biên lai điện tử (Dành cho trường hợp test localhost khi IPN không gọi được)
                String toEmail = null;
                String fullName = null;
                if (payment.getBorrowOrder() != null && payment.getBorrowOrder().getCustomer() != null) {
                    fullName = payment.getBorrowOrder().getCustomer().getFullName();
                    if (payment.getBorrowOrder().getCustomer().getUser() != null) {
                        toEmail = payment.getBorrowOrder().getCustomer().getUser().getEmail();
                    } else {
                        toEmail = payment.getBorrowOrder().getCustomer().getEmail();
                    }
                }
                if (toEmail != null && !toEmail.isEmpty()) {
                    String amountStr = params.get("vnp_Amount");
                    String displayAmount = amountStr != null ? String.valueOf(Long.parseLong(amountStr) / 100) : "0";
                    emailService.sendPaymentSuccessEmail(toEmail, fullName, orderCode, displayAmount, transactionNo, params.get("vnp_PayDate"));
                }
                
                // Trigger auto-approve logic here as fallback (crucial for localhost testing where IPN is unreachable)
                if (payment.getPaymentType() == PaymentType.RENTAL_FEE) {
                    log.info("Auto-approving renewal (via Return URL) for orderCode={}", orderCode);
                    try {
                        adminBorrowService.processRenewal(orderCode, new library.dto.admin.AdminRenewalRequestDto(true));
                    } catch (Exception e) {
                        log.error("Failed to auto-approve renewal", e);
                    }
                } else if (payment.getPaymentType() == PaymentType.DEPOSIT) {
                    log.info("Auto-approving new borrow order (via Return URL) for orderCode={}", orderCode);
                    try {
                        adminBorrowService.approveBorrow(orderCode);
                    } catch (Exception e) {
                        log.error("Failed to auto-approve new borrow order", e);
                    }
                } else if (payment.getPaymentType() == PaymentType.FINE) {
                    log.info("Auto-completing fine payment (via Return URL) for orderCode={}", orderCode);
                    try {
                        if (payment.getFineId() != null) {
                            bookReturnService.completeVnPayFinePayment(payment.getFineId());
                        } else if (payment.getBookReturnId() != null) {
                            bookReturnService.finalizeReturnStatus(payment.getBookReturnId());
                        }
                    } catch (Exception e) {
                        log.error("Failed to complete fine payment via Return URL", e);
                    }
                }
            }
            cacheInvalidationService.evictBookCaches();
        } else {
            status = "failed";

            // Handle payment failure — auto cancel
            if (payment != null && payment.getPaymentStatus() == PaymentStatus.PENDING) {
                handlePaymentFailure(payment, orderCode);
            }
        }

        // Redirect to frontend result page with payment details for receipt
        String paymentTypeStr = payment != null && payment.getPaymentType() != null ? payment.getPaymentType().name() : "";
        StringBuilder redirectUrl = new StringBuilder(frontendUrl)
                .append("/thanh-toan/ket-qua?status=").append(status)
                .append("&orderCode=").append(orderCode)
                .append("&type=").append(paymentTypeStr);
                
        if (RESPONSE_CODE_SUCCESS.equals(responseCode)) {
            try {
                String amount = params.get("vnp_Amount");
                if (amount != null) {
                    long amountVnd = Long.parseLong(amount) / 100;
                    redirectUrl.append("&amount=").append(amountVnd);
                }
                if (transactionNo != null) redirectUrl.append("&txnNo=").append(transactionNo);
                if (params.get("vnp_PayDate") != null) redirectUrl.append("&payDate=").append(params.get("vnp_PayDate"));
                if (params.get("vnp_OrderInfo") != null) {
                    redirectUrl.append("&orderInfo=").append(java.net.URLEncoder.encode(params.get("vnp_OrderInfo"), java.nio.charset.StandardCharsets.UTF_8));
                }
            } catch (Exception e) {
                log.warn("Failed to append payment details to redirect URL", e);
            }
        }
        
        log.info("VNPay Return: Redirecting to {}", redirectUrl.toString());

        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create(redirectUrl.toString()))
                .build();
    }

    /**
     * Handles payment failure by updating payment status, cancelling the borrow order,
     * and releasing the reserved book copy.
     */
    private void handlePaymentFailure(PaymentEntity payment, String orderCode) {
        payment.setPaymentStatus(PaymentStatus.FAILED);
        payment.setPaymentDate(LocalDateTime.now());
        paymentRepository.save(payment);
        
        systemLogService.logAction(
            payment.getBorrowOrder() != null && payment.getBorrowOrder().getCustomer() != null ? payment.getBorrowOrder().getCustomer().getUser() : null,
            library.common.constant.SystemLogConstants.ACTION_VNPAY_FAIL, 
            String.format(library.common.constant.SystemLogConstants.DETAIL_VNPAY_FAIL, orderCode),
            library.common.constant.SystemLogConstants.STATUS_FAILED
        );

        // Cancel the borrow order if it's a new borrow, or reject renewal if it's a renewal
        BorrowOrderEntity borrowOrder = payment.getBorrowOrder();
        if (borrowOrder != null) {
            if (borrowOrder.getStatus() == BorrowOrderStatus.PENDING) {
                borrowOrder.setStatus(BorrowOrderStatus.CANCELLED);
                borrowOrderRepository.save(borrowOrder);

                // Cancel order details and release the reserved book copy
                borrowOrder.getOrderDetails().forEach(detail -> {
                    // Cancel the detail so it doesn't show up as 'borrowing'
                    detail.setStatus(BorrowOrderDetailStatus.CANCELLED);
                    borrowOrderDetailRepository.save(detail);

                    // Release book copy (set back to AVAILABLE from MAINTENANCE)
                    BookCopyEntity bookCopy = detail.getBookCopy();
                    if (bookCopy != null && bookCopy.getStatus() == BookCopyStatus.MAINTENANCE) {
                        bookCopy.setStatus(BookCopyStatus.AVAILABLE);
                        bookCopyRepository.save(bookCopy);
                    }
                });

                log.info("VNPay: Borrow order CANCELLED and book copies released for orderCode={}", orderCode);
            } else if (borrowOrder.getStatus() == BorrowOrderStatus.PENDING_RENEWAL) {
                // If payment for renewal failed, auto-reject the renewal request
                try {
                    adminBorrowService.processRenewal(orderCode, new library.dto.admin.AdminRenewalRequestDto(false));
                    log.info("VNPay: Renewal REJECTED due to failed payment for orderCode={}", orderCode);
                } catch (Exception e) {
                    log.error("Failed to auto-reject renewal on payment failure for orderCode={}", orderCode, e);
                }
            }
        }
        cacheInvalidationService.evictBookCaches();
    }
}
