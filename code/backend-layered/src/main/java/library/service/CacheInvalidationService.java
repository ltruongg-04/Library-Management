package library.service;

public interface CacheInvalidationService {

    void evictBookCaches();

    void evictBookDetailCaches();

    void evictCatalogCaches();

    void evictDashboardCaches();

    void evictSettingsCaches();

    void evictRoleCaches();

    void evictPolicyCaches();
}
