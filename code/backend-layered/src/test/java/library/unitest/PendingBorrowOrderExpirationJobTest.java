package library.unitest;

import library.entity.BookCopyEntity;
import library.entity.BookCopyStatus;
import library.entity.BookEntity;
import library.entity.BorrowOrderDetailEntity;
import library.entity.BorrowOrderDetailStatus;
import library.entity.BorrowOrderEntity;
import library.entity.BorrowOrderStatus;
import library.entity.CustomerEntity;
import library.entity.PaymentEntity;
import library.entity.PaymentMethod;
import library.entity.PaymentStatus;
import library.entity.PaymentType;
import library.job.PendingBorrowOrderExpirationJob;
import library.repository.BookCopyRepository;
import library.repository.BookRepository;
import library.repository.BorrowOrderDetailRepository;
import library.repository.BorrowOrderRepository;
import library.repository.CustomerRepository;
import library.repository.PaymentRepository;
import library.service.CacheInvalidationService;
import library.service.EmailService;
import library.service.NotificationService;
import library.service.SystemLogService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

/**
 * Chạy trên H2 để kiểm tra đúng câu query, transaction và khóa dòng của job.
 */
@DataJpaTest(properties = {
        "spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect",
        "spring.jpa.hibernate.ddl-auto=create-drop"
})
@Import(PendingBorrowOrderExpirationJob.class)
@Transactional(propagation = Propagation.NOT_SUPPORTED)
class PendingBorrowOrderExpirationJobTest {

    private static final BigDecimal DEPOSIT = new BigDecimal("50000.00");
    private static final String GUEST_EMAIL = "guest@example.com";

    @Autowired
    private PendingBorrowOrderExpirationJob job;
    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private BorrowOrderRepository borrowOrderRepository;
    @Autowired
    private BorrowOrderDetailRepository borrowOrderDetailRepository;
    @Autowired
    private BookCopyRepository bookCopyRepository;
    @Autowired
    private BookRepository bookRepository;
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @MockitoBean
    private EmailService emailService;
    @MockitoBean
    private NotificationService notificationService;
    @MockitoBean
    private SystemLogService systemLogService;
    @MockitoBean
    private CacheInvalidationService cacheInvalidationService;

    @AfterEach
    void tearDown() {
        borrowOrderDetailRepository.deleteAll();
        bookCopyRepository.deleteAll();
        paymentRepository.deleteAll();
        borrowOrderRepository.deleteAll();
        customerRepository.deleteAll();
    }

    @Test
    void abandonedVnPayOrderReleasesCopy() {
        PaymentEntity payment = createOrder(PaymentMethod.VNPAY, BorrowOrderStatus.PENDING, PaymentStatus.PENDING);
        BookCopyEntity copy = createDetailWithCopy(payment.getBorrowOrder());
        age(payment, LocalDateTime.now().minusMinutes(31));

        job.cancelUnpaidVnPayOrders();

        assertThat(orderStatus(payment)).isEqualTo(BorrowOrderStatus.CANCELLED);
        assertThat(bookCopyRepository.findById(copy.getId()).orElseThrow().getStatus()).isEqualTo(BookCopyStatus.AVAILABLE);
        assertThat(borrowOrderDetailRepository.findByBorrowOrderId(payment.getBorrowOrder().getId()).get(0).getStatus())
                .isEqualTo(BorrowOrderDetailStatus.CANCELLED);
        verify(emailService).sendGuestBorrowStatusEmail(eq(GUEST_EMAIL), any(), eq(orderCode(payment)), eq("CANCELLED"), any());
        verify(cacheInvalidationService).evictBookCaches();
    }

    @Test
    void vnPayOrderStillInsidePaymentWindowIsKept() {
        PaymentEntity payment = createOrder(PaymentMethod.VNPAY, BorrowOrderStatus.PENDING, PaymentStatus.PENDING);
        age(payment, LocalDateTime.now().minusMinutes(10));

        job.cancelUnpaidVnPayOrders();

        assertThat(orderStatus(payment)).isEqualTo(BorrowOrderStatus.PENDING);
        verify(cacheInvalidationService, never()).evictBookCaches();
    }

    @Test
    void cancelledVnPayOrderKeepsPaymentPendingForLateIpn() {
        PaymentEntity payment = createOrder(PaymentMethod.VNPAY, BorrowOrderStatus.PENDING, PaymentStatus.PENDING);
        age(payment, LocalDateTime.now().minusHours(1));

        job.cancelUnpaidVnPayOrders();

        assertThat(paymentStatus(payment)).isEqualTo(PaymentStatus.PENDING);
    }

