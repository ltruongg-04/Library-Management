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
    private final library.repository.BorrowExtensionRepository borrowExtensionRepository;
    private final library.repository.ReservationRepository reservationRepository;
    
    @org.springframework.context.annotation.Lazy
    @org.springframework.beans.factory.annotation.Autowired
    private library.service.AdminBorrowService adminBorrowService;

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

        long borrowDays = java.time.temporal.ChronoUnit.DAYS.between(request.getPickupDate(), request.getReturnDate());
        if (borrowDays == 0) borrowDays = 1; // Borrow and return same day counts as 1 day
        if (borrowDays > 14) {
            throw new CustomBusinessException("Thời gian mượn sách không được vượt quá 14 ngày", HttpStatus.BAD_REQUEST);
        }

        BigDecimal rentalFee = BigDecimal.valueOf(borrowDays * 5000L);

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
                    ipAddress
            );
            responseBuilder.paymentUrl(paymentUrl);
            log.info("VNPay payment URL generated for orderCode={}", orderCode);
        }

        return responseBuilder.build();
    }

    @Override
    @Transactional(readOnly = true)
    public java.util.List<library.dto.borrow.BorrowHistoryResponseDto> getBorrowHistory(Integer userId) {
        java.util.List<BorrowOrderEntity> orders = borrowOrderRepository.findBorrowHistoryByUserId(userId);
        
        java.util.List<library.dto.borrow.BorrowHistoryResponseDto> result = new java.util.ArrayList<>();
        java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy");
        java.text.NumberFormat currencyFormatter = java.text.NumberFormat.getCurrencyInstance(new java.util.Locale("vi", "VN"));
        
        for (BorrowOrderEntity order : orders) {
            String title = "Unknown Book";
            String author = "Unknown Author";
            String imgSrc = null;
            
            if (order.getOrderDetails() != null && !order.getOrderDetails().isEmpty()) {
                library.entity.BookEntity book = order.getOrderDetails().get(0).getBookCopy().getBook();
                title = book.getTitle();
                if (book.getAuthors() != null && !book.getAuthors().isEmpty()) {
                    author = book.getAuthors().iterator().next().getName();
                } else if (book.getAuthor() != null && !book.getAuthor().isEmpty()) {
                    author = book.getAuthor();
                }
                imgSrc = book.getImageUrl();
            }
            
            String depositFormatted = order.getTotalDeposit() != null ? currencyFormatter.format(order.getTotalDeposit()) : "0 đ";
            String depositReturnFormatted = depositFormatted; // Có thể cập nhật sau nếu admin trừ trực tiếp vào cọc
            String status = order.getStatus().name().toLowerCase();
            
            // Calculate late fee
            java.math.BigDecimal storedLateFee = order.getTotalFee() != null && order.getSubtotalFee() != null ? order.getTotalFee().subtract(order.getSubtotalFee()) : java.math.BigDecimal.ZERO;
            if (storedLateFee.compareTo(java.math.BigDecimal.ZERO) < 0) storedLateFee = java.math.BigDecimal.ZERO;
            
            java.math.BigDecimal dynamicLateFee = java.math.BigDecimal.ZERO;
            int overdueDays = 0;
            if (order.getStatus() == library.entity.BorrowOrderStatus.OVERDUE || 
                order.getStatus() == library.entity.BorrowOrderStatus.PENDING_RENEWAL ||
                (order.getStatus() == library.entity.BorrowOrderStatus.BORROWED && java.time.LocalDate.now().isAfter(order.getDueDate()))) {
                java.time.LocalDate compareDate = order.getActualReturnDate() != null ? order.getActualReturnDate() : java.time.LocalDate.now();
                overdueDays = (int) java.time.temporal.ChronoUnit.DAYS.between(order.getDueDate(), compareDate);
                if (overdueDays > 0) dynamicLateFee = new java.math.BigDecimal(overdueDays * 10000);
            }
            java.math.BigDecimal totalLateFee = storedLateFee.add(dynamicLateFee);
            String lateFeeFormatted = totalLateFee.compareTo(java.math.BigDecimal.ZERO) > 0 ? "+" + currencyFormatter.format(totalLateFee) : "0 đ";

            long extensionCount = borrowExtensionRepository.countByBorrowOrderIdAndStatus(order.getId(), library.entity.BorrowExtensionStatus.APPROVED);

            result.add(library.dto.borrow.BorrowHistoryResponseDto.builder()
                    .id(order.getOrderCode())
                    .title(title)
                    .author(author)
                    .borrowDate(order.getBorrowDate() != null ? order.getBorrowDate().format(formatter) : (order.getCreatedAt() != null ? order.getCreatedAt().toLocalDate().format(formatter) : ""))
                    .dueDate(order.getDueDate() != null ? order.getDueDate().format(formatter) : "")
                    .actualReturnDate(order.getActualReturnDate() != null ? order.getActualReturnDate().format(formatter) : null)
                    .deposit(depositFormatted)
                    .depositReturn(depositReturnFormatted)
                    .lateFee(lateFeeFormatted)
                    .status(status)
                    .extensionCount((int) extensionCount)
                    .imgSrc(imgSrc)
                    .build());
        }
        
        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public library.dto.borrow.BorrowOrderDetailResponseDto getBorrowOrderDetail(String orderCode, Integer userId) {
        BorrowOrderEntity order = borrowOrderRepository.findByOrderCodeAndCustomerUserId(orderCode, userId)
                .orElseThrow(() -> new CustomBusinessException("Borrow order not found or you do not have permission to view it", HttpStatus.NOT_FOUND));

        java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("dd 'Tháng' MM, yyyy");
        java.text.NumberFormat currencyFormatter = java.text.NumberFormat.getCurrencyInstance(new java.util.Locale("vi", "VN"));

        String borrowDateStr = order.getBorrowDate() != null ? order.getBorrowDate().format(formatter) : (order.getCreatedAt() != null ? order.getCreatedAt().toLocalDate().format(formatter) : "");
        String dueDateStr = order.getDueDate() != null ? order.getDueDate().format(formatter) : "";
        
        // Mocking some dates that might not be fully implemented in DB yet
        String deadlineDateStr = dueDateStr;
        String reminderDateStr = order.getDueDate() != null ? order.getDueDate().minusDays(1).format(formatter) : "";
        String borrowSuccessDateStr = order.getBorrowDate() != null ? order.getBorrowDate().format(formatter) : ""; // Real borrow date

        String depositFormatted = order.getTotalDeposit() != null ? currencyFormatter.format(order.getTotalDeposit()) : "0 đ";
        
        // Calculate amounts already paid online (RENTAL_FEE payments, not DEPOSIT)
        BigDecimal totalPaidOnline = BigDecimal.ZERO;
        java.util.List<PaymentEntity> successfulPayments = paymentRepository.findByBorrowOrderIdAndPaymentStatus(order.getId(), PaymentStatus.SUCCESS);
        for (PaymentEntity p : successfulPayments) {
            if (p.getPaymentType() == PaymentType.RENTAL_FEE || p.getPaymentType() == PaymentType.FINE) {
                totalPaidOnline = totalPaidOnline.add(p.getAmount());
            }
        }

        // Calculate late fee: only show UNPAID overdue penalties
        BigDecimal storedLateFee = order.getTotalFee() != null && order.getSubtotalFee() != null ? order.getTotalFee().subtract(order.getSubtotalFee()) : BigDecimal.ZERO;
        if (storedLateFee.compareTo(BigDecimal.ZERO) < 0) storedLateFee = BigDecimal.ZERO;
        
        BigDecimal dynamicLateFee = BigDecimal.ZERO;
        String status = order.getStatus().name().toLowerCase();
        int overdueDays = 0;

        if ((order.getStatus() == BorrowOrderStatus.OVERDUE || order.getStatus() == BorrowOrderStatus.PENDING_RENEWAL) && order.getDueDate() != null) {
            overdueDays = (int) java.time.temporal.ChronoUnit.DAYS.between(order.getDueDate(), java.time.LocalDate.now());
            if (overdueDays > 0) {
                dynamicLateFee = new BigDecimal("10000").multiply(new BigDecimal(overdueDays));
            } else {
                overdueDays = 0;
            }
        } else if (order.getStatus() == BorrowOrderStatus.RETURNED && order.getDueDate() != null && order.getActualReturnDate() != null) {
            overdueDays = (int) java.time.temporal.ChronoUnit.DAYS.between(order.getDueDate(), order.getActualReturnDate());
            if (overdueDays < 0) overdueDays = 0;
        }

        // Total late fee = stored (from previous renewals) + dynamic (current overdue)
        // But subtract what was already paid via VNPay
        BigDecimal totalLateFee = storedLateFee.add(dynamicLateFee);
        BigDecimal unpaidLateFee = totalLateFee.subtract(totalPaidOnline).max(BigDecimal.ZERO);
        String lateFeeFormatted = totalLateFee.compareTo(BigDecimal.ZERO) > 0 ? "+" + currencyFormatter.format(totalLateFee) : "0 đ";
        
        // Total remaining = totalFee + dynamic overdue - already paid online
        BigDecimal totalToDisplay = order.getTotalFee() != null ? order.getTotalFee() : BigDecimal.ZERO;
        totalToDisplay = totalToDisplay.add(dynamicLateFee).subtract(totalPaidOnline);
        if (totalToDisplay.compareTo(BigDecimal.ZERO) < 0) totalToDisplay = BigDecimal.ZERO;
        String totalFormatted = currencyFormatter.format(totalToDisplay);

        java.util.List<library.dto.borrow.BorrowOrderDetailResponseDto.BookItemDto> bookItems = new java.util.ArrayList<>();
        if (order.getOrderDetails() != null) {
            for (BorrowOrderDetailEntity detail : order.getOrderDetails()) {
                library.entity.BookEntity book = detail.getBookCopy().getBook();
                String title = book.getTitle();
                String author = "Unknown Author";
                if (book.getAuthors() != null && !book.getAuthors().isEmpty()) {
                    author = book.getAuthors().iterator().next().getName();
                } else if (book.getAuthor() != null && !book.getAuthor().isEmpty()) {
                    author = book.getAuthor();
                }
                
                String bookStatus = detail.getStatus().name().toLowerCase();
                if (bookStatus.equals("borrowing")) bookStatus = "inUse";

                bookItems.add(library.dto.borrow.BorrowOrderDetailResponseDto.BookItemDto.builder()
                        .title(title)
                        .author(author)
                        .status(bookStatus)
                        .imgSrc(book.getImageUrl())
                        .build());
            }
        }

        String rentalFeeFormatted = order.getSubtotalFee() != null ? currencyFormatter.format(order.getSubtotalFee()) : "0 đ";

        String actualReturnDateStr = order.getActualReturnDate() != null ? order.getActualReturnDate().format(formatter) : null;
        
        long extensionCount = borrowExtensionRepository.countByBorrowOrderIdAndStatus(order.getId(), library.entity.BorrowExtensionStatus.APPROVED);

        return library.dto.borrow.BorrowOrderDetailResponseDto.builder()
                .id(order.getOrderCode())
                .borrowDate(borrowDateStr)
                .dueDate(dueDateStr)
                .actualReturnDate(actualReturnDateStr)
                .deadlineDate(deadlineDateStr)
                .reminderDate(reminderDateStr)
                .borrowSuccessDate(borrowSuccessDateStr)
                .deposit(depositFormatted)
                .rentalFee(rentalFeeFormatted)
                .lateFee(lateFeeFormatted)
                .paidOnline(currencyFormatter.format(totalPaidOnline))
                .total(totalFormatted)
                .status(status)
                .overdueDays(overdueDays)
                .extensionCount((int) extensionCount)
                .books(bookItems)
                .build();
    }

    @Override
    @Transactional
    public BorrowResponseDto renewBorrowOrder(String orderCode, Integer userId, library.dto.borrow.BorrowExtensionRequestDto request, HttpServletRequest httpRequest) {
        BorrowOrderEntity order = borrowOrderRepository.findByOrderCodeAndCustomerUserId(orderCode, userId)
                .orElseThrow(() -> new CustomBusinessException("Borrow order not found", HttpStatus.NOT_FOUND));

        if (order.getStatus() != BorrowOrderStatus.BORROWED && order.getStatus() != BorrowOrderStatus.OVERDUE) {
            throw new CustomBusinessException("Chỉ có thể gia hạn khi phiếu mượn đang ở trạng thái Đang mượn hoặc Quá hạn", HttpStatus.BAD_REQUEST);
        }

        // Check if any book is reserved
        if (order.getOrderDetails() != null) {
            for (BorrowOrderDetailEntity detail : order.getOrderDetails()) {
                if (reservationRepository.existsByBookIdAndStatus(detail.getBookCopy().getBook().getId(), ReservationStatus.PENDING)) {
                    throw new CustomBusinessException("Không thể gia hạn vì sách đang có người đặt giữ", HttpStatus.BAD_REQUEST);
                }
            }
        }

        // Check extension limit (only count APPROVED extensions, not rejected/failed ones)
        long extensionCount = borrowExtensionRepository.countByBorrowOrderIdAndStatus(order.getId(), BorrowExtensionStatus.APPROVED);
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
        // Giữ nguyên trạng thái (BORROWED/OVERDUE) để người dùng không bị hiểu lầm là đã thanh toán.
        // Trạng thái sẽ được VNPay callback cập nhật sau thông qua processRenewal.

        // Calculate overdue penalty (if the order was overdue at the time of renewal)
        BigDecimal overdueFee = BigDecimal.ZERO;
        if (overdueDaysForPenalty > 0) {
            overdueFee = new BigDecimal("10000").multiply(new BigDecimal(overdueDaysForPenalty));
        }

        // Calculate amounts already paid online (RENTAL_FEE payments)
        BigDecimal totalPaidOnline = BigDecimal.ZERO;
        java.util.List<PaymentEntity> successfulPayments = paymentRepository.findByBorrowOrderIdAndPaymentStatus(order.getId(), PaymentStatus.SUCCESS);
        for (PaymentEntity p : successfulPayments) {
            if (p.getPaymentType() == PaymentType.RENTAL_FEE || p.getPaymentType() == PaymentType.FINE) {
                totalPaidOnline = totalPaidOnline.add(p.getAmount());
            }
        }

        // Current debt = totalFee + new overdue penalty
        BigDecimal currentDebt = (order.getTotalFee() != null ? order.getTotalFee() : BigDecimal.ZERO).add(overdueFee);
        
        // Amount to pay online is the unpaid debt (DO NOT charge the new extension fee yet, it is just recorded as debt)
        BigDecimal amountToPayOnline = currentDebt.subtract(totalPaidOnline).max(BigDecimal.ZERO);
        
        String paymentUrl = null;

        if (amountToPayOnline.compareTo(BigDecimal.ZERO) > 0) {
            // Create pending payment for unpaid debt (previous rental fee + overdue penalty)
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
                    ipAddress
            );
        } else {
            // No fee needed, auto approve instantly
            adminBorrowService.processRenewal(order.getOrderCode(), new library.dto.admin.AdminRenewalRequestDto(true));
        }

        return BorrowResponseDto.builder()
                .orderCode(order.getOrderCode())
                .paymentUrl(paymentUrl)
                .build();
    }
}
