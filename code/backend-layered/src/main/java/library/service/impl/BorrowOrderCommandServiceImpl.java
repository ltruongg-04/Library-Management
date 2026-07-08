package library.service.impl;

import jakarta.servlet.http.HttpServletRequest;
import library.common.exception.CustomBusinessException;
import library.common.utils.VnPayUtil;
import library.dto.borrow.BorrowRequestDto;
import library.dto.borrow.BorrowResponseDto;

import library.entity.*;
import library.repository.*;

import library.service.SystemLogService;
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
public class BorrowOrderCommandServiceImpl implements library.service.BorrowOrderCommandService {

    private final BorrowOrderRepository borrowOrderRepository;
    private final BorrowOrderDetailRepository borrowOrderDetailRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final BookRepository bookRepository;
    private final BookCopyRepository bookCopyRepository;
    private final VnPayService vnPayService;
    private final library.repository.BorrowExtensionRepository borrowExtensionRepository;
    private final library.repository.ReservationRepository reservationRepository;

    private final SystemLogService systemLogService;
    private final library.service.CacheInvalidationService cacheInvalidationService;
    private final library.service.EmailService emailService;
    private final library.service.FeeCalculatorService feeCalculatorService;


    // Helpers
    private final library.service.impl.helper.BorrowOrderValidationHelper validationHelper;
    private final library.service.impl.helper.BorrowOrderPaymentHelper paymentHelper;

    @org.springframework.context.annotation.Lazy
    @org.springframework.beans.factory.annotation.Autowired
    private library.service.AdminBorrowService adminBorrowService;

