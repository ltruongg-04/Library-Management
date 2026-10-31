package library.unitest;

import library.service.impl.RateLimitServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.StringRedisTemplate;

import java.time.Duration;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Kiểm tra script Lua trên Redis thật. Chỉ chạy khi đặt REDIS_TEST_PORT:
 * docker run --rm -d -p 16379:6379 redis:7-alpine
 * REDIS_TEST_PORT=16379 mvn test -Dtest=RateLimitServiceRedisTest
 */
@EnabledIfEnvironmentVariable(named = "REDIS_TEST_PORT", matches = "\\d+")
class RateLimitServiceRedisTest {

    @Test
    void countsWithinWindowAndResetsAfterExpiry() throws Exception {
        int port = Integer.parseInt(System.getenv("REDIS_TEST_PORT"));
        LettuceConnectionFactory connectionFactory =
                new LettuceConnectionFactory(new RedisStandaloneConfiguration("localhost", port));
        connectionFactory.afterPropertiesSet();
        try {
            StringRedisTemplate redisTemplate = new StringRedisTemplate(connectionFactory);
            RateLimitServiceImpl rateLimitService = new RateLimitServiceImpl(redisTemplate);
            String key = "test:" + UUID.randomUUID();
            Duration window = Duration.ofMillis(500);

            assertThat(rateLimitService.tryAcquire(key, 2, window)).isTrue();
            assertThat(rateLimitService.tryAcquire(key, 2, window)).isTrue();
            assertThat(rateLimitService.tryAcquire(key, 2, window)).isFalse();
            assertThat(redisTemplate.getExpire(key)).isNotEqualTo(-1L);

            Thread.sleep(700);
            assertThat(rateLimitService.tryAcquire(key, 2, window)).isTrue();
        } finally {
            connectionFactory.destroy();
        }
    }
}
