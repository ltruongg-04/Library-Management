package library.dto.response;

import library.entity.BookCopyStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookCopyResponse {
    private Integer id;
    private Integer bookId;
    private String barcode;
    private BookCopyStatus status;
    private String conditionNote;
}
