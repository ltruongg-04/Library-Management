package library.service.impl;

import library.common.exception.CustomBusinessException;
import library.dto.admin.returnbook.AdminReturnBookRequestDto;
import library.dto.admin.returnbook.AdminReturnBookResponseDto;
import library.dto.admin.returnbook.BookReturnDetailRequestDto;
import library.dto.admin.returnbook.FineDto;
import library.dto.admin.returnbook.ReturnDetailDto;
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
                .orElseThrow(() -> new CustomBusinessException("Borrow order not found: " + requestDto.getBorrowOrderId(), HttpStatus.NOT_FOUND));

        if (borrowOrder.getStatus() != BorrowOrderStatus.BORROWED && borrowOrder.getStatus() != BorrowOrderStatus.OVERDUE && borrowOrder.getStatus() != BorrowOrderStatus.PARTIALLY_RETURNED) {
            throw new CustomBusinessException("Borrow order is not in an active status (BORROWED, OVERDUE, or PARTIALLY_RETURNED)", HttpStatus.BAD_REQUEST);
        }

        // 2. Find Assistant
        UserEntity user = userRepository.findByEmail(assistantUsername)
                .orElseThrow(() -> new CustomBusinessException("User not found: " + assistantUsername, HttpStatus.NOT_FOUND));
        AssistantEntity assistant = assistantRepository.findByUserId(user.getId()).orElse(null);
        if (assistant == null && user.getRole() != UserEntity.Role.ADMIN) {
            throw new CustomBusinessException("Assistant not found for user: " + assistantUsername, HttpStatus.FORBIDDEN);
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

        BigDecimal totalOverdueFine = BigDecimal.ZERO;
        BigDecimal totalConditionFine = BigDecimal.ZERO;
        BigDecimal thisReturnRentalFee = BigDecimal.ZERO;
        BigDecimal thisReturnDeposit = BigDecimal.ZERO;

        // Create BookReturnEntity first
        BookReturnEntity bookReturn = BookReturnEntity.builder()
                .borrowOrder(borrowOrder)
                .assistant(assistant)
                .returnDate(LocalDateTime.now())
                .overdueDays(overdueDays)
                .note(requestDto.getGeneralNote())
                .details(new ArrayList<>())
                .build();

        List<BorrowOrderDetailEntity> detailsToUpdate = new ArrayList<>();
        List<BookCopyEntity> copiesToUpdate = new ArrayList<>();
        List<BookReturnDetailEntity> returnDetails = new ArrayList<>();

        // Tính rental fee thực tế
        LocalDate feeStartDate = borrowOrder.getBorrowDate() != null ? borrowOrder.getBorrowDate() : borrowOrder.getPickupDate();
        long actualDays = feeStartDate != null ? java.time.temporal.ChronoUnit.DAYS.between(feeStartDate, LocalDate.now()) : 1;
        if (actualDays <= 0) actualDays = 1;
        BigDecimal actualRentalFeePerBook = BigDecimal.valueOf(actualDays * 5000L);

        for (BookReturnDetailRequestDto detailReq : requestDto.getDetails()) {
            BookCopyEntity bookCopy = bookCopyRepository.findById(detailReq.getBookCopyId())
                    .orElseThrow(() -> new CustomBusinessException("Book copy not found: " + detailReq.getBookCopyId(), HttpStatus.NOT_FOUND));

            BorrowOrderDetailEntity orderDetail = borrowOrder.getOrderDetails().stream()
                    .filter(od -> od.getBookCopy().getId().equals(bookCopy.getId()))
                    .findFirst()
                    .orElseThrow(() -> new CustomBusinessException("Book copy not found in this order", HttpStatus.NOT_FOUND));

            if (orderDetail.getStatus() != BorrowOrderDetailStatus.BORROWING) {
                throw new CustomBusinessException("Book copy has already been returned or lost/damaged", HttpStatus.BAD_REQUEST);
            }

            BigDecimal conditionFine = BigDecimal.ZERO;
            BigDecimal overdueFinePerBook = BigDecimal.ZERO;

            if (overdueDays > 0) {
                overdueFinePerBook = policy.getOverdueFinePerDay().multiply(new BigDecimal(overdueDays));
            }
            totalOverdueFine = totalOverdueFine.add(overdueFinePerBook);

            // Cập nhật rental fee thực tế vào order detail
            orderDetail.setRentalFee(actualRentalFeePerBook);
            borrowOrderDetailRepository.save(orderDetail);

            thisReturnRentalFee = thisReturnRentalFee.add(orderDetail.getRentalFee() != null ? orderDetail.getRentalFee() : BigDecimal.ZERO);
            thisReturnDeposit = thisReturnDeposit.add(orderDetail.getDepositPrice() != null ? orderDetail.getDepositPrice() : BigDecimal.ZERO);

            if (detailReq.getConditionStatus() == ConditionStatus.DAMAGED) {
                BigDecimal depositPrice = bookCopy.getBook().getDepositPrice() != null ? bookCopy.getBook().getDepositPrice() : BigDecimal.ZERO;
                conditionFine = depositPrice.multiply(policy.getDamageFeePercent());
            } else if (detailReq.getConditionStatus() == ConditionStatus.LOST) {
                BigDecimal depositPrice = bookCopy.getBook().getDepositPrice() != null ? bookCopy.getBook().getDepositPrice() : BigDecimal.ZERO;
                conditionFine = depositPrice.multiply(policy.getLostBookMultiplier());
            }

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
            // Apply statuses immediately because no payment is required
            for (int i = 0; i < returnDetails.size(); i++) {
                BookReturnDetailEntity rd = returnDetails.get(i);
                BookCopyEntity bc = copiesToUpdate.get(i);
                BorrowOrderDetailEntity od = detailsToUpdate.get(i);

                if (rd.getConditionStatus() == ConditionStatus.NORMAL) {
                    bc.setStatus(BookCopyStatus.AVAILABLE);
                    od.setStatus(BorrowOrderDetailStatus.RETURNED);
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
        } else {
            // Vẫn cần lưu lại subtotalFee/totalFee cho order dù có hay không thanh toán ngay
            BigDecimal totalOrderRentalFee = actualRentalFeePerBook.multiply(new BigDecimal(borrowOrder.getOrderDetails().size()));
            borrowOrder.setSubtotalFee(totalOrderRentalFee);
            
            // Tính tổng overdue cho toàn bộ order
            BigDecimal unpaidOverdueFee = BigDecimal.ZERO;
            // (Chỉ đơn giản hóa cập nhật totalFee = subtotalFee nếu không tính kỹ overdue chung)
            // Ta set totalFee tạm thời, việc confirm payment sẽ tính sau.
            borrowOrder.setTotalFee(totalOrderRentalFee);
            borrowOrderRepository.save(borrowOrder);
        }

        bookReturnRepository.save(bookReturn);

        FineEntity fine = null;
        if (totalFineAmount.compareTo(BigDecimal.ZERO) > 0) {
            fine = FineEntity.builder()
                    .customer(borrowOrder.getCustomer())
                    .bookReturn(bookReturn)
                    .amount(totalFineAmount)
                    .status(requiresPayment ? FineStatus.UNPAID : FineStatus.PAID)
                    .processedBy(assistant)
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

        BigDecimal thisReturnRentalFee = BigDecimal.ZERO;
        BigDecimal thisReturnDeposit = BigDecimal.ZERO;
        java.util.List<ReturnDetailDto> detailsDto = new java.util.ArrayList<>();

        if (bookReturn.getDetails() != null) {
            for (BookReturnDetailEntity detail : bookReturn.getDetails()) {
                ReturnDetailDto dto = new ReturnDetailDto();
                dto.setBookTitle(detail.getBookCopy().getBook().getTitle());
                dto.setBarcode(detail.getBookCopy().getBarcode());
                dto.setConditionStatus(detail.getConditionStatus());
                dto.setFineAmount(detail.getFineAmount());
                dto.setNote(detail.getNote());
                detailsDto.add(dto);

                for (BorrowOrderDetailEntity od : order.getOrderDetails()) {
                    if (od.getBookCopy().getId().equals(detail.getBookCopy().getId())) {
                        thisReturnRentalFee = thisReturnRentalFee.add(od.getRentalFee() != null ? od.getRentalFee() : BigDecimal.ZERO);
                        thisReturnDeposit = thisReturnDeposit.add(od.getDepositPrice() != null ? od.getDepositPrice() : BigDecimal.ZERO);
                        break;
                    }
                }
            }
        }
        
        BigDecimal fineAmt = bookReturn.getTotalFineAmount() != null ? bookReturn.getTotalFineAmount() : BigDecimal.ZERO;

        response.setSubtotalFee(thisReturnRentalFee);
        response.setTotalDeposit(thisReturnDeposit);
        response.setTotalAmountToPay(thisReturnRentalFee.add(fineAmt).subtract(thisReturnDeposit));
        response.setDetails(detailsDto);

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

    private BigDecimal calculateAmountToPayForReturn(BookReturnEntity bookReturn) {
        BigDecimal thisReturnRentalFee = BigDecimal.ZERO;
        BigDecimal thisReturnDeposit = BigDecimal.ZERO;
        BorrowOrderEntity order = bookReturn.getBorrowOrder();

        if (bookReturn.getDetails() != null) {
            for (BookReturnDetailEntity detail : bookReturn.getDetails()) {
                for (BorrowOrderDetailEntity od : order.getOrderDetails()) {
                    if (od.getBookCopy().getId().equals(detail.getBookCopy().getId())) {
                        thisReturnRentalFee = thisReturnRentalFee.add(od.getRentalFee() != null ? od.getRentalFee() : BigDecimal.ZERO);
                        thisReturnDeposit = thisReturnDeposit.add(od.getDepositPrice() != null ? od.getDepositPrice() : BigDecimal.ZERO);
                        break;
                    }
                }
            }
        }
        BigDecimal fineAmt = bookReturn.getTotalFineAmount() != null ? bookReturn.getTotalFineAmount() : BigDecimal.ZERO;
        return thisReturnRentalFee.add(fineAmt).subtract(thisReturnDeposit);
    }

    @Override
    @Transactional
    public String generateVnPayUrl(Integer bookReturnId, String ipAddress) {
        BookReturnEntity bookReturn = bookReturnRepository.findById(bookReturnId)
                .orElseThrow(() -> new CustomBusinessException("Book return not found", HttpStatus.NOT_FOUND));

        BorrowOrderEntity order = bookReturn.getBorrowOrder();
        
        BigDecimal totalAmountToPay = calculateAmountToPayForReturn(bookReturn);

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
                .orElseThrow(() -> new CustomBusinessException("User not found: " + assistantUsername, HttpStatus.NOT_FOUND));
        AssistantEntity assistant = assistantRepository.findByUserId(user.getId()).orElse(null);

        BorrowOrderEntity order = bookReturn.getBorrowOrder();
        
        BigDecimal totalAmountToPay = calculateAmountToPayForReturn(bookReturn);

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
                    .anyMatch(p -> p.getTransactionCode() != null && p.getTransactionCode().startsWith(prefix) && p.getPaymentStatus() == PaymentStatus.SUCCESS);
        } else if (fine != null && fine.getStatus() == FineStatus.PAID) {
            alreadyPaid = true;
        }

        if (alreadyPaid) {
            throw new CustomBusinessException("Thanh toán hoặc hoàn tiền cho lượt trả sách này đã được xác nhận", HttpStatus.BAD_REQUEST);
        }

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
                    if (rd.getConditionStatus() == ConditionStatus.NORMAL) {
                        bc.setStatus(BookCopyStatus.AVAILABLE);
                        od.setStatus(BorrowOrderDetailStatus.RETURNED);
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
                .filter(od -> od.getStatus() != BorrowOrderDetailStatus.RETURNED && od.getStatus() != BorrowOrderDetailStatus.LOST && od.getStatus() != BorrowOrderDetailStatus.DAMAGED)
                .count();

        if (unreturnedCount == 0) {
            borrowOrder.setStatus(BorrowOrderStatus.RETURNED);
            borrowOrder.setActualReturnDate(LocalDate.now());
        } else {
            borrowOrder.setStatus(BorrowOrderStatus.PARTIALLY_RETURNED);
        }
        borrowOrderRepository.save(borrowOrder);
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
    }
}
