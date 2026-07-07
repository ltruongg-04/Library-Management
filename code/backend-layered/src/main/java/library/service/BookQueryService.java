package library.service;

import library.dto.response.BookListResponse;
import library.dto.response.BookPageResponse;
import library.dto.response.BookResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface BookQueryService {
    List<BookListResponse> getAllBooks();
    List<BookListResponse> getTopRatedBooks();
    BookResponse getBookById(Integer id);
    Page<BookListResponse> getAdminBookInventory(String keyword, Integer categoryId, int page, int size);
    BookPageResponse getBooks(String keyword, Integer categoryId, Integer authorId, String publisher, int page, int size, String sortBy, Double minRating, Boolean isAvailable);
    BookPageResponse getTrendingBooks(int limit);
}
