package library.dto.response;

import library.entity.BookEntity;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookResponse {

    private Integer id;
    private String title;
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
}
