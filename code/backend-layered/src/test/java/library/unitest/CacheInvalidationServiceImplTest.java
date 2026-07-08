package library.unitest;

import library.common.constant.CacheNames;
import library.service.impl.CacheInvalidationServiceImpl;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class CacheInvalidationServiceImplTest {

    private final ConcurrentMapCacheManager cacheManager = new ConcurrentMapCacheManager(
            CacheNames.BOOKS_LIST,
            CacheNames.BOOKS_DETAIL,
            CacheNames.BOOKS_TRENDING,
            CacheNames.BOOKS_TOP_RATED,
            CacheNames.CATEGORIES_ALL,
            CacheNames.CATEGORIES_WITH_BOOKS,
            CacheNames.AUTHORS_ALL,
            CacheNames.ADMIN_DASHBOARD);

    private final CacheInvalidationServiceImpl service = new CacheInvalidationServiceImpl(cacheManager);

    @AfterEach
    void tearDown() {
        if (TransactionSynchronizationManager.isSynchronizationActive()) {
            TransactionSynchronizationManager.clearSynchronization();
        }
    }

    @Test
    void evictBookCachesClearsImmediatelyWhenNoTransactionIsActive() {
        put(CacheNames.BOOKS_LIST);
        put(CacheNames.BOOKS_DETAIL);
        put(CacheNames.ADMIN_DASHBOARD);

        service.evictBookCaches();

        assertThat(get(CacheNames.BOOKS_LIST)).isNull();
        assertThat(get(CacheNames.BOOKS_DETAIL)).isNull();
        assertThat(get(CacheNames.ADMIN_DASHBOARD)).isNull();
    }

    @Test
    void evictCatalogCachesWaitsUntilTransactionCommit() {
        put(CacheNames.BOOKS_LIST);
        put(CacheNames.CATEGORIES_ALL);
        put(CacheNames.AUTHORS_ALL);

        TransactionSynchronizationManager.initSynchronization();
        service.evictCatalogCaches();

        assertThat(get(CacheNames.BOOKS_LIST)).isEqualTo("cached");
        assertThat(get(CacheNames.CATEGORIES_ALL)).isEqualTo("cached");
        assertThat(get(CacheNames.AUTHORS_ALL)).isEqualTo("cached");

        List<TransactionSynchronization> synchronizations = TransactionSynchronizationManager.getSynchronizations();
        synchronizations.forEach(TransactionSynchronization::afterCommit);

        assertThat(get(CacheNames.BOOKS_LIST)).isNull();
        assertThat(get(CacheNames.CATEGORIES_ALL)).isNull();
        assertThat(get(CacheNames.AUTHORS_ALL)).isNull();
    }

    private void put(String cacheName) {
        cacheManager.getCache(cacheName).put("key", "cached");
    }

    private Object get(String cacheName) {
        return cacheManager.getCache(cacheName).get("key", String.class);
    }
}
