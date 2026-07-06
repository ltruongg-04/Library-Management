package library.service.impl;

import library.dto.admin.returnbook.AdminReturnBookRequestDto;
import library.dto.admin.returnbook.AdminReturnBookResponseDto;
import library.dto.admin.returnbook.BookReturnDetailRequestDto;
import library.dto.admin.returnbook.FineDto;
import library.entity.*;
import library.repository.*;
import library.service.BookReturnService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class BookReturnServiceImpl implements BookReturnService {

    private final BorrowOrderRepository borrowOrderRepository;
    private final BorrowOrderDetailRepository borrowOrderDetailRepository;
    private final BookReturnRepository bookReturnRepository;
    private final FineRepository fineRepository;
    private final BorrowingPolicyRepository borrowingPolicyRepository;
    private final UserRepository userRepository;
    private final AssistantRepository assistantRepository;
    private final BookCopyRepository bookCopyRepository;
    private final library.service.VnPayService vnPayService;
    private final library.repository.PaymentRepository paymentRepository;

    @Override
    @Transactional
    public AdminReturnBookResponseDto returnBooks(AdminReturnBookRequestDto requestDto, String assistantUsername) {
        // 1. Find Borrow Order
        BorrowOrderEntity borrowOrder = borrowOrderRepository.findById(requestDto.getBorrowOrderId())
                .orElseThrow(() -> new RuntimeException("Borrow order not found: " + requestDto.getBorrowOrderId()));

        if (borrowOrder.getStatus() != BorrowOrderStatus.BORROWED && borrowOrder.getStatus() != BorrowOrderStatus.OVERDUE && borrowOrder.getStatus() != BorrowOrderStatus.PARTIALLY_RETURNED) {
            throw new RuntimeException("Borrow order is not in an active status (BORROWED, OVERDUE, or PARTIALLY_RETURNED)");
        }

        // 2. Find Assistant
        UserEntity user = userRepository.findByEmail(assistantUsername)
                .orElseThrow(() -> new RuntimeException("User not found: " + assistantUsername));
        AssistantEntity assistant = assistantRepository.findByUserId(user.getId()).orElse(null);
        if (assistant == null && user.getRole() != UserEntity.Role.ADMIN) {
            throw new RuntimeException("Assistant not found for user: " + assistantUsername);
        }

        // 3. Find active policy or create default if not exists
        BorrowingPolicyEntity policy = borrowingPolicyRepository.findAll().stream().findFirst()
                .orElseGet(() -> {
                    BorrowingPolicyEntity defaultPolicy = BorrowingPolicyEntity.builder()
                            .maxBooks(5)
                            .maxBorrowDays(14)
                            .overdueFinePerDay(new java.math.BigDecimal("5000"))
                            .lostBookMultiplier(new java.math.BigDecimal("2.0"))
                            .damageFeePercent(new java.math.BigDecimal("0.5"))
                            .maxExtensions(2)
                            .build();
                    return borrowingPolicyRepository.save(defaultPolicy);
                });

        // 4. Calculate overdue days and overdue fine
        LocalDate dueDate = borrowOrder.getDueDate();
        LocalDate returnDate = LocalDate.now();
        long daysBetween = ChronoUnit.DAYS.between(dueDate, returnDate);
        int overdueDays = Math.max(0, (int) daysBetween);

        int returnedBooksCount = requestDto.getDetails().size();
        BigDecimal overdueFine = BigDecimal.ZERO;
        if (overdueDays > 0) {
            overdueFine = policy.getOverdueFinePerDay()
                    .multiply(new BigDecimal(overdueDays))
                    .multiply(new BigDecimal(returnedBooksCount));
        }

        BigDecimal totalConditionFine = BigDecimal.ZERO;

        // Create BookReturnEntity
        BookReturnEntity bookReturn = BookReturnEntity.builder()
                .borrowOrder(borrowOrder)
                .assistant(assistant)
                .returnDate(LocalDateTime.now())
                .overdueDays(overdueDays)
                .note(requestDto.getGeneralNote())
                .details(new ArrayList<>())
                .build();

        // Process details
        for (BookReturnDetailRequestDto detailReq : requestDto.getDetails()) {
            BookCopyEntity bookCopy = bookCopyRepository.findById(detailReq.getBookCopyId())
                    .orElseThrow(() -> new RuntimeException("Book copy not found: " + detailReq.getBookCopyId()));

            BorrowOrderDetailEntity orderDetail = borrowOrder.getOrderDetails().stream()
                    .filter(od -> od.getBookCopy().getId().equals(bookCopy.getId()))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Book copy not found in this order"));

            BigDecimal conditionFine = BigDecimal.ZERO;

            if (detailReq.getConditionStatus() == ConditionStatus.NORMAL) {
                bookCopy.setStatus(BookCopyStatus.AVAILABLE);
                orderDetail.setStatus(BorrowOrderDetailStatus.RETURNED);
            } else if (detailReq.getConditionStatus() == ConditionStatus.DAMAGED) {
                bookCopy.setStatus(BookCopyStatus.MAINTENANCE);
                orderDetail.setStatus(BorrowOrderDetailStatus.DAMAGED);
                BigDecimal depositPrice = bookCopy.getBook().getDepositPrice() != null ? bookCopy.getBook().getDepositPrice() : BigDecimal.ZERO;
                conditionFine = depositPrice.multiply(policy.getDamageFeePercent());
            } else if (detailReq.getConditionStatus() == ConditionStatus.LOST) {
                bookCopy.setStatus(BookCopyStatus.LOST);
                orderDetail.setStatus(BorrowOrderDetailStatus.LOST);
                BigDecimal depositPrice = bookCopy.getBook().getDepositPrice() != null ? bookCopy.getBook().getDepositPrice() : BigDecimal.ZERO;
                conditionFine = depositPrice.multiply(policy.getLostBookMultiplier());
            }

            totalConditionFine = totalConditionFine.add(conditionFine);

            BookReturnDetailEntity returnDetail = BookReturnDetailEntity.builder()
                    .bookReturn(bookReturn)
                    .bookCopy(bookCopy)
                    .conditionStatus(detailReq.getConditionStatus())
                    .fineAmount(conditionFine)
                    .note(detailReq.getNote())
                    .build();

            bookReturn.getDetails().add(returnDetail);
            
            borrowOrderDetailRepository.save(orderDetail);
            bookCopyRepository.save(bookCopy);
        }

        BigDecimal totalFineAmount = overdueFine.add(totalConditionFine);
        bookReturn.setTotalFineAmount(totalFineAmount);
        bookReturnRepository.save(bookReturn);

        // Calculate how many books are still not returned
        long unreturnedCount = borrowOrder.getOrderDetails().stream()
                .filter(od -> od.getStatus() != BorrowOrderDetailStatus.RETURNED && od.getStatus() != BorrowOrderDetailStatus.LOST && od.getStatus() != BorrowOrderDetailStatus.DAMAGED)
                .count();

        if (unreturnedCount == 0) {
            borrowOrder.setStatus(BorrowOrderStatus.RETURNED);
            borrowOrder.setActualReturnDate(LocalDate.now());
        } else {
            borrowOrder.setStatus(BorrowOrderStatus.PARTIALLY_RETURNED);
        }
        borrowOrderRepository.save(borrowOrder);

        FineEntity fine = null;
        if (totalFineAmount.compareTo(BigDecimal.ZERO) > 0) {
            fine = FineEntity.builder()
                    .customer(borrowOrder.getCustomer())
                    .bookReturn(bookReturn)
                    .amount(totalFineAmount)
                    .status(FineStatus.UNPAID)
                    .build();
            fineRepository.save(fine);
        }

        return mapToResponseDto(bookReturn, fine);
    }

    private AdminReturnBookResponseDto mapToResponseDto(BookReturnEntity bookReturn, FineEntity fine) {
        AdminReturnBookResponseDto response = new AdminReturnBookResponseDto();
        response.setBookReturnId(bookReturn.getId());
        response.setBorrowOrderId(bookReturn.getBorrowOrder().getId());
        response.setReturnDate(bookReturn.getReturnDate());
        response.setOverdueDays(bookReturn.getOverdueDays());
        response.setTotalFineAmount(bookReturn.getTotalFineAmount());
        response.setNote(bookReturn.getNote());

        BorrowOrderEntity order = bookReturn.getBorrowOrder();
        response.setOrderCode(order.getOrderCode());
        
        BigDecimal subtotalFee = order.getSubtotalFee() != null ? order.getSubtotalFee() : BigDecimal.ZERO;
        BigDecimal totalDeposit = order.getTotalDeposit() != null ? order.getTotalDeposit() : BigDecimal.ZERO;
        BigDecimal fineAmt = bookReturn.getTotalFineAmount() != null ? bookReturn.getTotalFineAmount() : BigDecimal.ZERO;

        response.setSubtotalFee(subtotalFee);
        response.setTotalDeposit(totalDeposit);
        response.setTotalAmountToPay(subtotalFee.add(fineAmt).subtract(totalDeposit));

        if (fine != null) {
            FineDto fineDto = new FineDto();
            fineDto.setId(fine.getId());
            fineDto.setCustomerId(fine.getCustomer().getId());
            fineDto.setAmount(fine.getAmount());
            fineDto.setStatus(fine.getStatus());
            fineDto.setCreatedAt(fine.getCreatedAt());
            response.setFine(fineDto);
        }

        return response;
    }

    @Override
    @Transactional
    public String generateVnPayUrl(Integer bookReturnId, String ipAddress) {
        BookReturnEntity bookReturn = bookReturnRepository.findById(bookReturnId)
                .orElseThrow(() -> new RuntimeException("Book return not found"));

        BorrowOrderEntity order = bookReturn.getBorrowOrder();
        
        BigDecimal subtotalFee = order.getSubtotalFee() != null ? order.getSubtotalFee() : BigDecimal.ZERO;
        BigDecimal totalDeposit = order.getTotalDeposit() != null ? order.getTotalDeposit() : BigDecimal.ZERO;
        BigDecimal fineAmt = bookReturn.getTotalFineAmount() != null ? bookReturn.getTotalFineAmount() : BigDecimal.ZERO;

        BigDecimal totalAmountToPay = subtotalFee.add(fineAmt).subtract(totalDeposit);

        if (totalAmountToPay.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Không có khoản phí nào cần thanh toán");
        }

        FineEntity fine = fineRepository.findByBookReturnId(bookReturnId).stream().findFirst().orElse(null);
        Integer fineId = fine != null ? fine.getId() : null;

        String txnRef = "FINE_" + bookReturnId + "_" + System.currentTimeMillis();
        String orderInfo = "Thanh toan phi tra sach cho don " + order.getOrderCode();

        library.entity.PaymentEntity payment = library.entity.PaymentEntity.builder()
                .borrowOrder(order)
                .fineId(fineId)
                .paymentMethod(library.entity.PaymentMethod.VNPAY)
                .transactionCode(txnRef)
                .amount(totalAmountToPay)
                .paymentType(library.entity.PaymentType.FINE)
                .paymentStatus(library.entity.PaymentStatus.PENDING)
                .build();
        paymentRepository.save(payment);
        return vnPayService.createPaymentUrl(txnRef, orderInfo, totalAmountToPay, ipAddress);
    }

    @Override
    @Transactional
    public void confirmCashPayment(Integer bookReturnId) {
        BookReturnEntity bookReturn = bookReturnRepository.findById(bookReturnId)
                .orElseThrow(() -> new RuntimeException("Book return not found"));

        BorrowOrderEntity order = bookReturn.getBorrowOrder();
        
        BigDecimal subtotalFee = order.getSubtotalFee() != null ? order.getSubtotalFee() : BigDecimal.ZERO;
        BigDecimal totalDeposit = order.getTotalDeposit() != null ? order.getTotalDeposit() : BigDecimal.ZERO;
        BigDecimal fineAmt = bookReturn.getTotalFineAmount() != null ? bookReturn.getTotalFineAmount() : BigDecimal.ZERO;

        BigDecimal totalAmountToPay = subtotalFee.add(fineAmt).subtract(totalDeposit);

        if (totalAmountToPay.compareTo(BigDecimal.ZERO) == 0) {
            return; // Nothing to pay or refund
        }

        FineEntity fine = fineRepository.findByBookReturnId(bookReturnId).stream().findFirst().orElse(null);
        Integer fineId = fine != null ? fine.getId() : null;

        String txnRef = (totalAmountToPay.compareTo(BigDecimal.ZERO) > 0 ? "CASH_FINE_" : "CASH_REFUND_") + bookReturnId + "_" + System.currentTimeMillis();

        PaymentType paymentType = totalAmountToPay.compareTo(BigDecimal.ZERO) > 0 ? PaymentType.FINE : PaymentType.REFUND;
        BigDecimal amountToRecord = totalAmountToPay.abs();

        library.entity.PaymentEntity payment = library.entity.PaymentEntity.builder()
                .borrowOrder(order)
                .fineId(fineId)
                .paymentMethod(library.entity.PaymentMethod.CASH)
                .transactionCode(txnRef)
                .amount(amountToRecord)
                .paymentType(paymentType)
                .paymentStatus(library.entity.PaymentStatus.SUCCESS)
                .build();

        paymentRepository.save(payment);

        if (fine != null && paymentType == PaymentType.FINE) {
            fine.setStatus(FineStatus.PAID);
            fineRepository.save(fine);
        }
    }
}
