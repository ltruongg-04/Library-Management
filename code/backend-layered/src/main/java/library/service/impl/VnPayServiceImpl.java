package library.service.impl;

import library.common.utils.VnPayUtil;
import library.config.VnPayConfig;
import library.service.VnPayService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * Implementation of VNPay payment service.
 * Handles payment URL creation and callback validation.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class VnPayServiceImpl implements VnPayService {

    private static final int VND_MULTIPLIER = 100;
    private static final int PAYMENT_TIMEOUT_MINUTES = 15;
    private static final String DATE_FORMAT = "yyyyMMddHHmmss";


    private final VnPayConfig vnPayConfig;

    @Override
    public String createPaymentUrl(String txnRef, String orderInfo, BigDecimal amount, String ipAddress) {
        log.info("Creating VNPay payment URL for txnRef={}, amount={}", txnRef, amount);

        // VNPay requires amount in VND * 100 (no decimals)
        long vnpAmount = amount.longValue() * VND_MULTIPLIER;

        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(DATE_FORMAT);
        String createDate = now.format(formatter);
        String expireDate = now.plusMinutes(PAYMENT_TIMEOUT_MINUTES).format(formatter);

        // Build VNPay parameters
        Map<String, String> vnpParams = new HashMap<>();
        vnpParams.put("vnp_Version", vnPayConfig.getVersion());
        vnpParams.put("vnp_Command", vnPayConfig.getCommand());
        vnpParams.put("vnp_TmnCode", vnPayConfig.getTmnCode());
        vnpParams.put("vnp_Amount", String.valueOf(vnpAmount));
        vnpParams.put("vnp_CurrCode", "VND");
        vnpParams.put("vnp_TxnRef", txnRef);
        vnpParams.put("vnp_OrderInfo", orderInfo);
        vnpParams.put("vnp_OrderType", vnPayConfig.getOrderType());
        vnpParams.put("vnp_Locale", "vn");
        vnpParams.put("vnp_ReturnUrl", vnPayConfig.getReturnUrl());
        vnpParams.put("vnp_IpAddr", ipAddress);
        vnpParams.put("vnp_CreateDate", createDate);
        vnpParams.put("vnp_ExpireDate", expireDate);

        // Build the full payment URL
        String queryString = VnPayUtil.buildQueryString(vnpParams, vnPayConfig.getHashSecret());
        String paymentUrl = vnPayConfig.getPayUrl() + "?" + queryString;

        log.info("VNPay payment URL created successfully for txnRef={}", txnRef);
        return paymentUrl;
    }

    @Override
    public boolean validateCallback(Map<String, String> params) {
        log.info("Validating VNPay callback with vnp_TxnRef={}", params.get("vnp_TxnRef"));

        String vnpSecureHash = params.get("vnp_SecureHash");
        if (vnpSecureHash == null || vnpSecureHash.isEmpty()) {
            log.warn("VNPay callback missing vnp_SecureHash");
            return false;
        }

        // Remove hash-related fields before re-computing
        Map<String, String> filteredParams = new HashMap<>(params);
        filteredParams.remove("vnp_SecureHash");
        filteredParams.remove("vnp_SecureHashType");

        // Sort and build hash data string
        List<String> fieldNames = new ArrayList<>(filteredParams.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = filteredParams.get(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty()) {
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                if (itr.hasNext()) {
                    hashData.append('&');
                }
            }
        }

        String computedHash = VnPayUtil.hmacSHA512(vnPayConfig.getHashSecret(), hashData.toString());
        boolean isValid = computedHash.equalsIgnoreCase(vnpSecureHash);

        if (!isValid) {
            log.warn("VNPay callback hash validation failed for vnp_TxnRef={}", params.get("vnp_TxnRef"));
        } else {
            log.info("VNPay callback hash validation passed for vnp_TxnRef={}", params.get("vnp_TxnRef"));
        }

        return isValid;
    }
}
