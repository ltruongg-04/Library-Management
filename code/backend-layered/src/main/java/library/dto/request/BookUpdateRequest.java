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
    private String author;
    private String isbn;
    private String category;
    private BookStatus status;
    private String shelfLocation;
    private String imageUrl;
    private Integer quantity;
    private Integer availableQuantity;
}