    @Override
    @Transactional
    public BorrowResponseDto createBorrowOrder(Integer userId, BorrowRequestDto request,
            HttpServletRequest httpRequest) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomBusinessException("User not found", HttpStatus.NOT_FOUND));

        // 1. Get or create customer profile
        CustomerEntity customer = getOrCreateCustomer(user);

        BookEntity book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new CustomBusinessException("Book not found", HttpStatus.NOT_FOUND));

        // 2. Validate dates and calculate fee
        validationHelper.validateBorrowDatesAndGetDays(request.getPickupDate(), request.getReturnDate());
        BigDecimal rentalFee = feeCalculatorService.calculateRentalFee(request.getPickupDate(), request.getReturnDate(), 1);

        // 3. Validate book availability and reserve a copy
        BookCopyEntity availableCopy = reserveBookCopy(book.getId(), customer);

        // 4. Create Order and generate Response
        BorrowResponseDto response = processBorrowOrderCreation(
                customer, book, availableCopy, request.getPickupDate(), request.getReturnDate(), 
                rentalFee, request.getPaymentMethod(), httpRequest
        );

        systemLogService.logAction(user, "Mượn sách", "Người dùng " + user.getEmail() + " đã mượn sách: " + book.getTitle() + " (Mã đơn: " + response.getOrderCode() + ")");
        cacheInvalidationService.evictBookCaches();

        return response;
    }




    @Override
    @Transactional
    public BorrowResponseDto renewBorrowOrder(String orderCode, Integer userId,
            library.dto.borrow.BorrowExtensionRequestDto request, HttpServletRequest httpRequest) {
        BorrowOrderEntity order = borrowOrderRepository.findByOrderCodeAndCustomerUserId(orderCode, userId)
                .orElseThrow(() -> new CustomBusinessException("Borrow order not found", HttpStatus.NOT_FOUND));

        validationHelper.validateRenewalConditions(order);
        int maxBorrowDays = feeCalculatorService.getActivePolicy().getMaxBorrowDays() != null
                ? feeCalculatorService.getActivePolicy().getMaxBorrowDays()
                : 14;
        if (request.getDurationInDays() > maxBorrowDays) {
            throw new CustomBusinessException("Thời gian gia hạn không được vượt quá " + maxBorrowDays + " ngày", HttpStatus.BAD_REQUEST);
        }

        // Determine base date for extension and calculate overdue penalty
        LocalDate baseDate = order.getDueDate();
        long overdueDaysForPenalty = 0;
        if (order.getStatus() == BorrowOrderStatus.OVERDUE || baseDate == null || baseDate.isBefore(LocalDate.now())) {
            if (baseDate != null) {
                overdueDaysForPenalty = java.time.temporal.ChronoUnit.DAYS.between(baseDate, LocalDate.now());
            }
            baseDate = LocalDate.now();
        }

        // Create extension
        createBorrowExtension(order, baseDate.plusDays(request.getDurationInDays()));

        BigDecimal overdueFee = overdueDaysForPenalty > 0 ? feeCalculatorService.calculateOverdueFee(order.getDueDate(), LocalDate.now()) : BigDecimal.ZERO;
        
        BigDecimal totalPaidOnline = paymentRepository.findByBorrowOrderIdAndPaymentStatus(order.getId(), PaymentStatus.SUCCESS)
                .stream()
                .filter(p -> p.getPaymentType() == PaymentType.RENTAL_FEE || p.getPaymentType() == PaymentType.FINE)
                .map(PaymentEntity::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal currentDebt = (order.getTotalFee() != null ? order.getTotalFee() : BigDecimal.ZERO).add(overdueFee);
        BigDecimal amountToPayOnline = currentDebt.subtract(totalPaidOnline).max(BigDecimal.ZERO);

        String paymentUrl = null;

        if (amountToPayOnline.compareTo(BigDecimal.ZERO) > 0) {
            paymentUrl = paymentHelper.handleRenewalPayment(order, amountToPayOnline, overdueFee, httpRequest);
        } else {
            adminBorrowService.processRenewal(order.getOrderCode(), new library.dto.admin.AdminRenewalRequestDto(true));
        }

        systemLogService.logAction("Yêu cầu gia hạn", "Người dùng yêu cầu gia hạn đơn mượn: " + order.getOrderCode() + " thêm " + request.getDurationInDays() + " ngày.");
        cacheInvalidationService.evictDashboardCaches();

        return BorrowResponseDto.builder()
                .orderCode(order.getOrderCode())
                .paymentUrl(paymentUrl)
                .build();
    }





    @Override
    @Transactional
    public BorrowResponseDto createGuestBorrowOrder(library.dto.borrow.GuestBorrowRequestDto request,
            HttpServletRequest httpRequest) {
        // Get or create customer profile
        CustomerEntity customer = customerRepository.findByPhone(request.getPhone()).orElseGet(() -> {
            return CustomerEntity.builder()
                    .user(null)
                    .fullName(request.getFullName() != null && !request.getFullName().trim().isEmpty() ? request.getFullName() : "Khách vãng lai")
                    .phone(request.getPhone())
                    .email(request.getEmail())
                    .address("Chưa cập nhật")
                    .build();
        });

        // Update customer details if provided
        if (request.getFullName() != null && !request.getFullName().trim().isEmpty()) {
            customer.setFullName(request.getFullName());
        }
        if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
            customer.setEmail(request.getEmail());
        }
        customer = customerRepository.save(customer);

        BookEntity book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new CustomBusinessException("Book not found", HttpStatus.NOT_FOUND));

        // Validate dates
        validationHelper.validateBorrowDatesAndGetDays(request.getPickupDate(), request.getReturnDate());
        BigDecimal rentalFee = feeCalculatorService.calculateRentalFee(request.getPickupDate(), request.getReturnDate(), 1);

        // Validate book availability and get a copy
        BookCopyEntity availableCopy = reserveBookCopy(book.getId(), customer);

        // Create Order and generate Response
        BorrowResponseDto response = processBorrowOrderCreation(
                customer, book, availableCopy, request.getPickupDate(), request.getReturnDate(), 
                rentalFee, request.getPaymentMethod(), httpRequest
        );

        systemLogService.logAction(
                library.common.constant.SystemLogConstants.ACTION_GUEST_CREATE_ORDER, 
                String.format(library.common.constant.SystemLogConstants.DETAIL_GUEST_ORDER_SUCCESS, customer.getFullName(), customer.getPhone(), response.getOrderCode())
        );
        cacheInvalidationService.evictBookCaches();

        // Send confirmation email if email is provided
        if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
            String emailName = (request.getFullName() != null && !request.getFullName().trim().isEmpty()) 
                                ? request.getFullName() : customer.getFullName();
            
            java.text.NumberFormat currencyFormatter = java.text.NumberFormat.getCurrencyInstance(java.util.Locale.of("vi", "VN"));
            String formattedRentalFee = currencyFormatter.format(rentalFee);
            String formattedDepositPrice = currencyFormatter.format(book.getDepositPrice() != null ? book.getDepositPrice() : BigDecimal.ZERO);

            emailService.sendGuestBorrowConfirmationEmail(
                    request.getEmail(),
                    emailName,
                    response.getOrderCode(),
                    request.getPickupDate(),
                    request.getReturnDate(),
                    book.getTitle(),
                    "Chờ xử lý",
                    formattedRentalFee,
                    formattedDepositPrice
                );
        }

        return response;
    }



    @Override
    @Transactional
    public void cancelBorrowOrder(String orderCode, Integer userId) {
        BorrowOrderEntity borrowOrder = borrowOrderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new CustomBusinessException("Order not found", HttpStatus.NOT_FOUND));

        if (borrowOrder.getCustomer() == null || borrowOrder.getCustomer().getUser() == null || !borrowOrder.getCustomer().getUser().getId().equals(userId)) {
            throw new CustomBusinessException("Unauthorized to cancel this order", HttpStatus.FORBIDDEN);
        }

        if (borrowOrder.getStatus() != BorrowOrderStatus.PENDING && borrowOrder.getStatus() != BorrowOrderStatus.READY) {
            throw new CustomBusinessException("Only pending or ready orders can be cancelled", HttpStatus.BAD_REQUEST);
        }

        borrowOrder.setStatus(BorrowOrderStatus.CANCELLED);
        borrowOrderRepository.save(borrowOrder);

        java.util.List<BorrowOrderDetailEntity> details = borrowOrderDetailRepository.findByBorrowOrder(borrowOrder);
        for (BorrowOrderDetailEntity detail : details) {
            detail.setStatus(BorrowOrderDetailStatus.CANCELLED);
            borrowOrderDetailRepository.save(detail);

            BookCopyEntity copy = detail.getBookCopy();
            if (copy != null) {
                copy.setStatus(BookCopyStatus.AVAILABLE);
                bookCopyRepository.save(copy);
            }
        }
        cacheInvalidationService.evictBookCaches();
    }

    // --- Extracted Private Methods ---

    private BorrowResponseDto processBorrowOrderCreation(
            CustomerEntity customer, BookEntity book, BookCopyEntity availableCopy,
            LocalDate pickupDate, LocalDate returnDate, BigDecimal rentalFee,
            PaymentMethod paymentMethod, HttpServletRequest httpRequest) {

        String orderCode = "BO-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        BigDecimal depositPrice = book.getDepositPrice() != null ? book.getDepositPrice() : BigDecimal.ZERO;

        BorrowOrderEntity borrowOrder = BorrowOrderEntity.builder()
                .orderCode(orderCode)
                .customer(customer)
                .pickupDate(pickupDate)
                .dueDate(returnDate)
                .status(BorrowOrderStatus.PENDING)
                .subtotalFee(rentalFee)
                .discountPercent(BigDecimal.ZERO)
                .discountAmount(BigDecimal.ZERO)
                .totalFee(rentalFee)
                .totalDeposit(depositPrice)
                .build();

        borrowOrder = borrowOrderRepository.save(borrowOrder);

        BorrowOrderDetailEntity orderDetail = BorrowOrderDetailEntity.builder()
                .borrowOrder(borrowOrder)
                .bookCopy(availableCopy)
                .rentalFee(rentalFee)
                .depositPrice(depositPrice)
                .status(BorrowOrderDetailStatus.BORROWING)
                .build();

        borrowOrderDetailRepository.save(orderDetail);

        PaymentEntity payment = paymentHelper.createDepositPayment(borrowOrder, depositPrice, paymentMethod);

        BorrowResponseDto.BorrowResponseDtoBuilder responseBuilder = BorrowResponseDto.builder()
                .id(borrowOrder.getId())
                .orderCode(borrowOrder.getOrderCode())
                .pickupDate(borrowOrder.getPickupDate())
                .dueDate(borrowOrder.getDueDate())
                .status(borrowOrder.getStatus())
                .totalDeposit(borrowOrder.getTotalDeposit())
                .paymentMethod(payment.getPaymentMethod())
                .paymentStatus(payment.getPaymentStatus());

        if (paymentMethod == PaymentMethod.VNPAY) {
            String ipAddress = VnPayUtil.getIpAddress(httpRequest);
            String paymentUrl = vnPayService.createPaymentUrl(
                    payment.getTransactionCode(),
                    "Thanh toan dat coc don hang " + borrowOrder.getOrderCode(),
                    depositPrice,
                    ipAddress);
            responseBuilder.paymentUrl(paymentUrl);
            log.info("VNPay payment URL generated for orderCode={}", orderCode);
        }

        return responseBuilder.build();
    }

    private CustomerEntity getOrCreateCustomer(UserEntity user) {
        return customerRepository.findByUserId(user.getId()).orElseGet(() -> {
            CustomerEntity newCustomer = CustomerEntity.builder()
                    .user(user)
                    .fullName(user.getFullName() != null ? user.getFullName() : "Unknown")
                    .phone(user.getPhone() != null ? user.getPhone() : "0000000000")
                    .email(user.getEmail())
                    .address("Chưa cập nhật")
                    .build();
            return customerRepository.save(newCustomer);
        });
    }

    private BookCopyEntity reserveBookCopy(Integer bookId, CustomerEntity customer) {
        boolean hasNotifiedReservation = false;
        if (customer != null && customer.getId() != null) {
            hasNotifiedReservation = reservationRepository.existsByCustomerIdAndBookIdAndStatus(
                    customer.getId(), bookId, ReservationStatus.NOTIFIED);
        }

        BookCopyEntity availableCopy = null;

        if (hasNotifiedReservation) {
            availableCopy = bookCopyRepository.findFirstByBookIdAndStatus(bookId, BookCopyStatus.RESERVED);
            if (availableCopy != null) {
                java.util.List<ReservationEntity> reservations = reservationRepository.findByCustomerIdAndBookId(customer.getId(), bookId);
                for (ReservationEntity res : reservations) {
                    if (res.getStatus() == ReservationStatus.NOTIFIED) {
                        res.setStatus(ReservationStatus.COMPLETED);
                        reservationRepository.save(res);
                        break;
                    }
                }
            }
        }

        if (availableCopy == null) {
            availableCopy = bookCopyRepository.findFirstByBookIdAndStatus(bookId, BookCopyStatus.AVAILABLE);
        }

        if (availableCopy == null) {
            throw new CustomBusinessException("No copies of this book are currently available", HttpStatus.BAD_REQUEST);
        }

        // Reserve the copy
        availableCopy.setStatus(BookCopyStatus.MAINTENANCE); 
        return bookCopyRepository.save(availableCopy);
    }

    private void createBorrowExtension(BorrowOrderEntity order, LocalDate newDueDate) {
        BorrowExtensionEntity extension = BorrowExtensionEntity.builder()
                .borrowOrder(order)
                .requestedDueDate(newDueDate)
                .status(BorrowExtensionStatus.PENDING)
                .requestedAt(LocalDateTime.now())
                .build();
        borrowExtensionRepository.save(extension);
    }
}
