package library.service.impl;

import library.common.exception.CustomBusinessException;
import library.dto.admin.returnbook.AdminReturnBookRequestDto;
import library.dto.admin.returnbook.AdminReturnBookResponseDto;
import library.dto.admin.returnbook.BookReturnDetailRequestDto;

import library.entity.*;
import library.repository.*;
import library.service.BookReturnService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookReturnServiceImpl implements BookReturnService {

    private final BorrowOrderRepository borrowOrderRepository;
    private final BorrowOrderDetailRepository borrowOrderDetailRepository;
    private final BookReturnRepository bookReturnRepository;
    private final FineRepository fineRepository;
    private final UserRepository userRepository;
    private final AssistantRepository assistantRepository;
    private final BookCopyRepository bookCopyRepository;
    private final library.service.VnPayService vnPayService;
    private final library.repository.PaymentRepository paymentRepository;
    private final library.service.FeeCalculatorService feeCalculatorService;
    private final library.service.CacheInvalidationService cacheInvalidationService;
    private final library.mapper.BookReturnMapper bookReturnMapper;
    private final library.repository.ReservationRepository reservationRepository;
    private final library.service.EmailService emailService;

    // Helpers
    private final library.service.impl.helper.BookReturnValidationHelper validationHelper;
    private final library.service.impl.helper.BookReturnPaymentHelper paymentHelper;

    @Override
    @Transactional
    public AdminReturnBookResponseDto returnBooks(AdminReturnBookRequestDto requestDto, String assistantUsername) {
        // 1. Find Borrow Order
        BorrowOrderEntity borrowOrder = validationHelper.validateAndGetBorrowOrder(requestDto.getBorrowOrderId());

        // 2. Find Assistant
        AssistantEntity assistant = validationHelper.validateAndGetAssistant(assistantUsername);

        // 3. Find active policy or create default if not exists
        long overdueDays = 0;
        if (borrowOrder.getDueDate() != null && LocalDate.now().isAfter(borrowOrder.getDueDate())) {
            overdueDays = ChronoUnit.DAYS.between(borrowOrder.getDueDate(), LocalDate.now());
        }

        BigDecimal totalConditionFine = BigDecimal.ZERO;
        BigDecimal totalOverdueFine = BigDecimal.ZERO;
        BigDecimal thisReturnRentalFee = BigDecimal.ZERO;
        BigDecimal thisReturnDeposit = BigDecimal.ZERO;

        // Create BookReturnEntity first
        BookReturnEntity bookReturn = BookReturnEntity.builder()
                .borrowOrder(borrowOrder)
                .assistant(assistant)
                .returnDate(LocalDateTime.now())
                .overdueDays((int) overdueDays)
                .note(requestDto.getGeneralNote())
                .details(new ArrayList<>())
                .build();

        List<BorrowOrderDetailEntity> detailsToUpdate = new ArrayList<>();
        List<BookCopyEntity> copiesToUpdate = new ArrayList<>();
        List<BookReturnDetailEntity> returnDetails = new ArrayList<>();

        for (BookReturnDetailRequestDto detailReq : requestDto.getDetails()) {
            BookCopyEntity bookCopy = bookCopyRepository.findById(detailReq.getBookCopyId())
                    .orElseThrow(() -> new CustomBusinessException("Book copy not found: " + detailReq.getBookCopyId(),
                            HttpStatus.NOT_FOUND));

            BorrowOrderDetailEntity orderDetail = borrowOrder.getOrderDetails().stream()
                    .filter(od -> od.getBookCopy().getId().equals(bookCopy.getId()))
                    .findFirst()
                    .orElseThrow(() -> new CustomBusinessException("Book copy not found in this order",
                            HttpStatus.NOT_FOUND));

            if (orderDetail.getStatus() != BorrowOrderDetailStatus.BORROWING) {
                throw new CustomBusinessException("Book copy has already been returned or lost/damaged",
                        HttpStatus.BAD_REQUEST);
            }

            BigDecimal conditionFine = BigDecimal.ZERO;
            BigDecimal overdueFinePerBook = BigDecimal.ZERO;

            if (overdueDays > 0) {
                // Dùng FeeCalculatorService để tính phí phạt trễ hạn
                overdueFinePerBook = feeCalculatorService.calculateOverdueFee(borrowOrder.getDueDate(), LocalDate.now());
            }
            totalOverdueFine = totalOverdueFine.add(overdueFinePerBook);

            thisReturnRentalFee = thisReturnRentalFee
                    .add(orderDetail.getRentalFee() != null ? orderDetail.getRentalFee() : BigDecimal.ZERO);
            thisReturnDeposit = thisReturnDeposit
                    .add(orderDetail.getDepositPrice() != null ? orderDetail.getDepositPrice() : BigDecimal.ZERO);

            BigDecimal depositPrice = bookCopy.getBook().getDepositPrice() != null
                    ? bookCopy.getBook().getDepositPrice()
                    : BigDecimal.ZERO;
            conditionFine = feeCalculatorService.calculateDamageFee(depositPrice, detailReq.getConditionStatus());

            totalConditionFine = totalConditionFine.add(conditionFine);

            BookReturnDetailEntity returnDetail = BookReturnDetailEntity.builder()
                    .bookReturn(bookReturn)
                    .bookCopy(bookCopy)
                    .conditionStatus(detailReq.getConditionStatus())
                    .fineAmount(conditionFine.add(overdueFinePerBook))
                    .note(detailReq.getNote())
                    .build();

            returnDetails.add(returnDetail);
            detailsToUpdate.add(orderDetail);
            copiesToUpdate.add(bookCopy);
        }

        bookReturn.getDetails().addAll(returnDetails);

        BigDecimal totalFineAmount = totalOverdueFine.add(totalConditionFine);
        bookReturn.setTotalFineAmount(totalFineAmount);

        BigDecimal totalAmountToPay = thisReturnRentalFee.add(totalFineAmount).subtract(thisReturnDeposit);
        boolean requiresPayment = totalAmountToPay.compareTo(BigDecimal.ZERO) > 0;

        if (!requiresPayment) {
            paymentHelper.applyImmediateReturnStatuses(borrowOrder, returnDetails, copiesToUpdate, detailsToUpdate);
        }

        bookReturnRepository.save(bookReturn);

        FineEntity fine = paymentHelper.createFineRecord(totalFineAmount, borrowOrder, bookReturn, requiresPayment,
                assistant);
        cacheInvalidationService.evictBookCaches();

        return bookReturnMapper.toAdminReturnBookResponseDto(bookReturn, fine);
    }

    @Override
    @Transactional
    public String generateVnPayUrl(Integer bookReturnId, String ipAddress) {
        BookReturnEntity bookReturn = bookReturnRepository.findById(bookReturnId)
                .orElseThrow(() -> new CustomBusinessException("Book return not found", HttpStatus.NOT_FOUND));

        BorrowOrderEntity order = bookReturn.getBorrowOrder();

        BigDecimal totalAmountToPay = paymentHelper.calculateAmountToPayForReturn(bookReturn);

        if (totalAmountToPay.compareTo(BigDecimal.ZERO) <= 0) {
            throw new CustomBusinessException("Không có khoản phí nào cần thanh toán", HttpStatus.BAD_REQUEST);
        }

        FineEntity fine = fineRepository.findByBookReturnId(bookReturnId).stream().findFirst().orElse(null);
        Integer fineId = fine != null ? fine.getId() : null;

        String txnRef = "FINE_" + bookReturnId + "_" + System.currentTimeMillis();
        String orderInfo = "Thanh toan phi tra sach cho don " + order.getOrderCode();

        library.entity.PaymentEntity payment = library.entity.PaymentEntity.builder()
                .borrowOrder(order)
                .fineId(fineId)
                .bookReturnId(bookReturnId)
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
    public void confirmCashPayment(Integer bookReturnId, String assistantUsername) {
        BookReturnEntity bookReturn = bookReturnRepository.findById(bookReturnId)
                .orElseThrow(() -> new CustomBusinessException("Book return not found", HttpStatus.NOT_FOUND));

        UserEntity user = userRepository.findByEmail(assistantUsername)
                .orElseThrow(() -> new CustomBusinessException("User not found: " + assistantUsername,
                        HttpStatus.NOT_FOUND));
        AssistantEntity assistant = assistantRepository.findByUserId(user.getId()).orElse(null);

        BorrowOrderEntity order = bookReturn.getBorrowOrder();

        BigDecimal totalAmountToPay = paymentHelper.calculateAmountToPayForReturn(bookReturn);

        if (totalAmountToPay.compareTo(BigDecimal.ZERO) == 0) {
            return; // Nothing to pay or refund
        }

        FineEntity fine = fineRepository.findByBookReturnId(bookReturnId).stream().findFirst().orElse(null);
        Integer fineId = fine != null ? fine.getId() : null;

        // Check if there is already a successful payment for this return
        boolean alreadyPaid = false;
        if (totalAmountToPay.compareTo(BigDecimal.ZERO) < 0) {
            String prefix = "CASH_REFUND_" + bookReturnId + "_";
            alreadyPaid = paymentRepository.findAll().stream()
                    .anyMatch(p -> p.getTransactionCode() != null && p.getTransactionCode().startsWith(prefix)
                            && p.getPaymentStatus() == PaymentStatus.SUCCESS);
        } else if (fine != null && fine.getStatus() == FineStatus.PAID) {
            alreadyPaid = true;
        }

        if (alreadyPaid) {
            throw new CustomBusinessException("Thanh toán hoặc hoàn tiền cho lượt trả sách này đã được xác nhận",
                    HttpStatus.BAD_REQUEST);
        }

        String txnRef = (totalAmountToPay.compareTo(BigDecimal.ZERO) > 0 ? "CASH_FINE_" : "CASH_REFUND_") + bookReturnId
                + "_" + System.currentTimeMillis();

        PaymentType paymentType = totalAmountToPay.compareTo(BigDecimal.ZERO) > 0 ? PaymentType.FINE
                : PaymentType.REFUND;
        BigDecimal amountToRecord = totalAmountToPay.abs();

        library.entity.PaymentEntity payment = library.entity.PaymentEntity.builder()
                .borrowOrder(order)
                .fineId(fineId)
                .paymentMethod(library.entity.PaymentMethod.CASH)
                .transactionCode(txnRef)
                .amount(amountToRecord)
                .paymentType(paymentType)
                .paymentStatus(library.entity.PaymentStatus.SUCCESS)
                .paymentDate(LocalDateTime.now())
                .processedBy(assistant != null ? assistant.getId() : null)
                .build();

        paymentRepository.save(payment);

        if (fine != null && paymentType == PaymentType.FINE) {
            fine.setStatus(FineStatus.PAID);
            fine.setPaidAt(LocalDateTime.now());
            fineRepository.save(fine);
        }

        if (paymentType == PaymentType.FINE) {
            finalizeReturnStatus(bookReturnId);
        }
        cacheInvalidationService.evictBookCaches();
    }

    @Override
    @Transactional
    public void finalizeReturnStatus(Integer bookReturnId) {
        BookReturnEntity bookReturn = bookReturnRepository.findById(bookReturnId)
                .orElseThrow(() -> new CustomBusinessException("Book return not found", HttpStatus.NOT_FOUND));
        BorrowOrderEntity borrowOrder = bookReturn.getBorrowOrder();

        if (bookReturn.getDetails() != null) {
            for (BookReturnDetailEntity rd : bookReturn.getDetails()) {
                BookCopyEntity bc = rd.getBookCopy();
                BorrowOrderDetailEntity od = borrowOrder.getOrderDetails().stream()
                        .filter(detail -> detail.getBookCopy().getId().equals(bc.getId()))
                        .findFirst().orElse(null);

                if (od != null && od.getStatus() == BorrowOrderDetailStatus.BORROWING) {
                        od.setStatus(BorrowOrderDetailStatus.RETURNED);
                    if (rd.getConditionStatus() == ConditionStatus.NORMAL) {

                        // Check if there's any pending reservation for this book
                        java.util.Optional<ReservationEntity> nextReservation = reservationRepository.findFirstByBookIdAndStatusOrderByReservationDateAsc(
                                bc.getBook().getId(), ReservationStatus.PENDING);
                                
                        if (nextReservation.isPresent()) {
                            bc.setStatus(BookCopyStatus.RESERVED);
                            
                            ReservationEntity reservation = nextReservation.get();
                            reservation.setStatus(ReservationStatus.NOTIFIED);
                            reservation.setNotifiedAt(LocalDateTime.now());
                            reservationRepository.save(reservation);
                            
                            // Send email
                            String toEmail = null;
                            String fullName = null;
                            if (reservation.getCustomer() != null) {
                                fullName = reservation.getCustomer().getFullName();
                                if (reservation.getCustomer().getUser() != null && reservation.getCustomer().getUser().getEmail() != null) {
                                    toEmail = reservation.getCustomer().getUser().getEmail();
                                } else {
                                    toEmail = reservation.getCustomer().getEmail();
                                }
                            }
                            
                            if (toEmail != null && !toEmail.isEmpty()) {
                                LocalDate holdUntil = LocalDate.now().plusDays(3); // Giữ sách trong 3 ngày
                                emailService.sendReservationAvailableEmail(toEmail, fullName, bc.getBook().getTitle(), holdUntil);
                            }
                        } else {
                            // If no reservation, just make it available
                            bc.setStatus(BookCopyStatus.AVAILABLE);
                        }

                    } else if (rd.getConditionStatus() == ConditionStatus.DAMAGED) {
                        bc.setStatus(BookCopyStatus.MAINTENANCE);
                        od.setStatus(BorrowOrderDetailStatus.DAMAGED);
                    } else if (rd.getConditionStatus() == ConditionStatus.LOST) {
                        bc.setStatus(BookCopyStatus.LOST);
                        od.setStatus(BorrowOrderDetailStatus.LOST);
                    }
                    borrowOrderDetailRepository.save(od);
                    bookCopyRepository.save(bc);
                }
            }
        }

        long unreturnedCount = borrowOrder.getOrderDetails().stream()
                .filter(od -> od.getStatus() != BorrowOrderDetailStatus.RETURNED
                        && od.getStatus() != BorrowOrderDetailStatus.LOST
                        && od.getStatus() != BorrowOrderDetailStatus.DAMAGED)
                .count();

        if (unreturnedCount == 0) {
            borrowOrder.setStatus(BorrowOrderStatus.RETURNED);
            borrowOrder.setActualReturnDate(LocalDate.now());
        } else {
            borrowOrder.setStatus(BorrowOrderStatus.PARTIALLY_RETURNED);
        }
        borrowOrderRepository.save(borrowOrder);
        cacheInvalidationService.evictBookCaches();
    }

    @Override
    @Transactional
    public void completeVnPayFinePayment(Integer fineId) {
        FineEntity fine = fineRepository.findById(fineId)
                .orElseThrow(() -> new CustomBusinessException("Fine not found: " + fineId, HttpStatus.NOT_FOUND));

        if (fine.getStatus() == FineStatus.PAID) {
            return; // Already processed
        }

        fine.setStatus(FineStatus.PAID);
        fine.setPaidAt(LocalDateTime.now());
        fineRepository.save(fine);

        if (fine.getBookReturn() != null) {
            finalizeReturnStatus(fine.getBookReturn().getId());
        }
        cacheInvalidationService.evictBookCaches();
    }
}
