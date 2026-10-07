package library.dto.admin;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class AdminCreateStockReceiptRequest {
    private Integer supplierId;
    private String note;
    private List<DetailRequest> details;

    @Data
    public static class DetailRequest {
        private Integer bookId;
        private Integer quantity;
        private BigDecimal unitPrice;
    }
}
