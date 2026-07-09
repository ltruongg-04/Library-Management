package library.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminSettingsResponse {
    private Borrowing borrowing;
    private Features features;
    private Localization localization;
    private Payment payment;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Borrowing {
        private String maxDays;
        private String rentalFeePerDay;
        private String finePerDay;
        private String maxBooks;
        private String depositPercentage;
        private String maxRenewals;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Features {
        private boolean aiSearch;
        private boolean onlinePayments;
        private boolean autoBackup;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Localization {
        private String language;
        private String timezone;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Payment {
        private String vnpayTmnCode;
        private String vnpayHashSecret;
        private boolean vnpayActive;
    }
}
