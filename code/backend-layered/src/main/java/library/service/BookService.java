package library.service;

import library.dto.response.BookListResponse;
import library.dto.response.BookResponse;

import java.util.List;

public interface BookService {

    List<BookListResponse> getAllBooks();

    List<BookListResponse> getTopRatedBooks();

    BookResponse getBookById(Integer id);

    org.springframework.data.domain.Page<BookListResponse> getAdminBookInventory(
            String keyword,
            library.entity.BookStatus status,
            String category,
            int page,
            int size);

    BookResponse updateBook(Integer id, library.dto.request.BookUpdateRequest request);
}
