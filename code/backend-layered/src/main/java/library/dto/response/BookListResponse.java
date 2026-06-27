package library.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookListResponse {

    private Integer id;
    private String title;
    private List<AuthorResponse> authors;
    private List<CategoryResponse> categories;
    private String imageUrl;
    private Double rating;
    private int availableQuantity;
    private int quantity;
    private String isbn;
    private String shelfLocation;
}
