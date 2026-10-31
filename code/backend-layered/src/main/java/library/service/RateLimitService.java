package library.service;

import java.time.Duration;

public interface RateLimitService {
    /**
     * Ghi nhận một lượt theo key trong cửa sổ thời gian cố định.
     *
     * @return false nếu đã vượt quá giới hạn
     */
    boolean tryAcquire(String key, int limit, Duration window);
}
