package library.service;

import library.dto.response.BookListResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface FavouriteService {
    void addFavourite(Integer customerId, Integer bookId);
    void removeFavourite(Integer customerId, Integer bookId);
    boolean isFavourite(Integer customerId, Integer bookId);
    Page<BookListResponse> getFavouritesByCustomer(Integer customerId, Pageable pageable);
}
