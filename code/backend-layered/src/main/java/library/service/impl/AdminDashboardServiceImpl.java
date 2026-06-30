package library.service.impl;

import library.dto.response.DashboardStatsResponse;
import library.entity.BorrowOrderStatus;
import library.repository.BorrowOrderRepository;
import library.service.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class AdminDashboardServiceImpl implements AdminDashboardService {

    private final BorrowOrderRepository borrowOrderRepository;

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        LocalDate today = LocalDate.now();

        long booksBorrowedToday = borrowOrderRepository.countByBorrowDate(today);
        long pendingApprovals = borrowOrderRepository.countByStatus(BorrowOrderStatus.PENDING);
        long overdueBooks = borrowOrderRepository.countOverdueBooks(BorrowOrderStatus.BORROWED, today);

        return DashboardStatsResponse.builder()
                .booksBorrowedToday(booksBorrowedToday)
                .pendingApprovals(pendingApprovals)
                .overdueBooks(overdueBooks)
                .build();
    }
}