    @Test
    void approvedOrderIsNeverCancelled() {
        PaymentEntity payment = createOrder(PaymentMethod.VNPAY, BorrowOrderStatus.READY, PaymentStatus.PENDING);
        age(payment, LocalDateTime.now().minusDays(10));

        job.cancelUnpaidVnPayOrders();
        job.cancelUnapprovedOrders();

        assertThat(orderStatus(payment)).isEqualTo(BorrowOrderStatus.READY);
    }

    @Test
    void unapprovedCashOrderIsCancelledAfterHoldPeriod() {
        PaymentEntity payment = createOrder(PaymentMethod.CASH, BorrowOrderStatus.PENDING, PaymentStatus.PENDING);
        BookCopyEntity copy = createDetailWithCopy(payment.getBorrowOrder());
        age(payment, LocalDateTime.now().minusDays(4));

        job.cancelUnapprovedOrders();

        assertThat(orderStatus(payment)).isEqualTo(BorrowOrderStatus.CANCELLED);
        assertThat(paymentStatus(payment)).isEqualTo(PaymentStatus.FAILED);
        assertThat(bookCopyRepository.findById(copy.getId()).orElseThrow().getStatus()).isEqualTo(BookCopyStatus.AVAILABLE);
    }

    @Test
    void recentCashOrderIsKept() {
        PaymentEntity payment = createOrder(PaymentMethod.CASH, BorrowOrderStatus.PENDING, PaymentStatus.PENDING);
        age(payment, LocalDateTime.now().minusDays(1));

        job.cancelUnapprovedOrders();

        assertThat(orderStatus(payment)).isEqualTo(BorrowOrderStatus.PENDING);
    }

    @Test
    void orderWithCollectedMoneyIsNotCancelled() {
        PaymentEntity payment = createOrder(PaymentMethod.CASH, BorrowOrderStatus.PENDING, PaymentStatus.SUCCESS);
        age(payment, LocalDateTime.now().minusDays(4));

        job.cancelUnapprovedOrders();

        assertThat(orderStatus(payment)).isEqualTo(BorrowOrderStatus.PENDING);
    }

    private BorrowOrderStatus orderStatus(PaymentEntity payment) {
        return borrowOrderRepository.findById(payment.getBorrowOrder().getId()).orElseThrow().getStatus();
    }

    private PaymentStatus paymentStatus(PaymentEntity payment) {
        return paymentRepository.findById(payment.getId()).orElseThrow().getPaymentStatus();
    }

    private String orderCode(PaymentEntity payment) {
        return payment.getBorrowOrder().getOrderCode();
    }

    private void age(PaymentEntity payment, LocalDateTime createdAt) {
        jdbcTemplate.update("UPDATE payments SET created_at = ? WHERE id = ?", createdAt, payment.getId());
        jdbcTemplate.update("UPDATE borrow_orders SET created_at = ? WHERE id = ?", createdAt, payment.getBorrowOrder().getId());
    }

    private PaymentEntity createOrder(PaymentMethod method, BorrowOrderStatus orderStatus, PaymentStatus paymentStatus) {
        CustomerEntity customer = customerRepository.save(CustomerEntity.builder()
                .fullName("Guest")
                .phone("0912345678")
                .email(GUEST_EMAIL)
                .address("Hà Nội")
                .build());
        BorrowOrderEntity order = borrowOrderRepository.save(BorrowOrderEntity.builder()
                .orderCode("BO-" + UUID.randomUUID())
                .customer(customer)
                .status(orderStatus)
                .build());
        return paymentRepository.save(PaymentEntity.builder()
                .borrowOrder(order)
                .paymentMethod(method)
                .transactionCode(order.getOrderCode())
                .amount(DEPOSIT)
                .paymentType(PaymentType.DEPOSIT)
                .paymentStatus(paymentStatus)
                .build());
    }

    private BookCopyEntity createDetailWithCopy(BorrowOrderEntity order) {
        BookEntity book = bookRepository.save(BookEntity.builder().title("Sách " + UUID.randomUUID()).build());
        BookCopyEntity copy = bookCopyRepository.save(BookCopyEntity.builder()
                .book(book)
                .barcode(UUID.randomUUID().toString())
                .status(BookCopyStatus.MAINTENANCE)
                .build());
        borrowOrderDetailRepository.save(BorrowOrderDetailEntity.builder()
                .borrowOrder(order)
                .bookCopy(copy)
                .status(BorrowOrderDetailStatus.BORROWING)
                .build());
        return copy;
    }
}
