package library.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookCreateRequest {
    @NotBlank(message = "Title is required")
    private String title;
    
    private List<Integer> authorIds;
    private List<String> newAuthors;
    private String isbn;
    private List<Integer> categoryIds;
    private List<String> newCategories;
    private String shelfLocation;
    private String imageUrl;
    private String description;
    private String publisher;
    private LocalDate publicationDate;
    private Integer pages;
    private BigDecimal depositPrice;
}
