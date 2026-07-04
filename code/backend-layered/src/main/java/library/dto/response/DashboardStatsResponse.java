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
}

