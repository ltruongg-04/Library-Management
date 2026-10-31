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
import library.repository.BookCopyRepository;
import library.repository.BookRepository;
import library.repository.BorrowOrderDetailRepository;
import library.repository.BorrowOrderRepository;
import library.repository.CustomerRepository;
import library.repository.PaymentRepository;
import library.service.AdminBorrowService;
import library.service.BookReturnService;
import library.service.CacheInvalidationService;
import library.service.EmailService;
import library.service.SystemLogService;
import library.service.VnPayCallbackService;
import library.service.VnPayCallbackService.Result;
import library.service.impl.VnPayCallbackServiceImpl;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.Callable;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

/**
 * Chạy trên H2 trong bộ nhớ vì điểm cần kiểm tra là commit, rollback và khóa dòng.
 */
@DataJpaTest(properties = {
        "spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect",
        "spring.jpa.hibernate.ddl-auto=create-drop"
})
@Import(VnPayCallbackServiceImpl.class)
@Transactional(propagation = Propagation.NOT_SUPPORTED)
class VnPayCallbackServiceTest {

    private static final BigDecimal AMOUNT = new BigDecimal("50000.00");
    private static final String VNP_AMOUNT = "5000000";
    private static final String CUSTOMER_EMAIL = "reader@example.com";
    private static final int FINE_ID = 9;

    @Autowired
    private VnPayCallbackService service;
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

    @MockitoBean
    private AdminBorrowService adminBorrowService;
    @MockitoBean
    private BookReturnService bookReturnService;
    @MockitoBean
    private SystemLogService systemLogService;
    @MockitoBean
    private EmailService emailService;
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
    void paidDepositApprovesOrderAndSendsReceipt() {
        PaymentEntity payment = createPayment(PaymentType.DEPOSIT, BorrowOrderStatus.PENDING);

        assertThat(service.processCallback(paidParams(payment))).isEqualTo(Result.CONFIRMED);

        assertThat(reloadStatus(payment)).isEqualTo(PaymentStatus.SUCCESS);
        verify(adminBorrowService).approveBorrow(orderCode(payment));
        verify(emailService).sendPaymentSuccessEmail(eq(CUSTOMER_EMAIL), any(), eq(orderCode(payment)), eq("50000"), any(), any());
    }

    @Test
    void repeatedCallbackIsProcessedOnlyOnce() {
        PaymentEntity payment = createPayment(PaymentType.DEPOSIT, BorrowOrderStatus.PENDING);

        service.processCallback(paidParams(payment));
        assertThat(service.processCallback(paidParams(payment))).isEqualTo(Result.ALREADY_PROCESSED);

        verify(adminBorrowService, times(1)).approveBorrow(anyString());
        verify(emailService, times(1)).sendPaymentSuccessEmail(any(), any(), any(), any(), any(), any());
    }

    @Test
    void concurrentCallbacksAreProcessedOnlyOnce() throws Exception {
        PaymentEntity payment = createPayment(PaymentType.DEPOSIT, BorrowOrderStatus.PENDING);
        doAnswer(call -> {
            Thread.sleep(300); // Giữ transaction đủ lâu để callback còn lại đọc trúng lúc đang xử lý
            return null;
        }).when(adminBorrowService).approveBorrow(anyString());

        CountDownLatch start = new CountDownLatch(1);
        Callable<Result> callback = () -> {
            start.await();
            return service.processCallback(paidParams(payment));
        };
        ExecutorService executor = Executors.newFixedThreadPool(2);
        try {
            var first = executor.submit(callback);
            var second = executor.submit(callback);
            start.countDown();

            assertThat(List.of(first.get(10, TimeUnit.SECONDS), second.get(10, TimeUnit.SECONDS)))
                    .containsExactlyInAnyOrder(Result.CONFIRMED, Result.ALREADY_PROCESSED);
        } finally {
            executor.shutdownNow();
        }
        verify(adminBorrowService, times(1)).approveBorrow(anyString());
    }

    @Test
    void failureDuringProcessingRollsBackSoVnPayCanRetry() {
        PaymentEntity payment = createPayment(PaymentType.DEPOSIT, BorrowOrderStatus.PENDING);
        doThrow(new IllegalStateException("lỗi tạm thời")).when(adminBorrowService).approveBorrow(anyString());

        assertThatThrownBy(() -> service.processCallback(paidParams(payment))).isInstanceOf(IllegalStateException.class);

        assertThat(reloadStatus(payment)).isEqualTo(PaymentStatus.PENDING);
        verify(emailService, never()).sendPaymentSuccessEmail(any(), any(), any(), any(), any(), any());

        doNothing().when(adminBorrowService).approveBorrow(anyString());
        assertThat(service.processCallback(paidParams(payment))).isEqualTo(Result.CONFIRMED);
        assertThat(reloadStatus(payment)).isEqualTo(PaymentStatus.SUCCESS);
    }

    @Test
    void amountMismatchChangesNothing() {
        PaymentEntity payment = createPayment(PaymentType.DEPOSIT, BorrowOrderStatus.PENDING);

        Result result = service.processCallback(Map.of("vnp_TxnRef", payment.getTransactionCode(),
                "vnp_ResponseCode", "00", "vnp_Amount", "100"));

        assertThat(result).isEqualTo(Result.AMOUNT_MISMATCH);
        assertThat(reloadStatus(payment)).isEqualTo(PaymentStatus.PENDING);
        verify(adminBorrowService, never()).approveBorrow(anyString());
    }

