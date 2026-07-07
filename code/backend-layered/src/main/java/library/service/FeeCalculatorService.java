package library.service;

import library.entity.BorrowingPolicyEntity;
import library.entity.ConditionStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

public interface FeeCalculatorService {

    /**
     * Tính phí thuê sách dựa trên ngày bắt đầu và kết thúc
     * Công thức chung: (endDate - startDate) * 5.000đ * số lượng sách
     * Mặc định tối thiểu tính 1 ngày.
     */
    BigDecimal calculateRentalFee(LocalDate startDate, LocalDate endDate, int numberOfBooks);

    /**
     * Tính phí phạt quá hạn
     * Công thức: (returnDate - dueDate) * phí phạt/ngày (lấy từ chính sách)
     */
    BigDecimal calculateOverdueFee(LocalDate dueDate, LocalDate returnDate);

    /**
     * Tính phí phạt đền bù theo tình trạng sách
     * - Mất sách: Phạt x lần giá cọc (theo chính sách)
     * - Hỏng hóc: Phạt x% giá cọc (theo chính sách)
     */
    BigDecimal calculateDamageFee(BigDecimal depositPrice, ConditionStatus conditionStatus);

    /**
     * Lấy chính sách mượn sách hiện hành (có thể tạo mặc định nếu chưa có)
     */
    BorrowingPolicyEntity getActivePolicy();
}
