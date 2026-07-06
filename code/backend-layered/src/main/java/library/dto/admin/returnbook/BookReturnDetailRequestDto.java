package library.dto.admin.returnbook;

import library.entity.ConditionStatus;
import lombok.Data;
import jakarta.validation.constraints.NotNull;

@Data
public class BookReturnDetailRequestDto {
    @NotNull(message = "Mã bản sao sách không được để trống")
    private Integer bookCopyId;

    @NotNull(message = "Tình trạng sách không được để trống")
    private ConditionStatus conditionStatus;

    private String note;
}
