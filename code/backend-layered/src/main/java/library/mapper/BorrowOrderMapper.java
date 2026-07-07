package library.mapper;

import library.dto.borrow.BorrowOrderDetailResponseDto;
import library.dto.borrow.UserBorrowDetailDto;
import library.dto.borrow.UserBorrowHistoryDto;
import library.entity.*;
import library.repository.BorrowExtensionRepository;
import library.repository.PaymentRepository;
import library.service.FeeCalculatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import java.util.ArrayList;
import java.util.List;


@Component
public class BorrowOrderMapper {

    @Autowired
    protected PaymentRepository paymentRepository;

    @Autowired
    protected BorrowExtensionRepository borrowExtensionRepository;

    @Autowired
    protected FeeCalculatorService feeCalculatorService;

    // ----- To UserBorrowHistoryDto -----
    public UserBorrowHistoryDto toUserBorrowHistoryDto(BorrowOrderEntity order) {
        if (order == null) return null;

        UserBorrowHistoryDto.UserBorrowHistoryDtoBuilder builder = UserBorrowHistoryDto.builder()
                .id(order.getId())
                .orderCode(order.getOrderCode())
                .status(resolveOrderStatus(order))
                .borrowDate(order.getBorrowDate())
                .pickupDate(order.getPickupDate())
                .dueDate(order.getDueDate())
                .totalDeposit(order.getTotalDeposit());

        if (order.getOrderDetails() != null && !order.getOrderDetails().isEmpty()) {
            BorrowOrderDetailEntity detail = order.getOrderDetails().get(0);
            BookEntity book = detail.getBookCopy().getBook();
            builder.bookTitle(book.getTitle())
                   .bookAuthor(getAuthorName(book))
                   .bookCoverImage(book.getImageUrl());
        }

        return builder.build();
    }

    // ----- To UserBorrowDetailDto -----
    public UserBorrowDetailDto toUserBorrowDetailDto(BorrowOrderEntity order) {
        if (order == null) return null;

        UserBorrowDetailDto.UserBorrowDetailDtoBuilder builder = UserBorrowDetailDto.builder()
                .id(order.getId())
                .orderCode(order.getOrderCode())
                .status(resolveOrderStatus(order))
                .borrowDate(order.getBorrowDate())
                .pickupDate(order.getPickupDate())
                .dueDate(order.getDueDate())
                .totalDeposit(order.getTotalDeposit())
                .totalFee(order.getTotalFee());

        if (order.getOrderDetails() != null && !order.getOrderDetails().isEmpty()) {
            BorrowOrderDetailEntity detail = order.getOrderDetails().get(0);
            BookEntity book = detail.getBookCopy().getBook();
            builder.bookTitle(book.getTitle())
                   .bookAuthor(getAuthorName(book))
                   .bookCoverImage(book.getImageUrl())
                   .bookDetailStatus(detail.getStatus().name());
        }

        if (order.getDueDate() != null && LocalDate.now().isAfter(order.getDueDate())
                && order.getStatus() != BorrowOrderStatus.RETURNED && order.getStatus() != BorrowOrderStatus.CANCELLED) {
            BigDecimal lateFee = feeCalculatorService.calculateOverdueFee(order.getDueDate(), LocalDate.now());
            builder.lateFee(lateFee);
        } else {
            builder.lateFee(BigDecimal.ZERO);
        }

        return builder.build();
    }

