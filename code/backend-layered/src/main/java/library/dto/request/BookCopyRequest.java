package library.dto.request;

import library.entity.BookCopyStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookCopyRequest {
    private BookCopyStatus status;
    private String conditionNote;
}
