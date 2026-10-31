package library.unitest;

import library.common.exception.CustomBusinessException;
import library.dto.borrow.GuestBorrowRequestDto;
import library.entity.BookCopyEntity;
import library.entity.BookCopyStatus;
import library.entity.BookEntity;
import library.entity.CustomerEntity;
import library.entity.PaymentEntity;
import library.entity.PaymentMethod;
import library.entity.UserEntity;
import library.repository.BookCopyRepository;
import library.repository.BookRepository;
import library.repository.BorrowOrderDetailRepository;
import library.repository.BorrowOrderRepository;
import library.repository.CustomerRepository;
import library.service.CacheInvalidationService;
import library.service.EmailService;
import library.service.FeeCalculatorService;
import library.service.SystemLogService;
import library.service.impl.BorrowOrderCommandServiceImpl;
import library.service.impl.helper.BorrowOrderPaymentHelper;
import library.service.impl.helper.BorrowOrderValidationHelper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class GuestBorrowCustomerProtectionTest {

    private static final String PHONE = "0912345678";
    private static final String OWNER_EMAIL = "owner@example.com";
    private static final String ATTACKER_EMAIL = "attacker@example.com";
    private static final int BOOK_ID = 1;

    @Mock
    private CustomerRepository customerRepository;
    @Mock
    private BookRepository bookRepository;
    @Mock
    private BookCopyRepository bookCopyRepository;
    @Mock
    private BorrowOrderRepository borrowOrderRepository;
    @Mock
    private BorrowOrderDetailRepository borrowOrderDetailRepository;
    @Mock
    private FeeCalculatorService feeCalculatorService;
    @Mock
    private BorrowOrderValidationHelper validationHelper;
    @Mock
    private BorrowOrderPaymentHelper paymentHelper;
    @Mock
    private SystemLogService systemLogService;
    @Mock
    private CacheInvalidationService cacheInvalidationService;
    @Mock
    private EmailService emailService;

    @InjectMocks
    private BorrowOrderCommandServiceImpl service;

    @Test
    void phoneOfRegisteredAccountCannotBeUsedForGuestBorrow() {
        CustomerEntity registered = CustomerEntity.builder().user(UserEntity.builder().build())
                .phone(PHONE).email(OWNER_EMAIL).fullName("Owner").build();
        when(customerRepository.findByPhone(PHONE)).thenReturn(Optional.of(registered));

        assertThatThrownBy(() -> service.createGuestBorrowOrder(attackerRequest(), null))
                .isInstanceOfSatisfying(CustomBusinessException.class,
                        e -> assertThat(e.getHttpStatus()).isEqualTo(HttpStatus.CONFLICT));

        assertThat(registered.getEmail()).isEqualTo(OWNER_EMAIL);
        verify(customerRepository, never()).save(any());
    }

    @Test
    void existingGuestProfileIsNotOverwrittenByUnverifiedRequest() {
        CustomerEntity existingGuest = CustomerEntity.builder()
                .phone(PHONE).email(OWNER_EMAIL).fullName("Owner").build();
        when(customerRepository.findByPhone(PHONE)).thenReturn(Optional.of(existingGuest));
        stubOrderCreation();

        service.createGuestBorrowOrder(attackerRequest(), null);

        assertThat(existingGuest.getEmail()).isEqualTo(OWNER_EMAIL);
        assertThat(existingGuest.getFullName()).isEqualTo("Owner");
        verify(customerRepository, never()).save(any());
        verify(emailService).sendGuestBorrowConfirmationEmail(eq(OWNER_EMAIL), eq("Owner"),
                any(), any(), any(), any(), any(), any(), any());
    }

    @Test
    void newGuestProfileIsCreatedFromRequest() {
        when(customerRepository.findByPhone(PHONE)).thenReturn(Optional.empty());
        when(customerRepository.save(any())).thenAnswer(call -> call.getArgument(0));
        stubOrderCreation();

        service.createGuestBorrowOrder(attackerRequest(), null);

        verify(emailService).sendGuestBorrowConfirmationEmail(eq(ATTACKER_EMAIL), eq("Attacker"),
                any(), any(), any(), any(), any(), any(), any());
    }

    private GuestBorrowRequestDto attackerRequest() {
        return GuestBorrowRequestDto.builder()
                .fullName("Attacker")
                .phone(PHONE)
                .email(ATTACKER_EMAIL)
                .bookId(BOOK_ID)
                .pickupDate(LocalDate.now())
                .returnDate(LocalDate.now().plusDays(3))
                .paymentMethod(PaymentMethod.CASH)
                .build();
    }

    private void stubOrderCreation() {
        BookEntity book = BookEntity.builder().depositPrice(BigDecimal.TEN).build();
        book.setId(BOOK_ID);
        when(bookRepository.findById(BOOK_ID)).thenReturn(Optional.of(book));
        when(feeCalculatorService.calculateRentalFee(any(), any(), eq(1))).thenReturn(BigDecimal.ONE);
        BookCopyEntity copy = BookCopyEntity.builder().book(book).status(BookCopyStatus.AVAILABLE).build();
        when(bookCopyRepository.findFirstByBookIdAndStatus(BOOK_ID, BookCopyStatus.AVAILABLE)).thenReturn(copy);
        when(bookCopyRepository.save(any())).thenAnswer(call -> call.getArgument(0));
        when(borrowOrderRepository.save(any())).thenAnswer(call -> call.getArgument(0));
        when(paymentHelper.createDepositPayment(any(), any(), any())).thenReturn(PaymentEntity.builder().build());
    }
}
