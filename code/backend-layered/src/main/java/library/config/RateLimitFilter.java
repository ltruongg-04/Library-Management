package library.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import library.common.utils.VnPayUtil;
import library.service.RateLimitService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;

/**
 * Giới hạn số request theo IP cho các API công khai dễ bị lạm dụng.
 *
 * IP lấy từ X-Forwarded-For nên client có thể giả mạo; đây chỉ là lớp giảm tải. Giới hạn theo email ở
 * OtpServiceImpl và khóa tài khoản ở LoginAttemptServiceImpl mới là lớp bảo vệ chính.
 *
 * Không áp dụng cho /api/auth/login vì NextAuth gọi API này từ server, mọi người dùng sẽ chung một IP.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class RateLimitFilter extends OncePerRequestFilter {

    private static final Duration WINDOW = Duration.ofMinutes(1);
    private static final int MAX_IP_KEY_LENGTH = 64;

    private static final Map<String, Integer> LIMITS_PER_MINUTE = Map.ofEntries(
            Map.entry("/api/auth/register", 10),
            Map.entry("/api/auth/activate", 10),
            Map.entry("/api/auth/resend-activation", 5),
            Map.entry("/api/auth/forgot-password", 5),
            Map.entry("/api/auth/verify-otp", 20),
            Map.entry("/api/auth/reset-password", 10),
            Map.entry("/api/public/borrow/otp/request", 5),
            Map.entry("/api/public/borrow/guest", 10),
            Map.entry("/api/public/borrow/lookup", 20),
            Map.entry("/api/public/borrow/lookup-by-phone", 20),
            Map.entry("/api/public/support-requests", 5),
            Map.entry("/api/public/book-visits/confirm", 10));

    private final RateLimitService rateLimitService;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {
        String path = request.getRequestURI();
        Integer limit = LIMITS_PER_MINUTE.get(path);

        if (limit != null && !HttpMethod.OPTIONS.matches(request.getMethod()) && !isAllowed(path, request, limit)) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setHeader("Retry-After", String.valueOf(WINDOW.toSeconds()));
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write(String.format("{\"success\":false,\"message\":\"%s\",\"data\":null}",
                    library.common.constant.ErrorMessages.TOO_MANY_REQUESTS));
            return;
        }

        filterChain.doFilter(request, response);
    }

    private boolean isAllowed(String path, HttpServletRequest request, int limit) {
        String clientIp = VnPayUtil.getIpAddress(request);
        if (clientIp.length() > MAX_IP_KEY_LENGTH) {
            clientIp = clientIp.substring(0, MAX_IP_KEY_LENGTH);
        }
        try {
            return rateLimitService.tryAcquire("ratelimit:ip:" + path + ":" + clientIp, limit, WINDOW);
        } catch (RuntimeException e) {
            // Redis lỗi thì không chặn người dùng hợp lệ ở lớp phụ này
            log.warn("Không kiểm tra được giới hạn request: {}", e.getMessage());
            return true;
        }
    }
}
