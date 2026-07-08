package library.service;

import library.dto.request.BookCreateRequest;
import library.dto.request.BookUpdateRequest;
import library.dto.response.BookResponse;

public interface BookCommandService {
    BookResponse createBook(BookCreateRequest request);
    BookResponse updateBook(Integer id, BookUpdateRequest request);
    void deleteBook(Integer id);
}