    @Test
    void unknownTransactionIsReported() {
        assertThat(service.processCallback(Map.of("vnp_TxnRef", "NOPE", "vnp_ResponseCode", "00", "vnp_Amount", VNP_AMOUNT)))
                .isEqualTo(Result.PAYMENT_NOT_FOUND);
    }

    @Test
    void cashPaymentCannotBeSettledByCallback() {
        PaymentEntity payment = createPayment(PaymentType.DEPOSIT, BorrowOrderStatus.PENDING);
        payment.setPaymentMethod(PaymentMethod.CASH);
        paymentRepository.save(payment);

        assertThat(service.processCallback(paidParams(payment))).isEqualTo(Result.PAYMENT_NOT_FOUND);
        assertThat(reloadStatus(payment)).isEqualTo(PaymentStatus.PENDING);
    }

    @Test
    void paidDepositOnCancelledOrderIsKeptForReconciliation() {
        PaymentEntity payment = createPayment(PaymentType.DEPOSIT, BorrowOrderStatus.CANCELLED);

        assertThat(service.processCallback(paidParams(payment))).isEqualTo(Result.CONFIRMED);

        assertThat(reloadStatus(payment)).isEqualTo(PaymentStatus.SUCCESS);
        verify(adminBorrowService, never()).approveBorrow(anyString());
        verify(systemLogService).logAction(any(), any(), any(), eq("FAILED"));
    }

    @Test
    void paidFineCompletesReturn() {
        PaymentEntity payment = createPayment(PaymentType.FINE, BorrowOrderStatus.BORROWED);
        payment.setFineId(FINE_ID);
        paymentRepository.save(payment);

        service.processCallback(paidParams(payment));

        verify(bookReturnService).completeVnPayFinePayment(FINE_ID);
    }

    @Test
    void failedPaymentCancelsOrderAndReleasesCopy() {
        PaymentEntity payment = createPayment(PaymentType.DEPOSIT, BorrowOrderStatus.PENDING);
        BookCopyEntity copy = createDetailWithCopy(payment.getBorrowOrder());

        Result result = service.processCallback(Map.of("vnp_TxnRef", payment.getTransactionCode(),
                "vnp_ResponseCode", "24", "vnp_Amount", VNP_AMOUNT));

        assertThat(result).isEqualTo(Result.CONFIRMED);
        assertThat(reloadStatus(payment)).isEqualTo(PaymentStatus.FAILED);
        assertThat(borrowOrderRepository.findById(payment.getBorrowOrder().getId()).orElseThrow().getStatus())
                .isEqualTo(BorrowOrderStatus.CANCELLED);
        assertThat(bookCopyRepository.findById(copy.getId()).orElseThrow().getStatus()).isEqualTo(BookCopyStatus.AVAILABLE);
    }

    @Test
    void successResponseWithFailedTransactionStatusIsNotTreatedAsPaid() {
        PaymentEntity payment = createPayment(PaymentType.DEPOSIT, BorrowOrderStatus.PENDING);

        service.processCallback(Map.of("vnp_TxnRef", payment.getTransactionCode(), "vnp_ResponseCode", "00",
                "vnp_TransactionStatus", "02", "vnp_Amount", VNP_AMOUNT));

        assertThat(reloadStatus(payment)).isEqualTo(PaymentStatus.FAILED);
        verify(adminBorrowService, never()).approveBorrow(anyString());
    }

    @Test
    void lateSuccessAfterFailureIsFlaggedForReconciliation() {
        PaymentEntity payment = createPayment(PaymentType.DEPOSIT, BorrowOrderStatus.PENDING);
        service.processCallback(Map.of("vnp_TxnRef", payment.getTransactionCode(), "vnp_ResponseCode", "24", "vnp_Amount", VNP_AMOUNT));

        assertThat(service.processCallback(paidParams(payment))).isEqualTo(Result.ALREADY_PROCESSED);

        assertThat(reloadStatus(payment)).isEqualTo(PaymentStatus.FAILED);
        verify(systemLogService, times(2)).logAction(any(), any(), any(), eq("FAILED"));
    }

    private Map<String, String> paidParams(PaymentEntity payment) {
        return Map.of("vnp_TxnRef", payment.getTransactionCode(), "vnp_ResponseCode", "00",
                "vnp_TransactionStatus", "00", "vnp_Amount", VNP_AMOUNT, "vnp_TransactionNo", "123", "vnp_PayDate", "20261030120000");
    }

    private PaymentStatus reloadStatus(PaymentEntity payment) {
        return paymentRepository.findById(payment.getId()).orElseThrow().getPaymentStatus();
    }

    private String orderCode(PaymentEntity payment) {
        return payment.getBorrowOrder().getOrderCode();
    }

    private PaymentEntity createPayment(PaymentType type, BorrowOrderStatus orderStatus) {
        CustomerEntity customer = customerRepository.save(CustomerEntity.builder()
                .fullName("Reader")
                .phone("0912345678")
                .email(CUSTOMER_EMAIL)
                .address("Hà Nội")
                .build());
        BorrowOrderEntity order = borrowOrderRepository.save(BorrowOrderEntity.builder()
                .orderCode("BO-" + UUID.randomUUID())
                .customer(customer)
                .status(orderStatus)
                .build());
        return paymentRepository.save(PaymentEntity.builder()
                .borrowOrder(order)
                .paymentMethod(PaymentMethod.VNPAY)
                .transactionCode(order.getOrderCode())
                .amount(AMOUNT)
                .paymentType(type)
                .paymentStatus(PaymentStatus.PENDING)
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
