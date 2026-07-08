package library.job;

import library.entity.BookVisitEntity;
import library.repository.BookVisitRepository;
import library.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class BookVisitReminderScheduler {

    private final BookVisitRepository bookVisitRepository;
    private final EmailService emailService;

    // Run every day at 8:00 AM
    @Scheduled(cron = "0 0 8 * * *")
    public void sendReminders() {
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        List<BookVisitEntity> upcomingVisits = bookVisitRepository.findByVisitDateAndStatusAndIsRemindedFalse(tomorrow, "PENDING");

        log.info("Found {} book visits for tomorrow needing reminders.", upcomingVisits.size());

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        String formattedDate = tomorrow.format(formatter);

        for (BookVisitEntity visit : upcomingVisits) {
            try {
                emailService.sendBookVisitReminderEmail(
                        visit.getEmail(),
                        visit.getFullName(),
                        visit.getBook().getTitle(),
                        formattedDate,
                        visit.getVisitTime()
                );
                
                visit.setIsReminded(true);
                bookVisitRepository.save(visit);
                log.info("Sent reminder to {}", visit.getEmail());
            } catch (Exception e) {
                log.error("Failed to send reminder for book visit ID {}: {}", visit.getId(), e.getMessage());
            }
        }
    }
}
