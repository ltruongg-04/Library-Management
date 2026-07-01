package library.service.impl;

import library.common.exception.CustomBusinessException;
import library.dto.response.AuthorResponse;
import library.dto.response.BookListResponse;
import library.dto.response.CategoryResponse;
import library.entity.AuthorEntity;
import library.entity.BookEntity;
import library.entity.CategoryEntity;
import library.entity.CustomerEntity;
import library.entity.FavouriteEntity;
import library.entity.FavouriteId;
import library.repository.BookRepository;
import library.repository.CustomerRepository;
import library.repository.FavouriteRepository;
import library.service.FavouriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavouriteServiceImpl implements FavouriteService {

    private final FavouriteRepository favouriteRepository;
    private final CustomerRepository customerRepository;
    private final BookRepository bookRepository;

    @Override
    @Transactional
    public void addFavourite(Integer customerId, Integer bookId) {
        if (favouriteRepository.existsByIdCustomerIdAndIdBookId(customerId, bookId)) {
            return; // Already favorited
        }

        CustomerEntity customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new CustomBusinessException("Customer not found", HttpStatus.NOT_FOUND));
        BookEntity book = bookRepository.findById(bookId)
                .orElseThrow(() -> new CustomBusinessException("Book not found", HttpStatus.NOT_FOUND));

        FavouriteEntity favourite = FavouriteEntity.builder()
                .id(new FavouriteId(customerId, bookId))
                .customer(customer)
                .book(book)
                .build();

        favouriteRepository.save(favourite);
    }

    @Override
    @Transactional
    public void removeFavourite(Integer customerId, Integer bookId) {
        FavouriteEntity favourite = favouriteRepository.findByIdCustomerIdAndIdBookId(customerId, bookId)
                .orElse(null);
        if (favourite != null) {
            favouriteRepository.delete(favourite);
        }
    }

    @Override
    public boolean isFavourite(Integer customerId, Integer bookId) {
        return favouriteRepository.existsByIdCustomerIdAndIdBookId(customerId, bookId);
    }

    @Override
    public Page<BookListResponse> getFavouritesByCustomer(Integer customerId, Pageable pageable) {
        Page<FavouriteEntity> favourites = favouriteRepository.findByIdCustomerId(customerId, pageable);
        return favourites.map(fav -> toBookListResponse(fav.getBook()));
    }

    private BookListResponse toBookListResponse(BookEntity entity) {
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
                .build();
    }

    private List<AuthorResponse> mapAuthors(Set<AuthorEntity> authors) {
        if (authors == null) return List.of();
        return authors.stream()
                .map(author -> AuthorResponse.builder()
                        .id(author.getId())
                        .name(author.getName())
                        .biography(author.getBiography())
                        .build())
                .collect(Collectors.toList());
    }

    private List<CategoryResponse> mapCategories(Set<CategoryEntity> categories) {
        if (categories == null) return List.of();
        return categories.stream()
                .map(category -> CategoryResponse.builder()
                        .id(category.getId())
                        .name(category.getName())
                        .description(category.getDescription())
                        .build())
                .collect(Collectors.toList());
    }
}
