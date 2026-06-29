package library.dto.response;

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
public class BookResponse {

    private Integer id;
    private String title;
    private List<AuthorResponse> authors;
    private String publisher;
    private java.time.LocalDate publicationDate;
    private Integer pages;
    private String isbn;
    private String description;
    private String imageUrl;
    private Double rating;
    private Integer reviewCount;
    private int availableQuantity;
    private int quantity;
    private String shelfLocation;
    private BigDecimal depositPrice;
    private List<CategoryResponse> categories;
}
