package library.service.impl;

import library.dto.response.DashboardStatsResponse;
import library.entity.BorrowOrderEntity;
import library.entity.BorrowOrderDetailEntity;
import library.entity.BorrowOrderStatus;
import library.entity.BookCopyStatus;
import library.repository.BookCopyRepository;
import library.repository.BookRepository;
import library.repository.BorrowOrderRepository;
import library.repository.CustomerRepository;
import library.service.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
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
    public DashboardStatsResponse getDashboardStats() {
        LocalDate today = LocalDate.now();

        long booksBorrowedToday = borrowOrderRepository.countByBorrowDate(today);
        long pendingApprovals = borrowOrderRepository.countByStatus(BorrowOrderStatus.PENDING);
        long overdueBooks = borrowOrderRepository.countOverdueBooks(BorrowOrderStatus.BORROWED, today);
        long totalBooks = bookRepository.count();
        long totalAvailableBooks = bookCopyRepository.countByStatus(BookCopyStatus.AVAILABLE);
        long totalCustomers = customerRepository.count();
        long totalBorrowOrders = borrowOrderRepository.count();

        // Lấy 5 đơn mượn gần nhất
        List<BorrowOrderEntity> recentOrders = borrowOrderRepository.findTop5ByOrderByCreatedAtDesc();
        List<DashboardStatsResponse.RecentActivityDto> recentActivities = recentOrders.stream()
                .map(order -> {
                    String bookTitle = "";
                    if (!order.getOrderDetails().isEmpty()) {
                        BorrowOrderDetailEntity detail = order.getOrderDetails().get(0);
                        bookTitle = detail.getBookCopy().getBook().getTitle();
                    }
                    return DashboardStatsResponse.RecentActivityDto.builder()
                            .orderCode(order.getOrderCode())
                            .customerName(order.getCustomer().getFullName())
                            .bookTitle(bookTitle)
                            .status(order.getStatus().name())
                            .createdAt(order.getCreatedAt() != null
                                    ? order.getCreatedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))
                                    : "")
                            .build();
                })
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
                .build();
    }
}

