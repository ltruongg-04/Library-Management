package library.controller.user;

import jakarta.servlet.http.HttpServletRequest;
import library.common.exception.CustomBusinessException;
import library.entity.*;
import library.repository.BorrowOrderRepository;
import library.repository.BorrowOrderDetailRepository;
import library.repository.BookCopyRepository;
import library.repository.PaymentRepository;
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
    private final library.repository.FineRepository fineRepository;

    @Value("${vnpay.frontend-url:http://localhost:3000}")
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

            log.info("VNPay IPN: Payment SUCCESS for orderCode={}, transactionNo={}", orderCode, transactionNo);

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
                    adminBorrowService.updateBorrowStatus(orderCode, library.entity.BorrowOrderStatus.READY);
                } catch (Exception e) {
                    log.error("Failed to auto-approve new borrow order", e);
                }
            } else if (payment.getPaymentType() == PaymentType.FINE) {
                log.info("Auto-approving fine payment for orderCode={}", orderCode);
                try {
                    if (payment.getFineId() != null) {
                        library.entity.FineEntity fine = fineRepository.findById(payment.getFineId()).orElse(null);
                        if (fine != null) {
                            fine.setStatus(library.entity.FineStatus.PAID);
                            fineRepository.save(fine);
                        }
                    }
                } catch (Exception e) {
                    log.error("Failed to update fine status", e);
                }
            }
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
                        adminBorrowService.updateBorrowStatus(orderCode, library.entity.BorrowOrderStatus.READY);
                    } catch (Exception e) {
                        log.error("Failed to auto-approve new borrow order", e);
                    }
                }
            }
        } else {
            status = "failed";

            // Handle payment failure — auto cancel
            if (payment != null && payment.getPaymentStatus() == PaymentStatus.PENDING) {
                handlePaymentFailure(payment, orderCode);
            }
        }

        // Redirect to frontend result page with payment details for receipt
        StringBuilder redirectUrl = new StringBuilder(frontendUrl)
                .append("/thanh-toan/ket-qua?status=").append(status)
                .append("&orderCode=").append(orderCode);
                
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
    }
}
