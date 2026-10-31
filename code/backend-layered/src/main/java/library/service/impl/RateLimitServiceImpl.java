package library.service.impl;

import library.service.RateLimitService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RateLimitServiceImpl implements RateLimitService {

    // Chạy INCR và đặt TTL trong cùng một script để key không bị tồn tại vĩnh viễn nếu tiến trình chết giữa chừng
    private static final DefaultRedisScript<Long> INCREMENT_SCRIPT = new DefaultRedisScript<>(
            "local count = redis.call('INCR', KEYS[1]) "
                    + "if count == 1 then redis.call('PEXPIRE', KEYS[1], ARGV[1]) end "
                    + "return count",
            Long.class);

    private final StringRedisTemplate redisTemplate;

    @Override
    public boolean tryAcquire(String key, int limit, Duration window) {
        Long count = redisTemplate.execute(INCREMENT_SCRIPT, List.of(key), String.valueOf(window.toMillis()));
        return count != null && count <= limit;
    }
}
