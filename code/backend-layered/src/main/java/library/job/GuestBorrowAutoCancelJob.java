package library.job;

import library.entity.BookCopyStatus;
import library.entity.BorrowOrderDetailEntity;
import library.entity.BorrowOrderDetailStatus;
import library.entity.BorrowOrderEntity;
import library.entity.BorrowOrderStatus;
import library.repository.BookCopyRepository;
import library.repository.BorrowOrderDetailRepository;
import library.repository.BorrowOrderRepository;
import library.service.CacheInvalidationService;
import library.service.EmailService;
import library.service.SystemLogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class GuestBorrowAutoCancelJob {

    private final BorrowOrderRepository borrowOrderRepository;
    private final BorrowOrderDetailRepository borrowOrderDetailRepository;
    private final BookCopyRepository bookCopyRepository;
    private final EmailService emailService;
    private final SystemLogService systemLogService;
    private final CacheInvalidationService cacheInvalidationService;

    @Scheduled(cron = "0 30 1 * * ?")
    @Transactional
    public void cancelExpiredGuestReadyOrders() {
        LocalDateTime cutoff = LocalDateTime.now().minusDays(3);
        List<BorrowOrderEntity> expiredOrders = borrowOrderRepository
                .findGuestOrdersByStatusAndUpdatedAtBefore(BorrowOrderStatus.READY, cutoff);

        for (BorrowOrderEntity order : expiredOrders) {
            order.setStatus(BorrowOrderStatus.CANCELLED);
            for (BorrowOrderDetailEntity detail : borrowOrderDetailRepository.findByBorrowOrderId(order.getId())) {
                detail.setStatus(BorrowOrderDetailStatus.CANCELLED);
                borrowOrderDetailRepository.save(detail);
                if (detail.getBookCopy() != null) {
                    detail.getBookCopy().setStatus(BookCopyStatus.AVAILABLE);
                    bookCopyRepository.save(detail.getBookCopy());
                }
            }

            borrowOrderRepository.save(order);
            sendAutoCancelEmail(order);
            systemLogService.logAction("Tự hủy phiếu mượn Guest", "Tự hủy phiếu quá hạn lấy sách: " + order.getOrderCode());
        }

        if (!expiredOrders.isEmpty()) {
            cacheInvalidationService.evictBookCaches();
            log.info("Auto-cancelled {} expired guest borrow orders.", expiredOrders.size());
        }
    }

    private void sendAutoCancelEmail(BorrowOrderEntity order) {
        if (order.getCustomer() == null || order.getCustomer().getEmail() == null) {
            return;
        }

        emailService.sendGuestBorrowStatusEmail(
                order.getCustomer().getEmail(),
                order.getCustomer().getFullName(),
                order.getOrderCode(),
                "CANCELLED",
                "Phiếu mượn đã được tự động hủy vì quá hạn lấy sách.");
    }
}
