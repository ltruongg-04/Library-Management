package library.service.impl;

import jakarta.servlet.http.HttpServletRequest;
import library.common.exception.CustomBusinessException;
import library.common.utils.VnPayUtil;
import library.dto.borrow.BorrowRequestDto;
import library.dto.borrow.BorrowResponseDto;
import library.dto.borrow.UserBorrowDetailDto;
import library.dto.borrow.UserBorrowHistoryDto;
import library.entity.*;
import library.repository.*;
import library.service.BorrowOrderService;
import library.service.VnPayService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.stream.Collectors;

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

    @Override
    @Transactional(readOnly = true)
    public Page<UserBorrowHistoryDto> getUserBorrowHistory(Integer customerId, Pageable pageable) {
        Page<BorrowOrderEntity> orders = borrowOrderRepository
                .findByCustomerIdOrderByCreatedAtDesc(customerId, pageable);

        return orders.map(this::toHistoryDto);
    }

    @Override
    @Transactional(readOnly = true)
    public UserBorrowDetailDto getUserBorrowDetail(Integer customerId, String orderCode) {
        BorrowOrderEntity order = borrowOrderRepository.findByOrderCodeAndCustomerId(orderCode, customerId)
                .orElseThrow(() -> new CustomBusinessException("Borrow order not found", HttpStatus.NOT_FOUND));

        BorrowOrderDetailEntity detail = order.getOrderDetails().isEmpty()
                ? null : order.getOrderDetails().get(0);

        UserBorrowDetailDto.UserBorrowDetailDtoBuilder builder = UserBorrowDetailDto.builder()
                .id(order.getId())
                .orderCode(order.getOrderCode())
                .status(resolveOrderStatus(order))
                .borrowDate(order.getBorrowDate())
                .pickupDate(order.getPickupDate())
                .dueDate(order.getDueDate())
                .totalDeposit(order.getTotalDeposit())
                .totalFee(order.getTotalFee());

        if (detail != null) {
            BookCopyEntity bookCopy = detail.getBookCopy();
            BookEntity book = bookCopy.getBook();
            String authorNames = book.getAuthors().stream()
                    .map(a -> a.getName())
                    .collect(Collectors.joining(", "));

            builder.bookTitle(book.getTitle())
                    .bookAuthor(authorNames.isEmpty() ? book.getAuthor() : authorNames)
                    .bookCoverImage(book.getImageUrl())
                    .bookDetailStatus(detail.getStatus().name());
        }

        // Tính phí trễ hạn nếu quá hạn
        if (order.getDueDate() != null && LocalDate.now().isAfter(order.getDueDate())
                && !"RETURNED".equals(order.getStatus().name()) && !"CANCELLED".equals(order.getStatus().name())) {
            long overdueDays = java.time.temporal.ChronoUnit.DAYS.between(order.getDueDate(), LocalDate.now());
            BigDecimal lateFee = BigDecimal.valueOf(overdueDays * 5000);
            builder.lateFee(lateFee);
        } else {
            builder.lateFee(BigDecimal.ZERO);
        }

        return builder.build();
    }

    private UserBorrowHistoryDto toHistoryDto(BorrowOrderEntity order) {
        UserBorrowHistoryDto.UserBorrowHistoryDtoBuilder builder = UserBorrowHistoryDto.builder()
                .id(order.getId())
                .orderCode(order.getOrderCode())
                .status(resolveOrderStatus(order))
                .borrowDate(order.getBorrowDate())
                .pickupDate(order.getPickupDate())
                .dueDate(order.getDueDate())
                .totalDeposit(order.getTotalDeposit());

        // Lấy thông tin cuốn sách từ order detail đầu tiên (vì mỗi đơn chỉ có 1 cuốn)
        if (!order.getOrderDetails().isEmpty()) {
            BorrowOrderDetailEntity detail = order.getOrderDetails().get(0);
            BookCopyEntity bookCopy = detail.getBookCopy();
            BookEntity book = bookCopy.getBook();
            String authorNames = book.getAuthors().stream()
                    .map(a -> a.getName())
                    .collect(Collectors.joining(", "));

            builder.bookTitle(book.getTitle())
                    .bookAuthor(authorNames.isEmpty() ? book.getAuthor() : authorNames)
                    .bookCoverImage(book.getImageUrl());
        }

        return builder.build();
    }

    private String resolveOrderStatus(BorrowOrderEntity order) {
        // Tự động xác định OVERDUE dựa trên ngày hết hạn
        if (order.getStatus() == BorrowOrderStatus.BORROWED
                && order.getDueDate() != null
                && LocalDate.now().isAfter(order.getDueDate())) {
            return "OVERDUE";
        }
        return order.getStatus().name();
    }
}

