package library.common.utils;

import jakarta.servlet.http.HttpServletRequest;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.*;

/**
 * Utility class for VNPay payment gateway integration.
 * Provides HMAC-SHA512 signing, URL building, and IP extraction.
 */
public final class VnPayUtil {

    private static final String HMAC_SHA512 = "HmacSHA512";
    private static final int HEX_RADIX = 16;
    private static final int BYTE_MASK = 0xff;

    private VnPayUtil() {
        // Utility class — prevent instantiation
    }

    /**
     * Generates an HMAC-SHA512 hash of the given data using the provided key.
     *
     * @param key  the secret key
     * @param data the data to sign
     * @return hex-encoded hash string
     */
    public static String hmacSHA512(String key, String data) {
        try {
            if (key == null || data == null) {
                throw new IllegalArgumentException("Key and data must not be null");
            }

            Mac hmac512 = Mac.getInstance(HMAC_SHA512);
            byte[] hmacKeyBytes = key.getBytes(StandardCharsets.UTF_8);
            SecretKeySpec secretKeySpec = new SecretKeySpec(hmacKeyBytes, HMAC_SHA512);
            hmac512.init(secretKeySpec);
            byte[] dataBytes = data.getBytes(StandardCharsets.UTF_8);
            byte[] result = hmac512.doFinal(dataBytes);

            StringBuilder sb = new StringBuilder(result.length * 2);
            for (byte b : result) {
                sb.append(String.format("%02x", b & BYTE_MASK));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            throw new VnPayHashException("Failed to generate HMAC-SHA512 hash", e);
        }
    }

    /**
     * Builds the complete VNPay payment URL with sorted parameters and secure hash.
     *
     * @param params     the payment parameters (will be sorted alphabetically)
     * @param hashSecret the VNPay hash secret key
     * @return the full query string with vnp_SecureHash appended
     */
    public static String buildQueryString(Map<String, String> params, String hashSecret) {
        // Sort parameters alphabetically
        List<String> fieldNames = new ArrayList<>(params.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();

        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = params.get(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty()) {
                // Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));

                // Build query
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));

                if (itr.hasNext()) {
                    hashData.append('&');
                    query.append('&');
                }
            }
        }

        String vnpSecureHash = hmacSHA512(hashSecret, hashData.toString());
        query.append("&vnp_SecureHash=");
        query.append(vnpSecureHash);

        return query.toString();
    }

    /**
     * Extracts the client IP address from an HTTP request,
     * accounting for common proxy headers.
     *
     * @param request the HTTP request
     * @return the client IP address
     */
    public static String getIpAddress(HttpServletRequest request) {
        String ipAddress = request.getHeader("X-FORWARDED-FOR");
        if (ipAddress == null || ipAddress.isEmpty()) {
            ipAddress = request.getHeader("X-Real-IP");
        }
        if (ipAddress == null || ipAddress.isEmpty()) {
            ipAddress = request.getRemoteAddr();
        }
        // If multiple IPs (from proxy chain), take the first one
        if (ipAddress != null && ipAddress.contains(",")) {
            ipAddress = ipAddress.split(",")[0].trim();
        }
        return ipAddress;
    }

    /**
     * Custom runtime exception for VNPay hash generation failures.
     */
    public static class VnPayHashException extends RuntimeException {
        public VnPayHashException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}
