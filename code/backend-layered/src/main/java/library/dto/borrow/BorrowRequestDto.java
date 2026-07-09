package library.dto.borrow;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import library.entity.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BorrowRequestDto {

    @NotNull(message = "Mã sách là bắt buộc")
    private Integer bookId;

    @NotNull(message = "Ngày nhận sách là bắt buộc")
    @FutureOrPresent(message = "Ngày nhận sách phải là hôm nay hoặc trong tương lai")
    private LocalDate pickupDate;

    @NotNull(message = "Ngày trả sách là bắt buộc")
    private LocalDate returnDate;

    @NotNull(message = "Phương thức thanh toán là bắt buộc")
    private PaymentMethod paymentMethod;
}
