package library.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminStockReceiptDto {
    private Integer id;
    private String receiptCode;
    private String supplierName;
    private Integer supplierId;
    private BigDecimal totalAmount;
    private String note;
    private String createdBy;
    private String createdAt;
    private List<AdminStockReceiptDetailDto> details;
}
