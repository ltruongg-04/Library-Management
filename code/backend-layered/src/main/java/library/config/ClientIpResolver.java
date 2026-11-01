package library.config;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Xác định IP thật của client phía sau reverse proxy.
 *
 * Client tự đặt được phần đầu của X-Forwarded-For, còn mỗi proxy tin cậy nối IP nó nhìn thấy vào cuối danh sách,
 * nên chỉ đếm từ cuối theo số proxy đã cấu hình mới không giả mạo được.
 */
@Component
public class ClientIpResolver {

    private final int trustedProxyHops;

    public ClientIpResolver(@Value("${app.security.trusted-proxy-hops:0}") int trustedProxyHops) {
        this.trustedProxyHops = trustedProxyHops;
    }

    public String resolve(HttpServletRequest request) {
        String forwardedFor = request.getHeader("X-Forwarded-For");
        if (trustedProxyHops <= 0 || forwardedFor == null) {
            return request.getRemoteAddr();
        }

        String[] addresses = forwardedFor.split(",");
        if (addresses.length == 0 || addresses[0].isBlank()) {
            return request.getRemoteAddr();
        }
        return addresses[Math.max(0, addresses.length - trustedProxyHops)].trim();
    }
}