    // ----- To BorrowOrderDetailResponseDto -----
    public BorrowOrderDetailResponseDto toBorrowOrderDetailResponseDto(BorrowOrderEntity order) {
        if (order == null) return null;

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd 'Tháng' MM, yyyy");
        java.text.NumberFormat currencyFormatter = java.text.NumberFormat.getCurrencyInstance(java.util.Locale.of("vi", "VN"));

        String borrowDateStr = order.getBorrowDate() != null ? order.getBorrowDate().format(formatter)
                : (order.getCreatedAt() != null ? order.getCreatedAt().toLocalDate().format(formatter) : "");
        String dueDateStr = order.getDueDate() != null ? order.getDueDate().format(formatter) : "";
        String actualReturnDateStr = order.getActualReturnDate() != null ? order.getActualReturnDate().format(formatter) : null;
        String reminderDateStr = order.getDueDate() != null ? order.getDueDate().minusDays(1).format(formatter) : "";

        BigDecimal totalPaidOnline = BigDecimal.ZERO;
        List<PaymentEntity> successfulPayments = paymentRepository.findByBorrowOrderIdAndPaymentStatus(order.getId(), PaymentStatus.SUCCESS);
        for (PaymentEntity p : successfulPayments) {
            if (p.getPaymentType() == PaymentType.RENTAL_FEE || p.getPaymentType() == PaymentType.FINE) {
                totalPaidOnline = totalPaidOnline.add(p.getAmount());
            }
        }

        BigDecimal storedLateFee = order.getTotalFee() != null && order.getSubtotalFee() != null
                ? order.getTotalFee().subtract(order.getSubtotalFee()) : BigDecimal.ZERO;
        if (storedLateFee.compareTo(BigDecimal.ZERO) < 0) storedLateFee = BigDecimal.ZERO;

        BigDecimal dynamicLateFee = BigDecimal.ZERO;
        if ((order.getStatus() == BorrowOrderStatus.OVERDUE || order.getStatus() == BorrowOrderStatus.PENDING_RENEWAL) && order.getDueDate() != null) {
            dynamicLateFee = feeCalculatorService.calculateOverdueFee(order.getDueDate(), LocalDate.now());
        }

        BigDecimal totalLateFee = storedLateFee.add(dynamicLateFee);
        String lateFeeFormatted = totalLateFee.compareTo(BigDecimal.ZERO) > 0 ? "+" + currencyFormatter.format(totalLateFee) : "0 đ";

        BigDecimal totalToDisplay = order.getTotalFee() != null ? order.getTotalFee() : BigDecimal.ZERO;
        totalToDisplay = totalToDisplay.add(dynamicLateFee).subtract(totalPaidOnline).max(BigDecimal.ZERO);

        List<BorrowOrderDetailResponseDto.BookItemDto> bookItems = new ArrayList<>();
        if (order.getOrderDetails() != null) {
            for (BorrowOrderDetailEntity detail : order.getOrderDetails()) {
                BookEntity book = detail.getBookCopy().getBook();
                String bookStatus = detail.getStatus().name().toLowerCase();
                if ("borrowing".equals(bookStatus)) bookStatus = "inUse";

                bookItems.add(BorrowOrderDetailResponseDto.BookItemDto.builder()
                        .title(book.getTitle())
                        .author(getAuthorName(book))
                        .status(bookStatus)
                        .imgSrc(book.getImageUrl())
                        .build());
            }
        }

        String customerName = order.getCustomer().getFullName() != null ? order.getCustomer().getFullName() : "Unknown";
        String rawPhone = order.getCustomer().getPhone();
        String customerPhone = (rawPhone != null && rawPhone.length() >= 3) ? "*******" + rawPhone.substring(rawPhone.length() - 3) : "***";

        long extensionCount = borrowExtensionRepository.countByBorrowOrderIdAndStatus(order.getId(), BorrowExtensionStatus.APPROVED);

        return BorrowOrderDetailResponseDto.builder()
                .id(order.getOrderCode())
                .borrowDate(borrowDateStr)
                .dueDate(dueDateStr)
                .actualReturnDate(actualReturnDateStr)
                .deadlineDate(dueDateStr) // Same as dueDate
                .reminderDate(reminderDateStr)
                .borrowSuccessDate(borrowDateStr)
                .status(order.getStatus().name().toLowerCase())
                .customerName(customerName)
                .customerPhone(customerPhone)
                .deposit(order.getTotalDeposit() != null ? currencyFormatter.format(order.getTotalDeposit()) : "0 đ")
                .rentalFee(order.getSubtotalFee() != null ? currencyFormatter.format(order.getSubtotalFee()) : "0 đ")
                .lateFee(lateFeeFormatted)
                .paidOnline(currencyFormatter.format(totalPaidOnline))
                .total(currencyFormatter.format(totalToDisplay))
                .books(bookItems)
                .extensionCount((int) extensionCount)
                .overdueDays(0) // Mặc định hoặc tính toán nếu cần thiết, tạm thời để 0 vì đã có phí trễ
                .build();
    }

