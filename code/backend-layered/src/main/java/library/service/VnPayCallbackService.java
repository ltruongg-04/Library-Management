package library.service;

import library.entity.PaymentType;

import java.util.Map;
import java.util.Optional;

public interface VnPayCallbackService {

    enum Result {
        CONFIRMED,
        ALREADY_PROCESSED,
        PAYMENT_NOT_FOUND,
        AMOUNT_MISMATCH
    }

    record PaymentSummary(String orderCode, PaymentType paymentType) {
    }

    /**
     * Ghi nhận kết quả giao dịch và xử lý nghiệp vụ theo sau. Gọi lại nhiều lần vẫn chỉ xử lý một lần.
     * Tham số phải đã được xác thực chữ ký bằng VnPayService#validateCallback.
     * Nếu có exception thì toàn bộ được rollback để VNPay có thể gọi lại.
     */
    Result processCallback(Map<String, String> params);

    Optional<PaymentSummary> findPaymentSummary(String transactionCode);
}
