package library.job;

import library.entity.BorrowOrderEntity;
import library.entity.BorrowOrderStatus;
import library.repository.BorrowOrderRepository;
import library.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class EmailNotificationJob {

    private final BorrowOrderRepository borrowOrderRepository;
    private final EmailService emailService;

    /**
     * Chạy định kỳ vào 8:00 sáng mỗi ngày.
     * Quét các đơn mượn bị quá hạn và gửi email nhắc nhở.
     */
    @Scheduled(cron = "0 0 8 * * ?")
    @Transactional(readOnly = true)
    public void sendOverdueReminders() {
        log.info("Starting scheduled job: Overdue Email Reminders...");
        
        LocalDate today = LocalDate.now();
        List<BorrowOrderEntity> overdueOrders = borrowOrderRepository.findByStatusAndDueDateBefore(BorrowOrderStatus.BORROWED, today);

        int count = 0;
        for (BorrowOrderEntity order : overdueOrders) {
            String toEmail = null;
            String fullName = null;
            
            // Ưu tiên email của user account, nếu không có thì lấy email của profile customer
            if (order.getCustomer() != null) {
                fullName = order.getCustomer().getFullName();
                if (order.getCustomer().getUser() != null && order.getCustomer().getUser().getEmail() != null) {
                    toEmail = order.getCustomer().getUser().getEmail();
                } else {
                    toEmail = order.getCustomer().getEmail();
                }
            }
            
            if (toEmail != null && !toEmail.isEmpty()) {
                List<String> bookTitles = order.getOrderDetails().stream()
                        .map(detail -> detail.getBookCopy().getBook().getTitle())
                        .collect(Collectors.toList());
                        
                // Hardcode phí phạt hoặc lấy từ BorrowingPolicy, ở đây giả sử 5,000đ/ngày
                String finePerDay = "5,000"; 
                
                emailService.sendOverdueReminderEmail(
                        toEmail, 
                        fullName, 
                        order.getOrderCode(), 
                        bookTitles, 
                        order.getDueDate(), 
                        finePerDay
                );
                count++;
            }
        }
        
        log.info("Finished overdue reminders job. Sent {} emails.", count);
    }
}
