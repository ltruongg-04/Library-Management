package library.dto.response;

<<<<<<< HEAD
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
=======
import library.entity.BookEntity;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
>>>>>>> develop
public class BookResponse {

    private Integer id;
    private String title;
<<<<<<< HEAD
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
=======
    private String author;
    private String isbn;
    private String publisher;
    private Integer publishYear;
    private int quantity;
    private int availableQuantity;
    private String category;
    private String description;
    private String imageUrl;

    public static BookResponse fromEntity(BookEntity entity) {
        return BookResponse.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .author(entity.getAuthor())
                .isbn(entity.getIsbn())
                .publisher(entity.getPublisher())
                .publishYear(entity.getPublishYear())
                .quantity(entity.getQuantity())
                .availableQuantity(entity.getAvailableQuantity())
                .category(entity.getCategory())
                .description(entity.getDescription())
                .imageUrl(entity.getImageUrl())
                .build();
    }
>>>>>>> develop
}
