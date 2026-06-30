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

    @NotNull(message = "Book ID is required")
    private Integer bookId;

    @NotNull(message = "Pickup date is required")
    @FutureOrPresent(message = "Pickup date must be in the present or future")
    private LocalDate pickupDate;

    @NotNull(message = "Return date is required")
    private LocalDate returnDate;

    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;
}
