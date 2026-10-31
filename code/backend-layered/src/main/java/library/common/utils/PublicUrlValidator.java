package library.common.utils;

import library.common.exception.CustomBusinessException;
import org.springframework.http.HttpStatus;

import java.net.Inet6Address;
import java.net.InetAddress;
import java.net.URI;
import java.net.UnknownHostException;
import java.util.Set;

/**
 * Chặn SSRF: server chỉ được tự tải dữ liệu từ địa chỉ công khai trên Internet.
 */
public final class PublicUrlValidator {

    private static final Set<String> ALLOWED_SCHEMES = Set.of("http", "https");
    private static final Set<Integer> ALLOWED_PORTS = Set.of(-1, 80, 443);
    private static final String INVALID_URL_MESSAGE = "URL không hợp lệ hoặc không được phép truy cập";

    private PublicUrlValidator() {
        // Utility class — prevent instantiation
    }

    public static void validate(URI uri) {
        if (uri.getScheme() == null || !ALLOWED_SCHEMES.contains(uri.getScheme().toLowerCase())
                || uri.getHost() == null || !ALLOWED_PORTS.contains(uri.getPort())) {
            throw invalidUrl();
        }

        try {
            for (InetAddress address : InetAddress.getAllByName(uri.getHost())) {
                if (!isPublicAddress(address)) {
                    throw invalidUrl();
                }
            }
        } catch (UnknownHostException e) {
            throw invalidUrl();
        }
    }

    private static boolean isPublicAddress(InetAddress address) {
        if (address.isAnyLocalAddress() || address.isLoopbackAddress() || address.isLinkLocalAddress()
                || address.isSiteLocalAddress() || address.isMulticastAddress()) {
            return false;
        }

        byte[] bytes = address.getAddress();
        if (address instanceof Inet6Address) {
            // fc00::/7: unique local address
            return (bytes[0] & 0xfe) != 0xfc;
        }
        // 100.64.0.0/10: carrier-grade NAT, thường dùng cho mạng nội bộ của cloud
        return !((bytes[0] & 0xff) == 100 && (bytes[1] & 0xc0) == 64);
    }

    private static CustomBusinessException invalidUrl() {
        return new CustomBusinessException(INVALID_URL_MESSAGE, HttpStatus.BAD_REQUEST);
    }
}
