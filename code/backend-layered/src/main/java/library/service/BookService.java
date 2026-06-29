package library.service;

<<<<<<< HEAD
import library.dto.response.BookListResponse;
import library.dto.response.BookResponse;

import java.util.List;

public interface BookService {

    List<BookListResponse> getAllBooks();

    List<BookListResponse> getTopRatedBooks();

    BookResponse getBookById(Integer id);

    org.springframework.data.domain.Page<BookListResponse> getAdminBookInventory(
            String keyword,
            Integer categoryId,
            int page,
            int size);

    BookResponse createBook(library.dto.request.BookCreateRequest request);

    BookResponse updateBook(Integer id, library.dto.request.BookUpdateRequest request);
=======
import library.dto.response.BookPageResponse;
import library.dto.response.BookResponse;

public interface BookService {

    BookPageResponse getBooks(String keyword, String category, int page, int size, String sortBy);

    BookResponse getBookById(Integer id);

    BookPageResponse getTrendingBooks(int limit);
>>>>>>> develop
}
