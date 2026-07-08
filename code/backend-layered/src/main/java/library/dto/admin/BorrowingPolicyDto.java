package library.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BorrowingPolicyDto {

    private Integer id;

    private Integer maxBorrowDays;

    private Integer maxBooks;

    private BigDecimal rentalFeePerDay;

    private BigDecimal overdueFinePerDay;

    private BigDecimal damageFeePercent;

    private BigDecimal lostBookMultiplier;

    private Integer maxExtensions;
}
