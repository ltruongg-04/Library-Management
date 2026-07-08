package library.job;

import library.entity.BookCopyEntity;
import library.entity.BookCopyStatus;
import library.entity.ReservationEntity;
import library.entity.ReservationStatus;
import library.repository.BookCopyRepository;
import library.repository.ReservationRepository;
import library.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class ReservationExpirationJob {

    private final ReservationRepository reservationRepository;
    private final BookCopyRepository bookCopyRepository;
    private final EmailService emailService;

    /**
     * Chạy định kỳ vào 1:00 sáng mỗi ngày.
     * Tìm các Reservation có trạng thái NOTIFIED quá 3 ngày và hủy chúng.
     * Sau đó phân bổ cuốn sách RESERVED cho người tiếp theo (nếu có) hoặc chuyển thành AVAILABLE.
     */
    @Scheduled(cron = "0 0 1 * * ?")
    @Transactional
    public void expireNotifiedReservations() {
        log.info("Starting scheduled job to expire NOTIFIED reservations older than 3 days...");

        LocalDateTime threeDaysAgo = LocalDateTime.now().minusDays(3);

        List<ReservationEntity> expiredReservations = reservationRepository.findByStatusAndNotifiedAtBefore(
                ReservationStatus.NOTIFIED,
                threeDaysAgo
        );

        for (ReservationEntity expiredRes : expiredReservations) {
            expiredRes.setStatus(ReservationStatus.CANCELLED);
            reservationRepository.save(expiredRes);
            log.info("Expired reservation for user {} on book '{}'", 
                    expiredRes.getCustomer().getFullName(), 
                    expiredRes.getBook().getTitle());

            // Tìm cuốn sách RESERVED tương ứng với book này
            BookCopyEntity reservedCopy = bookCopyRepository.findFirstByBookIdAndStatus(
                    expiredRes.getBook().getId(), BookCopyStatus.RESERVED);

            if (reservedCopy != null) {
                // Kiểm tra xem có ai khác đang đợi cuốn này không
                Optional<ReservationEntity> nextReservationOpt = reservationRepository.findFirstByBookIdAndStatusOrderByReservationDateAsc(
                        expiredRes.getBook().getId(), ReservationStatus.PENDING);

                if (nextReservationOpt.isPresent()) {
                    ReservationEntity nextRes = nextReservationOpt.get();
                    nextRes.setStatus(ReservationStatus.NOTIFIED);
                    nextRes.setNotifiedAt(LocalDateTime.now());
                    reservationRepository.save(nextRes);
                    log.info("Reassigned book '{}' to next user {}", 
                            nextRes.getBook().getTitle(), 
                            nextRes.getCustomer().getFullName());
                            
                    // Send email to next person
                    String toEmail = nextRes.getCustomer().getEmail() != null ? nextRes.getCustomer().getEmail() : 
                                    (nextRes.getCustomer().getUser() != null ? nextRes.getCustomer().getUser().getEmail() : null);
                    if (toEmail != null && !toEmail.isEmpty()) {
                        LocalDate holdUntil = LocalDate.now().plusDays(3);
                        emailService.sendReservationAvailableEmail(toEmail, nextRes.getCustomer().getFullName(), nextRes.getBook().getTitle(), holdUntil);
                    }
                } else {
                    // Không có ai đợi, chuyển sách thành AVAILABLE
                    reservedCopy.setStatus(BookCopyStatus.AVAILABLE);
                    bookCopyRepository.save(reservedCopy);
                    log.info("Book '{}' is now AVAILABLE since no one else is waiting.", reservedCopy.getBook().getTitle());
                }
            }
        }

        log.info("Finished expiring {} NOTIFIED reservations.", expiredReservations.size());
    }
}
