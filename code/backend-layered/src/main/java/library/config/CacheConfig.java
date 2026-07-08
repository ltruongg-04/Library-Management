package library.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import library.common.constant.CacheNames;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCache;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;

import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Configuration
@EnableCaching
public class CacheConfig {

    private static final int DEFAULT_MAXIMUM_SIZE = 1_000;

    private static final Map<String, Duration> CACHE_TTLS = Map.ofEntries(
            Map.entry(CacheNames.BOOKS_LIST, Duration.ofSeconds(45)),
            Map.entry(CacheNames.BOOKS_DETAIL, Duration.ofSeconds(60)),
            Map.entry(CacheNames.BOOKS_TRENDING, Duration.ofMinutes(2)),
            Map.entry(CacheNames.BOOKS_TOP_RATED, Duration.ofMinutes(5)),
            Map.entry(CacheNames.CATEGORIES_ALL, Duration.ofMinutes(10)),
            Map.entry(CacheNames.CATEGORIES_WITH_BOOKS, Duration.ofMinutes(10)),
            Map.entry(CacheNames.AUTHORS_ALL, Duration.ofMinutes(10)),
            Map.entry(CacheNames.ADMIN_DASHBOARD, Duration.ofSeconds(30)),
            Map.entry(CacheNames.ADMIN_SETTINGS, Duration.ofMinutes(5)),
            Map.entry(CacheNames.ADMIN_ROLES, Duration.ofMinutes(5)),
            Map.entry(CacheNames.POLICIES_ACTIVE, Duration.ofMinutes(5))
    );

    @Bean
    @ConditionalOnProperty(name = "app.cache.provider", havingValue = "caffeine", matchIfMissing = true)
    public CacheManager caffeineCacheManager() {
        SimpleCacheManager cacheManager = new SimpleCacheManager();
        List<CaffeineCache> caches = CACHE_TTLS.entrySet().stream()
                .map(entry -> new CaffeineCache(entry.getKey(), Caffeine.newBuilder()
                        .maximumSize(DEFAULT_MAXIMUM_SIZE)
                        .expireAfterWrite(entry.getValue())
                        .build()))
                .collect(Collectors.toList());
        cacheManager.setCaches(caches);
        return cacheManager;
    }

    @Bean
    @ConditionalOnProperty(name = "app.cache.provider", havingValue = "redis")
    public CacheManager redisCacheManager(RedisConnectionFactory redisConnectionFactory) {
        RedisCacheConfiguration defaultConfiguration = RedisCacheConfiguration.defaultCacheConfig()
                .disableCachingNullValues()
                .entryTtl(Duration.ofMinutes(1));

        Map<String, RedisCacheConfiguration> cacheConfigurations = CACHE_TTLS.entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> defaultConfiguration.entryTtl(entry.getValue())
                ));

        return RedisCacheManager.builder(redisConnectionFactory)
                .cacheDefaults(defaultConfiguration)
                .withInitialCacheConfigurations(cacheConfigurations)
                .transactionAware()
                .build();
    }
}
