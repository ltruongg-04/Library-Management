package library.service.impl.helper;

import library.common.exception.CustomBusinessException;
import library.entity.BorrowOrderDetailEntity;
import library.entity.BorrowOrderEntity;
import library.entity.BorrowOrderStatus;
import library.entity.ReservationStatus;
import library.entity.BorrowExtensionStatus;
import library.repository.BorrowExtensionRepository;
import library.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class BorrowOrderValidationHelper {

    private final ReservationRepository reservationRepository;
    private final BorrowExtensionRepository borrowExtensionRepository;
    private final library.service.FeeCalculatorService feeCalculatorService;

    public long validateBorrowDatesAndGetDays(LocalDate pickupDate, LocalDate returnDate) {
        LocalDate today = LocalDate.now();
        if (pickupDate.isBefore(today)) {
            throw new CustomBusinessException("Pickup date cannot be in the past", HttpStatus.BAD_REQUEST);
        }
        if (returnDate.isBefore(pickupDate)) {
            throw new CustomBusinessException("Return date must be after pickup date", HttpStatus.BAD_REQUEST);
        }

        long borrowDays = java.time.temporal.ChronoUnit.DAYS.between(pickupDate, returnDate);
        if (borrowDays == 0)
            borrowDays = 1; // Borrow and return same day counts as 1 day
        int maxBorrowDays = feeCalculatorService.getActivePolicy().getMaxBorrowDays() != null
                ? feeCalculatorService.getActivePolicy().getMaxBorrowDays()
                : 14;
        if (borrowDays > maxBorrowDays) {
            throw new CustomBusinessException("Thời gian mượn sách không được vượt quá " + maxBorrowDays + " ngày",
                    HttpStatus.BAD_REQUEST);
        }
        return borrowDays;
    }

    public void validateRenewalConditions(BorrowOrderEntity order) {
        if (order.getStatus() != BorrowOrderStatus.BORROWED && order.getStatus() != BorrowOrderStatus.OVERDUE) {
            throw new CustomBusinessException(
                    "Chỉ có thể gia hạn khi phiếu mượn đang ở trạng thái Đang mượn hoặc Quá hạn",
                    HttpStatus.BAD_REQUEST);
        }

        if (order.getOrderDetails() != null) {
            for (BorrowOrderDetailEntity detail : order.getOrderDetails()) {
                if (reservationRepository.existsByBookIdAndStatus(detail.getBookCopy().getBook().getId(),
                        ReservationStatus.PENDING)) {
                    throw new CustomBusinessException("Không thể gia hạn vì sách đang có người đặt giữ",
                            HttpStatus.BAD_REQUEST);
                }
            }
        }

        long extensionCount = borrowExtensionRepository.countByBorrowOrderIdAndStatus(order.getId(),
                BorrowExtensionStatus.APPROVED);
        int maxExtensions = feeCalculatorService.getActivePolicy().getMaxExtensions() != null
                ? feeCalculatorService.getActivePolicy().getMaxExtensions()
                : 2;
        if (extensionCount >= maxExtensions) {
            throw new CustomBusinessException("Phiếu mượn đã vượt quá số lần gia hạn cho phép", HttpStatus.BAD_REQUEST);
        }
    }
}
