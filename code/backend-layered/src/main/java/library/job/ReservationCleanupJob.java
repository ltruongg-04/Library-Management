package library.job;

import library.entity.ReservationStatus;
import library.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class ReservationCleanupJob {

    private final ReservationRepository reservationRepository;

    /**
     * Chạy định kỳ vào 2:00 sáng mỗi ngày.
     * Xóa vĩnh viễn (Hard Delete) các yêu cầu giữ chỗ bị HỦY (CANCELLED) có tuổi thọ lớn hơn 1 tháng.
     */
    @Scheduled(cron = "0 0 2 * * ?")
    @Transactional
    public void cleanupCancelledReservations() {
        log.info("Starting scheduled cleanup of old CANCELLED reservations...");
        
        // Mốc thời gian 1 tháng trước
        LocalDateTime oneMonthAgo = LocalDateTime.now().minusMonths(1);
        
        // Gọi hàm xóa trong repository
        int deletedCount = reservationRepository.deleteByStatusAndReservationDateBefore(
                ReservationStatus.CANCELLED, 
                oneMonthAgo
        );
        
        log.info("Cleanup finished. Permanently deleted {} cancelled reservations older than 1 month.", deletedCount);
    }
}
