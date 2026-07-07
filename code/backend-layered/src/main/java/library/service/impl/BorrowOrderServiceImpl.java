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
import library.service.SystemLogService;
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
    private final library.repository.BorrowExtensionRepository borrowExtensionRepository;
    private final library.repository.ReservationRepository reservationRepository;
    private final SystemLogService systemLogService;
    private final library.service.EmailService emailService;
    private final library.service.FeeCalculatorService feeCalculatorService;
    private final library.mapper.BorrowOrderMapper borrowOrderMapper;

    @org.springframework.context.annotation.Lazy
    @org.springframework.beans.factory.annotation.Autowired
    private library.service.AdminBorrowService adminBorrowService;

    @Override
    @Transactional
    public BorrowResponseDto createBorrowOrder(Integer userId, BorrowRequestDto request,
            HttpServletRequest httpRequest) {
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

        long borrowDays = java.time.temporal.ChronoUnit.DAYS.between(request.getPickupDate(), request.getReturnDate());
        if (borrowDays == 0)
            borrowDays = 1; // Borrow and return same day counts as 1 day
        if (borrowDays > 14) {
            throw new CustomBusinessException("Thời gian mượn sách không được vượt quá 14 ngày",
                    HttpStatus.BAD_REQUEST);
        }

        BigDecimal rentalFee = BigDecimal.valueOf(borrowDays * 5000L);

        // Validate book availability and get a copy
        BookCopyEntity availableCopy = bookCopyRepository.findFirstByBookIdAndStatus(book.getId(),
                BookCopyStatus.AVAILABLE);
        if (availableCopy == null) {
            throw new CustomBusinessException("No copies of this book are currently available", HttpStatus.BAD_REQUEST);
        }

        // Reserve the copy
        availableCopy.setStatus(BookCopyStatus.MAINTENANCE); // Temporarily put in maintenance to avoid other people
                                                             // picking it up. Actual borrow will be handled by
                                                             // librarian.
        bookCopyRepository.save(availableCopy);

        // Create BorrowOrder
        String orderCode = "BO-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        BigDecimal depositPrice = book.getDepositPrice() != null ? book.getDepositPrice() : BigDecimal.ZERO;

        BorrowOrderEntity borrowOrder = BorrowOrderEntity.builder()
                .orderCode(orderCode)
                .customer(customer)
                .pickupDate(request.getPickupDate())
                .dueDate(request.getReturnDate())
                .status(BorrowOrderStatus.PENDING)
                .subtotalFee(rentalFee)
                .discountPercent(BigDecimal.ZERO)
                .discountAmount(BigDecimal.ZERO)
                .totalFee(rentalFee)
                .totalDeposit(depositPrice)
                .build();

        borrowOrder = borrowOrderRepository.save(borrowOrder);

        // Create BorrowOrderDetail
        BorrowOrderDetailEntity orderDetail = BorrowOrderDetailEntity.builder()
                .borrowOrder(borrowOrder)
                .bookCopy(availableCopy)
                .rentalFee(rentalFee)
                .depositPrice(depositPrice)
                .status(BorrowOrderDetailStatus.BORROWING)
                .build();

        borrowOrderDetailRepository.save(orderDetail);

        // Create Payment
        PaymentEntity payment = PaymentEntity.builder()
                .borrowOrder(borrowOrder)
                .paymentMethod(request.getPaymentMethod())
                .transactionCode(UUID.randomUUID().toString())
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
                    payment.getTransactionCode(),
                    "Thanh toan dat coc don hang " + borrowOrder.getOrderCode(),
                    depositPrice,
                    ipAddress);
            responseBuilder.paymentUrl(paymentUrl);
            log.info("VNPay payment URL generated for orderCode={}", orderCode);
        }

        systemLogService.logAction(user, "Mượn sách", "Người dùng " + user.getEmail() + " đã mượn sách: " + book.getTitle() + " (Mã đơn: " + orderCode + ")");

        return responseBuilder.build();
    }

    @Override
    @Transactional(readOnly = true)
    public java.util.List<library.dto.borrow.BorrowHistoryResponseDto> getBorrowHistory(Integer userId) {
        java.util.List<BorrowOrderEntity> orders = borrowOrderRepository.findBorrowHistoryByUserId(userId);

        java.util.List<library.dto.borrow.BorrowHistoryResponseDto> result = orders.stream()
                .map(borrowOrderMapper::toBorrowHistoryResponseDto)
                .collect(Collectors.toList());

        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public library.dto.borrow.BorrowOrderDetailResponseDto getBorrowOrderDetail(String orderCode, Integer userId) {
        BorrowOrderEntity order = borrowOrderRepository.findByOrderCodeAndCustomerUserId(orderCode, userId)
                .orElseThrow(() -> new CustomBusinessException(
                        "Borrow order not found or you do not have permission to view it", HttpStatus.NOT_FOUND));

        return borrowOrderMapper.toBorrowOrderDetailResponseDto(order);
    }

    @Override
    @Transactional
    public BorrowResponseDto renewBorrowOrder(String orderCode, Integer userId,
            library.dto.borrow.BorrowExtensionRequestDto request, HttpServletRequest httpRequest) {
        BorrowOrderEntity order = borrowOrderRepository.findByOrderCodeAndCustomerUserId(orderCode, userId)
                .orElseThrow(() -> new CustomBusinessException("Borrow order not found", HttpStatus.NOT_FOUND));

        if (order.getStatus() != BorrowOrderStatus.BORROWED && order.getStatus() != BorrowOrderStatus.OVERDUE) {
            throw new CustomBusinessException(
                    "Chỉ có thể gia hạn khi phiếu mượn đang ở trạng thái Đang mượn hoặc Quá hạn",
                    HttpStatus.BAD_REQUEST);
        }

        // Check if any book is reserved
        if (order.getOrderDetails() != null) {
            for (BorrowOrderDetailEntity detail : order.getOrderDetails()) {
                if (reservationRepository.existsByBookIdAndStatus(detail.getBookCopy().getBook().getId(),
                        ReservationStatus.PENDING)) {
                    throw new CustomBusinessException("Không thể gia hạn vì sách đang có người đặt giữ",
                            HttpStatus.BAD_REQUEST);
                }
            }
        }

        // Check extension limit (only count APPROVED extensions, not rejected/failed
        // ones)
        long extensionCount = borrowExtensionRepository.countByBorrowOrderIdAndStatus(order.getId(),
                BorrowExtensionStatus.APPROVED);
        if (extensionCount >= 2) { // Defaulting to 2 as per plan
            throw new CustomBusinessException("Phiếu mượn đã vượt quá số lần gia hạn cho phép", HttpStatus.BAD_REQUEST);
        }

        // Base date for extension
        LocalDate baseDate = order.getDueDate();
        long overdueDaysForPenalty = 0;
        if (order.getStatus() == BorrowOrderStatus.OVERDUE || baseDate == null || baseDate.isBefore(LocalDate.now())) {
            if (baseDate != null) {
                overdueDaysForPenalty = java.time.temporal.ChronoUnit.DAYS.between(baseDate, LocalDate.now());
            }
            baseDate = LocalDate.now();
        }

        // Create extension
        BorrowExtensionEntity extension = BorrowExtensionEntity.builder()
                .borrowOrder(order)
                .requestedDueDate(baseDate.plusDays(request.getDurationInDays()))
                .status(BorrowExtensionStatus.PENDING)
                .requestedAt(LocalDateTime.now())
                .build();

        borrowExtensionRepository.save(extension);

        // Bỏ cập nhật trạng thái order sang PENDING_RENEWAL ở đây.
        // Giữ nguyên trạng thái (BORROWED/OVERDUE) để người dùng không bị hiểu lầm là
        // đã thanh toán.
        // Trạng thái sẽ được VNPay callback cập nhật sau thông qua processRenewal.

        // Calculate overdue penalty (if the order was overdue at the time of renewal)
        BigDecimal overdueFee = BigDecimal.ZERO;
        if (overdueDaysForPenalty > 0) {
            overdueFee = new BigDecimal("10000").multiply(new BigDecimal(overdueDaysForPenalty));
        }

        // Calculate amounts already paid online (RENTAL_FEE payments)
        BigDecimal totalPaidOnline = BigDecimal.ZERO;
        java.util.List<PaymentEntity> successfulPayments = paymentRepository
                .findByBorrowOrderIdAndPaymentStatus(order.getId(), PaymentStatus.SUCCESS);
        for (PaymentEntity p : successfulPayments) {
            if (p.getPaymentType() == PaymentType.RENTAL_FEE || p.getPaymentType() == PaymentType.FINE) {
                totalPaidOnline = totalPaidOnline.add(p.getAmount());
            }
        }

        // Current debt = totalFee + new overdue penalty
        BigDecimal currentDebt = (order.getTotalFee() != null ? order.getTotalFee() : BigDecimal.ZERO).add(overdueFee);

        // Amount to pay online is the unpaid debt (DO NOT charge the new extension fee
        // yet, it is just recorded as debt)
        BigDecimal amountToPayOnline = currentDebt.subtract(totalPaidOnline).max(BigDecimal.ZERO);

        String paymentUrl = null;

        if (amountToPayOnline.compareTo(BigDecimal.ZERO) > 0) {
            // Create pending payment for unpaid debt (previous rental fee + overdue
            // penalty)
            PaymentEntity payment = PaymentEntity.builder()
                    .borrowOrder(order)
                    .paymentMethod(PaymentMethod.VNPAY)
                    .transactionCode(UUID.randomUUID().toString())
                    .amount(amountToPayOnline)
                    .paymentType(PaymentType.RENTAL_FEE)
                    .paymentStatus(PaymentStatus.PENDING)
                    .paymentDate(LocalDateTime.now())
                    .build();
            paymentRepository.save(payment);

            String ipAddress = VnPayUtil.getIpAddress(httpRequest);
            String orderInfo = overdueFee.compareTo(BigDecimal.ZERO) > 0
                    ? "Gia han va nop phat don hang " + order.getOrderCode()
                    : "Gia han don hang " + order.getOrderCode();
            paymentUrl = vnPayService.createPaymentUrl(
                    payment.getTransactionCode(),
                    orderInfo,
                    amountToPayOnline,
                    ipAddress);
        } else {
            // No fee needed, auto approve instantly
            adminBorrowService.processRenewal(order.getOrderCode(), new library.dto.admin.AdminRenewalRequestDto(true));
        }

        systemLogService.logAction("Yêu cầu gia hạn", "Người dùng yêu cầu gia hạn đơn mượn: " + order.getOrderCode() + " thêm " + request.getDurationInDays() + " ngày.");

        return BorrowResponseDto.builder()
                .orderCode(order.getOrderCode())
                .paymentUrl(paymentUrl)
                .build();
    }

    @Override
    public Page<UserBorrowHistoryDto> getUserBorrowHistory(Integer customerId, Pageable pageable) {
        return borrowOrderRepository.findByCustomerIdOrderByCreatedAtDesc(customerId, pageable)
                .map(borrowOrderMapper::toUserBorrowHistoryDto);
    }

    @Override
    public UserBorrowDetailDto getUserBorrowDetail(Integer customerId, String orderCode) {
        BorrowOrderEntity order = borrowOrderRepository.findByOrderCodeAndCustomerId(orderCode, customerId)
                .orElseThrow(() -> new CustomBusinessException("Borrow order not found", HttpStatus.NOT_FOUND));

        return borrowOrderMapper.toUserBorrowDetailDto(order);
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
        LocalDate today = LocalDate.now();
        if (request.getPickupDate().isBefore(today)) {
            throw new CustomBusinessException("Pickup date cannot be in the past", HttpStatus.BAD_REQUEST);
        }
        if (request.getReturnDate().isBefore(request.getPickupDate())) {
            throw new CustomBusinessException("Return date must be after pickup date", HttpStatus.BAD_REQUEST);
        }

        long borrowDays = java.time.temporal.ChronoUnit.DAYS.between(request.getPickupDate(), request.getReturnDate());
        if (borrowDays == 0)
            borrowDays = 1; // Borrow and return same day counts as 1 day
        if (borrowDays > 14) {
            throw new CustomBusinessException("Thời gian mượn sách không được vượt quá 14 ngày",
                    HttpStatus.BAD_REQUEST);
        }

        BigDecimal rentalFee = BigDecimal.valueOf(borrowDays * 5000L);

        // Validate book availability and get a copy
        BookCopyEntity availableCopy = bookCopyRepository.findFirstByBookIdAndStatus(book.getId(),
                BookCopyStatus.AVAILABLE);
        if (availableCopy == null) {
            throw new CustomBusinessException("No copies of this book are currently available", HttpStatus.BAD_REQUEST);
        }

        // Reserve the copy
        availableCopy.setStatus(BookCopyStatus.MAINTENANCE);
        bookCopyRepository.save(availableCopy);

        // Create BorrowOrder
        String orderCode = "BO-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        BigDecimal depositPrice = book.getDepositPrice() != null ? book.getDepositPrice() : BigDecimal.ZERO;

        BorrowOrderEntity borrowOrder = BorrowOrderEntity.builder()
                .orderCode(orderCode)
                .customer(customer)
                .pickupDate(request.getPickupDate())
                .dueDate(request.getReturnDate())
                .status(BorrowOrderStatus.PENDING)
                .subtotalFee(rentalFee)
                .discountPercent(BigDecimal.ZERO)
                .discountAmount(BigDecimal.ZERO)
                .totalFee(rentalFee)
                .totalDeposit(depositPrice)
                .build();

        borrowOrder = borrowOrderRepository.save(borrowOrder);

        // Create BorrowOrderDetail
        BorrowOrderDetailEntity orderDetail = BorrowOrderDetailEntity.builder()
                .borrowOrder(borrowOrder)
                .bookCopy(availableCopy)
                .rentalFee(rentalFee)
                .depositPrice(depositPrice)
                .status(BorrowOrderDetailStatus.BORROWING)
                .build();

        borrowOrderDetailRepository.save(orderDetail);

        // Create Payment
        PaymentEntity payment = PaymentEntity.builder()
                .borrowOrder(borrowOrder)
                .paymentMethod(request.getPaymentMethod())
                .transactionCode(UUID.randomUUID().toString())
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
                    payment.getTransactionCode(),
                    "Thanh toan dat coc don hang " + borrowOrder.getOrderCode(),
                    depositPrice,
                    ipAddress);
            responseBuilder.paymentUrl(paymentUrl);
            log.info("VNPay payment URL generated for orderCode={}", orderCode);
        }

        systemLogService.logAction(
                library.common.constant.SystemLogConstants.ACTION_GUEST_CREATE_ORDER, 
                String.format(library.common.constant.SystemLogConstants.DETAIL_GUEST_ORDER_SUCCESS, customer.getFullName(), customer.getPhone(), orderCode)
        );

        // Send confirmation email if email is provided
        if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
            String emailName = (request.getFullName() != null && !request.getFullName().trim().isEmpty()) 
                                ? request.getFullName() : customer.getFullName();
            
            java.text.NumberFormat format = java.text.NumberFormat.getCurrencyInstance(new java.util.Locale("vi", "VN"));
            String formattedRentalFee = format.format(rentalFee);
            String formattedDepositPrice = format.format(depositPrice);

            emailService.sendGuestBorrowConfirmationEmail(
                    request.getEmail(),
                    emailName,
                    orderCode,
                    request.getPickupDate(),
                    request.getReturnDate(),
                    book.getTitle(),
                    "Chờ xử lý",
                    formattedRentalFee,
                    formattedDepositPrice
            );
        }

        return responseBuilder.build();
    }

    @Override
    @Transactional(readOnly = true)
    public java.util.List<library.dto.borrow.BorrowOrderDetailResponseDto> getGuestBorrowOrders(String identifier) {
        java.util.List<BorrowOrderEntity> orders;
        if (identifier.contains("@")) {
            orders = borrowOrderRepository.findByCustomerEmailOrderByCreatedAtDesc(identifier.toLowerCase());
        } else {
            java.util.Optional<BorrowOrderEntity> orderOpt = borrowOrderRepository.findByOrderCode(identifier);
            orders = orderOpt.map(java.util.Collections::singletonList).orElse(java.util.Collections.emptyList());
        }

        if (orders.isEmpty()) {
            throw new CustomBusinessException("Không tìm thấy đơn mượn nào khớp với thông tin cung cấp.", HttpStatus.NOT_FOUND);
        }

        return orders.stream().map(borrowOrderMapper::toBorrowOrderDetailResponseDto).collect(java.util.stream.Collectors.toList());
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
    }
}