    // ----- To BorrowHistoryResponseDto -----
    public library.dto.borrow.BorrowHistoryResponseDto toBorrowHistoryResponseDto(BorrowOrderEntity order) {
        if (order == null) return null;

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd 'Tháng' MM, yyyy");
        java.text.NumberFormat currencyFormatter = java.text.NumberFormat.getCurrencyInstance(java.util.Locale.of("vi", "VN"));

        String title = "Unknown";
        String author = "Unknown Author";
        String imgSrc = null;

        if (order.getOrderDetails() != null && !order.getOrderDetails().isEmpty()) {
            BookEntity book = order.getOrderDetails().get(0).getBookCopy().getBook();
            title = book.getTitle();
            author = getAuthorName(book);
            imgSrc = book.getImageUrl();
        }

        String depositFormatted = order.getTotalDeposit() != null ? currencyFormatter.format(order.getTotalDeposit()) : "0 đ";
        String depositReturnFormatted = depositFormatted;
        String status = order.getStatus().name().toLowerCase();

        BigDecimal storedLateFee = order.getTotalFee() != null && order.getSubtotalFee() != null
                ? order.getTotalFee().subtract(order.getSubtotalFee()) : BigDecimal.ZERO;
        if (storedLateFee.compareTo(BigDecimal.ZERO) < 0) storedLateFee = BigDecimal.ZERO;

        BigDecimal dynamicLateFee = BigDecimal.ZERO;
        if (order.getStatus() == BorrowOrderStatus.OVERDUE || order.getStatus() == BorrowOrderStatus.PENDING_RENEWAL ||
                (order.getStatus() == BorrowOrderStatus.BORROWED && order.getDueDate() != null && LocalDate.now().isAfter(order.getDueDate()))) {
            LocalDate compareDate = order.getActualReturnDate() != null ? order.getActualReturnDate() : LocalDate.now();
            dynamicLateFee = feeCalculatorService.calculateOverdueFee(order.getDueDate(), compareDate);
        }
        
        BigDecimal totalLateFee = storedLateFee.add(dynamicLateFee);
        String lateFeeFormatted = totalLateFee.compareTo(BigDecimal.ZERO) > 0 ? "+" + currencyFormatter.format(totalLateFee) : "0 đ";

        String borrowDateStr = order.getBorrowDate() != null ? order.getBorrowDate().format(formatter)
                : (order.getCreatedAt() != null ? order.getCreatedAt().toLocalDate().format(formatter) : "");
        String dueDateStr = order.getDueDate() != null ? order.getDueDate().format(formatter) : "";
        String actualReturnDateStr = order.getActualReturnDate() != null ? order.getActualReturnDate().format(formatter) : null;

        long extensionCount = borrowExtensionRepository.countByBorrowOrderIdAndStatus(order.getId(), BorrowExtensionStatus.APPROVED);

        return library.dto.borrow.BorrowHistoryResponseDto.builder()
                .id(order.getOrderCode())
                .title(title)
                .author(author)
                .borrowDate(borrowDateStr)
                .dueDate(dueDateStr)
                .actualReturnDate(actualReturnDateStr)
                .deposit(depositFormatted)
                .depositReturn(depositReturnFormatted)
                .lateFee(lateFeeFormatted)
                .status(status)
                .extensionCount((int) extensionCount)
                .imgSrc(imgSrc)
                .build();
    }

    // ----- Helper Methods -----
    protected String resolveOrderStatus(BorrowOrderEntity order) {
        if (order.getStatus() == BorrowOrderStatus.BORROWED && order.getDueDate() != null && LocalDate.now().isAfter(order.getDueDate())) {
            return "OVERDUE";
        }
        return order.getStatus().name();
    }

    protected String getAuthorName(BookEntity book) {
        if (book.getAuthors() != null && !book.getAuthors().isEmpty()) {
            return book.getAuthors().iterator().next().getName();
        } else if (book.getAuthor() != null && !book.getAuthor().isEmpty()) {
            return book.getAuthor();
        }
        return "Unknown Author";
    }
}
