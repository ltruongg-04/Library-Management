package library.service.impl;

import library.dto.response.DashboardStatsResponse;
import library.common.constant.CacheNames;
import library.entity.BorrowOrderStatus;
import library.entity.BookCopyStatus;
import library.repository.BookCopyRepository;
import library.repository.BookRepository;
import library.repository.BorrowOrderRepository;
import library.repository.CustomerRepository;
import library.service.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminDashboardServiceImpl implements AdminDashboardService {

    private final BorrowOrderRepository borrowOrderRepository;
    private final BookRepository bookRepository;
    private final BookCopyRepository bookCopyRepository;
    private final CustomerRepository customerRepository;

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = CacheNames.ADMIN_DASHBOARD, key = "'stats'")
    public DashboardStatsResponse getDashboardStats() {
        LocalDate today = LocalDate.now();

        long booksBorrowedToday = borrowOrderRepository.countByBorrowDate(today);
        long pendingApprovals = borrowOrderRepository.countByStatus(BorrowOrderStatus.PENDING);
        long overdueBooks = borrowOrderRepository.countOverdueBooks(BorrowOrderStatus.BORROWED, today);
        long totalBooks = bookRepository.count();
        long totalAvailableBooks = bookCopyRepository.countByStatus(BookCopyStatus.AVAILABLE);
        long totalCustomers = customerRepository.count();
        long totalBorrowOrders = borrowOrderRepository.count();

        List<DashboardStatsResponse.RecentActivityDto> recentActivities = borrowOrderRepository.findRecentActivityStats(PageRequest.of(0, 5)).stream()
                .map(row -> DashboardStatsResponse.RecentActivityDto.builder()
                        .orderCode(toStringValue(row[0]))
                        .customerName(toStringValue(row[1]))
                        .bookTitle(toStringValue(row[2]))
                        .status(row[3] != null ? row[3].toString() : "")
                        .createdAt(formatDateTime(row[4]))
                        .build())
                .collect(Collectors.toList());

        List<DashboardStatsResponse.CategoryStatDto> categories = borrowOrderRepository.findTopCategoryBorrowStats(PageRequest.of(0, 5)).stream()
                .map(row -> DashboardStatsResponse.CategoryStatDto.builder()
                        .label((String) row[0])
                        .value(toLong(row[1]))
                        .build())
                .collect(Collectors.toList());

        List<DashboardStatsResponse.BorrowedBookDto> borrowedBooks = borrowOrderRepository.findTopBorrowedBookStats(PageRequest.of(0, 5)).stream()
                .map(row -> DashboardStatsResponse.BorrowedBookDto.builder()
                        .title((String) row[0])
                        .author((String) row[1])
                        .borrows(toLong(row[2]))
                        .status(toLong(row[3]) > 0 ? "Còn sách" : "Hết sách")
                        .build())
                .collect(Collectors.toList());

        List<DashboardStatsResponse.MonthlyTrendDto> monthlyTrends = borrowOrderRepository.findMonthlyBorrowTrends().stream()
                .map(row -> DashboardStatsResponse.MonthlyTrendDto.builder()
                        .month(String.format("%04d-%02d", toLong(row[0]), toLong(row[1])))
                        .borrowed(toLong(row[2]))
                        .returned(toLong(row[3]))
                        .overdue(toLong(row[4]))
                        .build())
                .collect(Collectors.toList());

        return DashboardStatsResponse.builder()
                .booksBorrowedToday(booksBorrowedToday)
                .pendingApprovals(pendingApprovals)
                .overdueBooks(overdueBooks)
                .totalBooks(totalBooks)
                .totalAvailableBooks(totalAvailableBooks)
                .totalCustomers(totalCustomers)
                .totalBorrowOrders(totalBorrowOrders)
                .recentActivities(recentActivities)
                .categories(categories)
                .borrowedBooks(borrowedBooks)
                .monthlyTrends(monthlyTrends)
                .build();
    }

    private long toLong(Object value) {
        if (value instanceof Number number) {
            return number.longValue();
        }
        return 0L;
    }

    private String toStringValue(Object value) {
        return value != null ? value.toString() : "";
    }

    private String formatDateTime(Object value) {
        if (value instanceof LocalDateTime dateTime) {
            return dateTime.format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));
        }
        return "";
    }
}

