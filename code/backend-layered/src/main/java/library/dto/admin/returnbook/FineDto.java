package library.dto.admin.returnbook;

import library.entity.FineStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class FineDto {
    private Integer id;
    private Integer customerId;
    private BigDecimal amount;
    private FineStatus status;
    private LocalDateTime createdAt;
}
