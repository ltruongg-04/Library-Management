package library.service;

import java.math.BigDecimal;
import java.util.Map;

/**
 * Service interface for VNPay payment gateway operations.
 */
public interface VnPayService {

    /**
     * Creates a VNPay payment URL for the given borrow order.
     *
     * @param borrowOrderId the borrow order ID
     * @param orderCode     the borrow order code (used as vnp_TxnRef)
     * @param amount        the payment amount (deposit)
     * @param ipAddress     the client IP address
     * @return the complete VNPay payment URL for browser redirect
     */
    String createPaymentUrl(Integer borrowOrderId, String orderCode, BigDecimal amount, String ipAddress);

    /**
     * Validates the VNPay callback parameters by verifying the HMAC-SHA512 secure hash.
     *
     * @param params the callback query parameters from VNPay
     * @return true if the hash is valid, false otherwise
     */
    boolean validateCallback(Map<String, String> params);
}
