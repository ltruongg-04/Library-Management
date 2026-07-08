package library.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {
    private long booksBorrowedToday;
    private long pendingApprovals;
    private long overdueBooks;
    private long totalBooks;
    private long totalAvailableBooks;
    private long totalCustomers;
    private long totalBorrowOrders;
    private List<RecentActivityDto> recentActivities;
    private List<CategoryStatDto> categories;
    private List<BorrowedBookDto> borrowedBooks;
    private List<MonthlyTrendDto> monthlyTrends;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentActivityDto {
        private String orderCode;
        private String customerName;
        private String bookTitle;
        private String status;
        private String createdAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryStatDto {
        private String label;
        private long value;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BorrowedBookDto {
        private String title;
        private String author;
        private long borrows;
        private String status;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthlyTrendDto {
        private String month;
        private long borrowed;
        private long returned;
        private long overdue;
    }
}
