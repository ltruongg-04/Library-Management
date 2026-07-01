package library.service.impl;

import jakarta.servlet.http.HttpServletRequest;
import library.common.exception.CustomBusinessException;
import library.common.utils.VnPayUtil;
import library.dto.borrow.BorrowRequestDto;
import library.dto.borrow.BorrowResponseDto;
import library.entity.*;
import library.repository.*;
import library.service.BorrowOrderService;
import library.service.VnPayService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class BorrowOrderServiceImpl implements BorrowOrderService {

    private final BorrowOrderRepository borrowOrderRepository;
    private final BorrowOrderDetailRepository borrowOrderDetailRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final BookRepository bookRepository;
    private final BookCopyRepository bookCopyRepository;
    private final VnPayService vnPayService;

    @Override
    @Transactional
    public BorrowResponseDto createBorrowOrder(Integer userId, BorrowRequestDto request, HttpServletRequest httpRequest) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomBusinessException("User not found", HttpStatus.NOT_FOUND));

        // Get or create customer profile
        CustomerEntity customer = customerRepository.findByUserId(userId).orElseGet(() -> {
            CustomerEntity newCustomer = CustomerEntity.builder()
                    .user(user)
                    .fullName(user.getFullName() != null ? user.getFullName() : "Unknown")
                    .phone(user.getPhone() != null ? user.getPhone() : "0000000000")
                    .email(user.getEmail())
                    .address("Chưa cập nhật")
                    .build();
            return customerRepository.save(newCustomer);
        });

        BookEntity book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new CustomBusinessException("Book not found", HttpStatus.NOT_FOUND));

        // Validate dates
        LocalDate today = LocalDate.now();
        if (request.getPickupDate().isBefore(today)) {
            throw new CustomBusinessException("Pickup date cannot be in the past", HttpStatus.BAD_REQUEST);
        }
        if (request.getReturnDate().isBefore(request.getPickupDate())) {
            throw new CustomBusinessException("Return date must be after pickup date", HttpStatus.BAD_REQUEST);
        }

        // Validate book availability and get a copy
        BookCopyEntity availableCopy = bookCopyRepository.findFirstByBookIdAndStatus(book.getId(), BookCopyStatus.AVAILABLE);
        if (availableCopy == null) {
            throw new CustomBusinessException("No copies of this book are currently available", HttpStatus.BAD_REQUEST);
        }

        // Reserve the copy
        availableCopy.setStatus(BookCopyStatus.MAINTENANCE); // Temporarily put in maintenance to avoid other people picking it up. Actual borrow will be handled by librarian.
        bookCopyRepository.save(availableCopy);

        // Create BorrowOrder
        String orderCode = "BO-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        BigDecimal depositPrice = book.getDepositPrice() != null ? book.getDepositPrice() : BigDecimal.ZERO;
        
        BorrowOrderEntity borrowOrder = BorrowOrderEntity.builder()
                .orderCode(orderCode)
                .customer(customer)
                .borrowDate(today)
                .pickupDate(request.getPickupDate())
                .dueDate(request.getReturnDate())
                .status(BorrowOrderStatus.PENDING)
                .subtotalFee(BigDecimal.ZERO)
                .discountPercent(BigDecimal.ZERO)
                .discountAmount(BigDecimal.ZERO)
                .totalFee(BigDecimal.ZERO)
                .totalDeposit(depositPrice)
                .build();
        
        borrowOrder = borrowOrderRepository.save(borrowOrder);

        // Create BorrowOrderDetail
        BorrowOrderDetailEntity orderDetail = BorrowOrderDetailEntity.builder()
                .borrowOrder(borrowOrder)
                .bookCopy(availableCopy)
                .rentalFee(BigDecimal.ZERO)
                .depositPrice(depositPrice)
                .status(BorrowOrderDetailStatus.BORROWING)
                .build();
        
        borrowOrderDetailRepository.save(orderDetail);

        // Create Payment
        PaymentEntity payment = PaymentEntity.builder()
                .borrowOrder(borrowOrder)
                .paymentMethod(request.getPaymentMethod())
                .amount(depositPrice)
                .paymentType(PaymentType.DEPOSIT)
                .paymentStatus(PaymentStatus.PENDING)
                .paymentDate(LocalDateTime.now())
                .build();
        
        payment = paymentRepository.save(payment);

        // Build response
        BorrowResponseDto.BorrowResponseDtoBuilder responseBuilder = BorrowResponseDto.builder()
                .id(borrowOrder.getId())
                .orderCode(borrowOrder.getOrderCode())
                .pickupDate(borrowOrder.getPickupDate())
                .dueDate(borrowOrder.getDueDate())
                .status(borrowOrder.getStatus())
                .totalDeposit(borrowOrder.getTotalDeposit())
                .paymentMethod(payment.getPaymentMethod())
                .paymentStatus(payment.getPaymentStatus());

        // Generate VNPay payment URL if payment method is VNPAY
        if (request.getPaymentMethod() == PaymentMethod.VNPAY) {
            String ipAddress = VnPayUtil.getIpAddress(httpRequest);
            String paymentUrl = vnPayService.createPaymentUrl(
                    borrowOrder.getId(),
                    borrowOrder.getOrderCode(),
                    depositPrice,
                    ipAddress
            );
            responseBuilder.paymentUrl(paymentUrl);
            log.info("VNPay payment URL generated for orderCode={}", orderCode);
        }

        return responseBuilder.build();
    }
}
