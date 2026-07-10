package library.mapper;

import library.dto.response.AuthorResponse;
import library.dto.response.BookListResponse;
import library.dto.response.BookResponse;
import library.dto.response.CategoryResponse;
import library.entity.AuthorEntity;
import library.entity.BookEntity;
import library.entity.CategoryEntity;
import library.entity.TagEntity;
import library.dto.response.TagResponse;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class BookMapper {

    public BookListResponse toBookListResponse(BookEntity entity) {
        if (entity == null) return null;
        
        return BookListResponse.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .authors(mapAuthors(entity.getAuthors()))
                .categories(mapCategories(entity.getCategories()))
                .imageUrl(entity.getImageUrl())
                .rating(entity.getRating())
                .availableQuantity(entity.getAvailableQuantity())
                .quantity(entity.getQuantity())
                .isbn(entity.getIsbn())
                .shelfLocation(entity.getShelfLocation())
                .tags(mapTags(entity.getTags()))
                .build();
    }

    public BookResponse toBookResponse(BookEntity entity) {
        if (entity == null) return null;
        
        return BookResponse.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .authors(mapAuthors(entity.getAuthors()))
                .publisher(entity.getPublisher())
                .publicationDate(entity.getPublicationDate())
                .pages(entity.getPages())
                .isbn(entity.getIsbn())
                .description(entity.getDescription())
                .imageUrl(entity.getImageUrl())
                .rating(entity.getRating())
                .reviewCount(entity.getReviewCount())
                .availableQuantity(entity.getAvailableQuantity())
                .quantity(entity.getQuantity())
                .shelfLocation(entity.getShelfLocation())
                .depositPrice(entity.getDepositPrice())
                .categories(mapCategories(entity.getCategories()))
                .tags(mapTags(entity.getTags()))
                .build();
    }

    private List<CategoryResponse> mapCategories(Set<CategoryEntity> categories) {
        if (categories == null) return Collections.emptyList();
        return categories.stream()
                .map(c -> CategoryResponse.builder()
                        .id(c.getId())
                        .name(c.getName())
                        .description(c.getDescription())
                        .build())
                .collect(Collectors.toList());
    }

    private List<AuthorResponse> mapAuthors(Set<AuthorEntity> authors) {
        if (authors == null) return Collections.emptyList();
        return authors.stream()
                .map(a -> AuthorResponse.builder()
                        .id(a.getId())
                        .name(a.getName())
                        .biography(a.getBiography())
                        .build())
                .collect(Collectors.toList());
    }

    private List<TagResponse> mapTags(Set<TagEntity> tags) {
        if (tags == null) return Collections.emptyList();
        return tags.stream()
                .map(t -> TagResponse.builder()
                        .id(t.getId())
                        .name(t.getName())
                        .build())
                .collect(Collectors.toList());
    }
}
