package library.service.impl.helper;

import library.entity.AssistantEntity;
import library.entity.BookCopyEntity;
import library.entity.BookCopyStatus;
import library.entity.BookReturnDetailEntity;
import library.entity.BookReturnEntity;
import library.entity.BorrowOrderDetailEntity;
import library.entity.BorrowOrderDetailStatus;
import library.entity.BorrowOrderEntity;
import library.entity.BorrowOrderStatus;
import library.entity.ConditionStatus;
import library.entity.FineEntity;
import library.entity.FineStatus;
import library.repository.BookCopyRepository;
import library.repository.BorrowOrderDetailRepository;
import library.repository.BorrowOrderRepository;
import library.repository.FineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
public class BookReturnPaymentHelper {

    private final FineRepository fineRepository;
    private final BorrowOrderDetailRepository borrowOrderDetailRepository;
    private final BookCopyRepository bookCopyRepository;
    private final BorrowOrderRepository borrowOrderRepository;

    public void applyImmediateReturnStatuses(BorrowOrderEntity borrowOrder, List<BookReturnDetailEntity> returnDetails, List<BookCopyEntity> copiesToUpdate, List<BorrowOrderDetailEntity> detailsToUpdate) {
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
    }

    public FineEntity createFineRecord(BigDecimal totalFineAmount, BorrowOrderEntity borrowOrder, BookReturnEntity bookReturn, boolean requiresPayment, AssistantEntity assistant) {
        if (totalFineAmount.compareTo(BigDecimal.ZERO) > 0) {
            FineEntity fine = FineEntity.builder()
                    .customer(borrowOrder.getCustomer())
                    .bookReturn(bookReturn)
                    .amount(totalFineAmount)
                    .status(requiresPayment ? FineStatus.UNPAID : FineStatus.PAID)
                    .processedBy(assistant)
                    .build();
            return fineRepository.save(fine);
        }
        return null;
    }

    public BigDecimal calculateAmountToPayForReturn(BookReturnEntity bookReturn) {
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
}
