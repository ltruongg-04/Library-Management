package library.controller.user;
import org.springframework.validation.annotation.Validated;
import library.common.utils.VnPayUtil;
import library.config.VnPayConfig;
import library.service.VnPayCallbackService;
import library.service.VnPayService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.util.Map;
import java.util.Optional;

/**
 * Controller handling VNPay payment callbacks.
 * IPN (server-to-server) is the source of truth for payment state;
 * Return URL (browser redirect) only displays the result.
 */
@Validated
@RestController
@RequestMapping("/api/vnpay")
@RequiredArgsConstructor
@Slf4j
public class VnPayController {

    private final VnPayService vnPayService;
    private final VnPayCallbackService vnPayCallbackService;
    private final VnPayConfig vnPayConfig;

    /**
     * IPN (Instant Payment Notification) handler.
     * Called by VNPay server-to-server to notify payment result.
     * Must respond with specific JSON format for VNPay to acknowledge.
     */
    @GetMapping("/ipn")
    public ResponseEntity<Map<String, String>> handleIpn(@RequestParam Map<String, String> params) {
        log.info("VNPay IPN callback received: vnp_TxnRef={}, vnp_ResponseCode={}",
                params.get("vnp_TxnRef"), params.get("vnp_ResponseCode"));

        if (!vnPayService.validateCallback(params)) {
            log.warn("VNPay IPN: Invalid secure hash");
            return ResponseEntity.ok(Map.of("RspCode", "97", "Message", "Invalid Checksum"));
        }

        try {
            return ResponseEntity.ok(toIpnResponse(vnPayCallbackService.processCallback(params)));
        } catch (Exception e) {
            // Dữ liệu đã rollback; mã 99 báo VNPay gọi lại sau thay vì coi như đã xử lý xong
            log.error("VNPay IPN: Failed to process vnp_TxnRef={}", params.get("vnp_TxnRef"), e);
            return ResponseEntity.ok(Map.of("RspCode", "99", "Message", "Unknown error"));
        }
    }

    private Map<String, String> toIpnResponse(VnPayCallbackService.Result result) {
        return switch (result) {
            case CONFIRMED -> Map.of("RspCode", "00", "Message", "Confirm Success");
            case ALREADY_PROCESSED -> Map.of("RspCode", "02", "Message", "Order Already Confirmed");
            case PAYMENT_NOT_FOUND -> Map.of("RspCode", "01", "Message", "Order Not Found");
            case AMOUNT_MISMATCH -> Map.of("RspCode", "04", "Message", "Invalid Amount");
        };
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

        // Chữ ký sai nghĩa là request không đến từ VNPay: không được đọc hay đổi dữ liệu theo tham số của nó
        if (!vnPayService.validateCallback(params)) {
            log.warn("VNPay Return: Invalid secure hash");
            return redirectTo(vnPayConfig.getFrontendUrl() + "/thanh-toan/ket-qua?status=failed&orderCode=UNKNOWN&type=");
        }

        // Chỉ bật ở môi trường VNPay không gọi được IPN, ví dụ localhost
        if (vnPayConfig.isProcessOnReturn()) {
            try {
                vnPayCallbackService.processCallback(params);
            } catch (Exception e) {
                log.error("VNPay Return: Failed to process vnp_TxnRef={}", params.get("vnp_TxnRef"), e);
            }
        }

        Optional<VnPayCallbackService.PaymentSummary> payment =
                vnPayCallbackService.findPaymentSummary(params.get("vnp_TxnRef"));
        String orderCode = payment.map(VnPayCallbackService.PaymentSummary::orderCode).orElse("UNKNOWN");
        String paymentType = payment.map(summary -> summary.paymentType() != null ? summary.paymentType().name() : "").orElse("");
        boolean isPaid = VnPayUtil.isSuccessfulCallback(params);

        // Redirect to frontend result page with payment details for receipt
        StringBuilder redirectUrl = new StringBuilder(vnPayConfig.getFrontendUrl())
                .append("/thanh-toan/ket-qua?status=").append(isPaid ? "success" : "failed")
                .append("&orderCode=").append(orderCode)
                .append("&type=").append(paymentType);

        if (isPaid) {
            try {
                String amount = params.get("vnp_Amount");
                if (amount != null) {
                    long amountVnd = Long.parseLong(amount) / 100;
                    redirectUrl.append("&amount=").append(amountVnd);
                }
                if (params.get("vnp_TransactionNo") != null) redirectUrl.append("&txnNo=").append(params.get("vnp_TransactionNo"));
                if (params.get("vnp_PayDate") != null) redirectUrl.append("&payDate=").append(params.get("vnp_PayDate"));
                if (params.get("vnp_OrderInfo") != null) {
                    redirectUrl.append("&orderInfo=").append(java.net.URLEncoder.encode(params.get("vnp_OrderInfo"), java.nio.charset.StandardCharsets.UTF_8));
                }
            } catch (Exception e) {
                log.warn("Failed to append payment details to redirect URL", e);
            }
        }

        log.info("VNPay Return: Redirecting to {}", redirectUrl);
        return redirectTo(redirectUrl.toString());
    }

    private ResponseEntity<Void> redirectTo(String url) {
        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(url)).build();
    }
}
