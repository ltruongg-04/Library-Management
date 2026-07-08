package library.service.impl;

import library.common.constant.CacheNames;
import library.service.CacheInvalidationService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class CacheInvalidationServiceImpl implements CacheInvalidationService {

    private final CacheManager cacheManager;

    @Override
    public void evictBookCaches() {
        evictAfterCommit(Set.of(
                CacheNames.BOOKS_LIST,
                CacheNames.BOOKS_DETAIL,
                CacheNames.BOOKS_TRENDING,
                CacheNames.BOOKS_TOP_RATED,
                CacheNames.ADMIN_DASHBOARD
        ));
    }

    @Override
    public void evictBookDetailCaches() {
        evictAfterCommit(Set.of(
                CacheNames.BOOKS_LIST,
                CacheNames.BOOKS_DETAIL,
                CacheNames.BOOKS_TOP_RATED
        ));
    }

    @Override
    public void evictCatalogCaches() {
        evictAfterCommit(Set.of(
                CacheNames.BOOKS_LIST,
                CacheNames.BOOKS_DETAIL,
                CacheNames.BOOKS_TRENDING,
                CacheNames.BOOKS_TOP_RATED,
                CacheNames.CATEGORIES_ALL,
                CacheNames.CATEGORIES_WITH_BOOKS,
                CacheNames.AUTHORS_ALL,
                CacheNames.ADMIN_DASHBOARD
        ));
    }

    @Override
    public void evictDashboardCaches() {
        evictAfterCommit(Set.of(CacheNames.ADMIN_DASHBOARD));
    }

    @Override
    public void evictSettingsCaches() {
        evictAfterCommit(Set.of(CacheNames.ADMIN_SETTINGS, CacheNames.POLICIES_ACTIVE));
    }

    @Override
    public void evictRoleCaches() {
        evictAfterCommit(Set.of(CacheNames.ADMIN_ROLES));
    }

    @Override
    public void evictPolicyCaches() {
        evictAfterCommit(Set.of(CacheNames.POLICIES_ACTIVE, CacheNames.ADMIN_SETTINGS));
    }

    private void evictAfterCommit(Set<String> cacheNames) {
        if (TransactionSynchronizationManager.isSynchronizationActive()) {
            TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
                @Override
                public void afterCommit() {
                    evictNow(cacheNames);
                }
            });
            return;
        }

        evictNow(cacheNames);
    }

    private void evictNow(Set<String> cacheNames) {
        for (String cacheName : cacheNames) {
            Cache cache = cacheManager.getCache(cacheName);
            if (cache != null) {
                cache.clear();
            }
        }
    }
}
