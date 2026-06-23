package library.service.impl;

import library.dto.response.DashboardStatsResponse;
import library.entity.BorrowRecordEntity;
import library.repository.BorrowRecordRepository;
import library.service.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class AdminDashboardServiceImpl implements AdminDashboardService {

    private final BorrowRecordRepository borrowRecordRepository;

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        LocalDate today = LocalDate.now();

        long booksBorrowedToday = borrowRecordRepository.countByBorrowDate(today);
        long pendingApprovals = borrowRecordRepository.countByStatus(BorrowRecordEntity.Status.PENDING);
        long overdueBooks = borrowRecordRepository.countOverdueBooks(BorrowRecordEntity.Status.BORROWED, today);

        return DashboardStatsResponse.builder()
                .booksBorrowedToday(booksBorrowedToday)
                .pendingApprovals(pendingApprovals)
                .overdueBooks(overdueBooks)
                .build();
    }
}
