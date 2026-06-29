package library.dto.request;

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
    private List<String> newAuthors;
    private String isbn;
    private List<Integer> categoryIds;
    private List<String> newCategories;
    private String shelfLocation;
    private String imageUrl;
    private Integer quantity;
    private Integer availableQuantity;
}
