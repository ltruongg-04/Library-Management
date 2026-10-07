package library.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminMembershipTierDto {
    private Integer id;
    private String name;
    private Integer minPoints;
    private Integer discountPercent;
    private Integer maxBorrowDays;
    private Integer maxBorrowBooks;
}
