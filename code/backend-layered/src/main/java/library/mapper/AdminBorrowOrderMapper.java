package library.mapper;

import library.dto.admin.AdminBorrowOrderDetailDto;
import library.dto.admin.AdminBorrowOrderDto;
import library.dto.admin.BorrowItemDto;
import library.entity.BorrowOrderDetailEntity;
import library.entity.BorrowOrderEntity;
import library.entity.BorrowOrderStatus;
import library.entity.PaymentEntity;
import library.entity.PaymentStatus;
import library.entity.PaymentType;
import library.repository.BorrowOrderDetailRepository;
import library.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class AdminBorrowOrderMapper {

    private final BorrowOrderDetailRepository borrowOrderDetailRepository;
    private final PaymentRepository paymentRepository;

    public AdminBorrowOrderDto toAdminBorrowOrderDto(BorrowOrderEntity order) {
        if (order == null) return null;

        List<BorrowOrderDetailEntity> details = borrowOrderDetailRepository.findByBorrowOrderId(order.getId());

        String bookTitle = "N/A";
        String bookAuthor = "N/A";

        if (!details.isEmpty()) {
            BorrowOrderDetailEntity firstDetail = details.get(0);
            if (firstDetail.getBookCopy() != null && firstDetail.getBookCopy().getBook() != null) {
                bookTitle = firstDetail.getBookCopy().getBook().getTitle();
                if (firstDetail.getBookCopy().getBook().getAuthors() != null
                        && !firstDetail.getBookCopy().getBook().getAuthors().isEmpty()) {
                    bookAuthor = firstDetail.getBookCopy().getBook().getAuthors().iterator().next().getName();
                }
            }
        }

        Integer overdayCount = null;
        if (order.getStatus() == BorrowOrderStatus.BORROWED && order.getDueDate() != null) {
            long days = ChronoUnit.DAYS.between(order.getDueDate(), LocalDate.now());
            if (days > 0) overdayCount = (int) days;
        } else if (order.getStatus() == BorrowOrderStatus.OVERDUE && order.getDueDate() != null) {
            long days = ChronoUnit.DAYS.between(order.getDueDate(), LocalDate.now());
            if (days > 0) overdayCount = (int) days;
        }

        String customerName = "Unknown";
        String customerCode = "N/A";
        boolean isGuest = false;

        if (order.getCustomer() != null) {
            customerName = order.getCustomer().getFullName();
            customerCode = order.getCustomer().getLibraryCardNo() != null ? order.getCustomer().getLibraryCardNo()
                    : order.getCustomer().getPhone();
            isGuest = order.getCustomer().getUser() == null;
        }

        return AdminBorrowOrderDto.builder()
                .id(order.getOrderCode())
                .customerName(customerName)
                .customerCode(customerCode)
                .bookTitle(bookTitle)
                .bookAuthor(bookAuthor)
                .borrowDate(order.getBorrowDate())
                .dueDate(order.getDueDate())
                .status(order.getStatus())
                .overdayCount(overdayCount)
                .isGuest(isGuest)
                .build();
    }

    public AdminBorrowOrderDetailDto toAdminBorrowOrderDetailDto(BorrowOrderEntity order) {
        if (order == null) return null;

        List<BorrowOrderDetailEntity> details = borrowOrderDetailRepository.findByBorrowOrderId(order.getId());

        List<BorrowItemDto> items = details.stream().map(detail -> {
            String title = "N/A";
            String author = "N/A";
            String barcode = "N/A";

            if (detail.getBookCopy() != null) {
                barcode = detail.getBookCopy().getBarcode();
                if (detail.getBookCopy().getBook() != null) {
                    title = detail.getBookCopy().getBook().getTitle();
                    if (detail.getBookCopy().getBook().getAuthors() != null
                            && !detail.getBookCopy().getBook().getAuthors().isEmpty()) {
                        author = detail.getBookCopy().getBook().getAuthors().iterator().next().getName();
                    }
                }
            }

            return BorrowItemDto.builder()
                    .id(detail.getId())
                    .bookCopyId(detail.getBookCopy() != null ? detail.getBookCopy().getId() : null)
                    .bookTitle(title)
                    .bookAuthor(author)
                    .barcode(barcode)
                    .rentalFee(detail.getRentalFee())
                    .depositPrice(detail.getDepositPrice())
                    .status(detail.getStatus())
                    .build();
        }).collect(Collectors.toList());

        BigDecimal totalPaidOnline = BigDecimal.ZERO;
        List<PaymentEntity> successfulPayments = paymentRepository.findByBorrowOrderIdAndPaymentStatus(order.getId(), PaymentStatus.SUCCESS);
        for (PaymentEntity p : successfulPayments) {
            if (p.getPaymentType() == PaymentType.RENTAL_FEE || p.getPaymentType() == PaymentType.FINE) {
                totalPaidOnline = totalPaidOnline.add(p.getAmount());
            }
        }

        BigDecimal currentTotal = order.getTotalFee() != null ? order.getTotalFee() : (order.getSubtotalFee() != null ? order.getSubtotalFee() : BigDecimal.ZERO);
        BigDecimal actualAmountToPay = currentTotal.subtract(totalPaidOnline);
        if (actualAmountToPay.compareTo(BigDecimal.ZERO) < 0) {
            actualAmountToPay = BigDecimal.ZERO;
        }

        String customerName = "Unknown";
        String customerCode = "N/A";
        String customerPhone = "N/A";
        boolean isGuest = false;

        if (order.getCustomer() != null) {
            customerName = order.getCustomer().getFullName();
            customerCode = order.getCustomer().getLibraryCardNo() != null ? order.getCustomer().getLibraryCardNo()
                    : order.getCustomer().getPhone();
            customerPhone = order.getCustomer().getPhone() != null ? order.getCustomer().getPhone() : "N/A";
            isGuest = order.getCustomer().getUser() == null;
        }

        return AdminBorrowOrderDetailDto.builder()
                .id(order.getId())
                .orderCode(order.getOrderCode())
                .borrowDate(order.getBorrowDate())
                .pickupDate(order.getPickupDate())
                .dueDate(order.getDueDate())
                .status(order.getStatus())
                .subtotalFee(order.getSubtotalFee())
                .discountAmount(order.getDiscountAmount())
                .totalFee(order.getTotalFee())
                .totalDeposit(order.getTotalDeposit())
                .totalPaidOnline(totalPaidOnline)
                .actualAmountToPay(actualAmountToPay)
                .customerName(customerName)
                .customerCode(customerCode)
                .customerPhone(customerPhone)
                .isGuest(isGuest)
                .items(items)
                .build();
    }
}
