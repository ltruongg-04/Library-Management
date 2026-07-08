package library.service.impl;

import library.dto.admin.AdminSettingsResponse;
import library.entity.BorrowingPolicyEntity;
import library.entity.SystemSettingEntity;
import library.repository.BorrowingPolicyRepository;
import library.repository.SystemSettingRepository;
import library.service.AdminSettingsService;
import library.config.VnPayConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminSettingsServiceImpl implements AdminSettingsService {

    private static final String AI_SEARCH = "features.aiSearch";
    private static final String ONLINE_PAYMENTS = "features.onlinePayments";
    private static final String AUTO_BACKUP = "features.autoBackup";
    private static final String LANGUAGE = "localization.language";
    private static final String TIMEZONE = "localization.timezone";
    private static final String VNPAY_TMNCODE = "payment.vnpayTmnCode";
    private static final String VNPAY_HASHSECRET = "payment.vnpayHashSecret";
    private static final String VNPAY_ACTIVE = "payment.vnpayActive";
    private final BorrowingPolicyRepository borrowingPolicyRepository;
    private final SystemSettingRepository systemSettingRepository;
    private final VnPayConfig vnPayConfig;

    @Override
    @Transactional(readOnly = true)
    public AdminSettingsResponse getSettings() {
        BorrowingPolicyEntity policy = getActivePolicy();
        Map<String, String> settings = systemSettingRepository.findAll().stream()
                .collect(Collectors.toMap(SystemSettingEntity::getSettingKey, SystemSettingEntity::getSettingValue));

        return AdminSettingsResponse.builder()
                .borrowing(AdminSettingsResponse.Borrowing.builder()
                        .maxDays(String.valueOf(defaultNumber(policy.getMaxBorrowDays(), 14)))
                        .finePerDay(toPlainString(defaultDecimal(policy.getOverdueFinePerDay(), "10000")))
                        .maxBooks(String.valueOf(defaultNumber(policy.getMaxBooks(), 5)))
                        .depositPercentage("10")
                        .maxRenewals(String.valueOf(defaultNumber(policy.getMaxExtensions(), 2)))
                        .build())
                .features(AdminSettingsResponse.Features.builder()
                        .aiSearch(parseBoolean(settings.get(AI_SEARCH), true))
                        .onlinePayments(parseBoolean(settings.get(ONLINE_PAYMENTS), true))
                        .autoBackup(parseBoolean(settings.get(AUTO_BACKUP), true))
                        .build())
                .localization(AdminSettingsResponse.Localization.builder()
                        .language(settings.getOrDefault(LANGUAGE, "vi"))
                        .timezone(settings.getOrDefault(TIMEZONE, "utc-plus-7"))
                        .build())
                .payment(AdminSettingsResponse.Payment.builder()
                        .vnpayTmnCode(settings.getOrDefault(VNPAY_TMNCODE, vnPayConfig.getTmnCode() != null ? vnPayConfig.getTmnCode() : ""))
                        .vnpayHashSecret(settings.getOrDefault(VNPAY_HASHSECRET, vnPayConfig.getHashSecret() != null ? vnPayConfig.getHashSecret() : ""))
                        .vnpayActive(parseBoolean(settings.get(VNPAY_ACTIVE), false))
                        .build())
                .build();
    }

    @Override
    @Transactional
    public AdminSettingsResponse updateSettings(AdminSettingsResponse request) {
        if (request == null) {
            return getSettings();
        }

        BorrowingPolicyEntity policy = getActivePolicy();
        AdminSettingsResponse.Borrowing borrowing = request.getBorrowing();
        if (borrowing != null) {
            policy.setMaxBorrowDays(parseInteger(borrowing.getMaxDays(), policy.getMaxBorrowDays()));
            policy.setOverdueFinePerDay(parseBigDecimal(borrowing.getFinePerDay(), policy.getOverdueFinePerDay()));
            policy.setMaxBooks(parseInteger(borrowing.getMaxBooks(), policy.getMaxBooks()));
            policy.setMaxExtensions(parseInteger(borrowing.getMaxRenewals(), policy.getMaxExtensions()));
            if (policy.getDamageFeePercent() == null) {
                policy.setDamageFeePercent(new BigDecimal("0.5"));
            }
            if (policy.getLostBookMultiplier() == null) {
                policy.setLostBookMultiplier(new BigDecimal("2.0"));
            }
            if (policy.getRentalFeePerDay() == null) {
                policy.setRentalFeePerDay(new BigDecimal("5000"));
            }
            borrowingPolicyRepository.save(policy);
        }

        AdminSettingsResponse.Features features = request.getFeatures();
        if (features != null) {
            saveSetting(AI_SEARCH, String.valueOf(features.isAiSearch()));
            saveSetting(ONLINE_PAYMENTS, String.valueOf(features.isOnlinePayments()));
            saveSetting(AUTO_BACKUP, String.valueOf(features.isAutoBackup()));
        }

        AdminSettingsResponse.Localization localization = request.getLocalization();
        if (localization != null) {
            saveSetting(LANGUAGE, defaultText(localization.getLanguage(), "vi"));
            saveSetting(TIMEZONE, defaultText(localization.getTimezone(), "utc-plus-7"));
        }

        AdminSettingsResponse.Payment payment = request.getPayment();
        if (payment != null) {
            saveSetting(VNPAY_TMNCODE, defaultText(payment.getVnpayTmnCode(), ""));
            saveSetting(VNPAY_HASHSECRET, defaultText(payment.getVnpayHashSecret(), ""));
            saveSetting(VNPAY_ACTIVE, String.valueOf(payment.isVnpayActive()));
        }

        return getSettings();
    }

    private BorrowingPolicyEntity getActivePolicy() {
        return borrowingPolicyRepository.findAll().stream().findFirst()
                .orElseGet(() -> borrowingPolicyRepository.save(BorrowingPolicyEntity.builder()
                        .maxBooks(5)
                        .maxBorrowDays(14)
                        .overdueFinePerDay(new BigDecimal("10000"))
                        .rentalFeePerDay(new BigDecimal("5000"))
                        .damageFeePercent(new BigDecimal("0.5"))
                        .lostBookMultiplier(new BigDecimal("2.0"))
                        .maxExtensions(2)
                        .build()));
    }

    private void saveSetting(String key, String value) {
        SystemSettingEntity setting = systemSettingRepository.findById(key)
                .orElseGet(() -> SystemSettingEntity.builder().settingKey(key).build());
        setting.setSettingValue(value);
        systemSettingRepository.save(setting);
    }

    private boolean parseBoolean(String value, boolean fallback) {
        return value == null ? fallback : Boolean.parseBoolean(value);
    }

    private Integer parseInteger(String value, Integer fallback) {
        try {
            return value == null ? fallback : Integer.parseInt(value);
        } catch (NumberFormatException error) {
            return fallback;
        }
    }

    private BigDecimal parseBigDecimal(String value, BigDecimal fallback) {
        try {
            return value == null ? fallback : new BigDecimal(value);
        } catch (NumberFormatException error) {
            return fallback;
        }
    }

    private int defaultNumber(Integer value, int fallback) {
        return value == null ? fallback : value;
    }

    private BigDecimal defaultDecimal(BigDecimal value, String fallback) {
        return value == null ? new BigDecimal(fallback) : value;
    }

    private String toPlainString(BigDecimal value) {
        return value.stripTrailingZeros().toPlainString();
    }

    private String defaultText(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }
}
