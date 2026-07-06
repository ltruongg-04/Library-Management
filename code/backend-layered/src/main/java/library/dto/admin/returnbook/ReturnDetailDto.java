package library.dto.admin.returnbook;

import library.entity.ConditionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReturnDetailDto {
    private String bookTitle;
    private String barcode;
    private ConditionStatus conditionStatus;
    private BigDecimal fineAmount;
    private String note;
}
