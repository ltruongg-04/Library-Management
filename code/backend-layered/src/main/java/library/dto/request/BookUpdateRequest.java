package library.dto.request;

import library.entity.BookStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookUpdateRequest {
    private String title;
    private List<Integer> authorIds;
    private String isbn;
    private List<Integer> categoryIds;
    private BookStatus status;
    private String shelfLocation;
    private String imageUrl;
    private Integer quantity;
    private Integer availableQuantity;
}
