package library.service.impl;

import library.dto.request.BookCreateRequest;
import library.dto.request.BookUpdateRequest;
import library.dto.response.BookListResponse;
import library.dto.response.BookPageResponse;
import library.dto.response.BookResponse;
import library.service.BookCommandService;
import library.service.BookQueryService;
import library.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

    private final BookCommandService bookCommandService;
    private final BookQueryService bookQueryService;

    @Override
    public List<BookListResponse> getAllBooks() {
        return bookQueryService.getAllBooks();
    }

    @Override
    public List<BookListResponse> getTopRatedBooks() {
        return bookQueryService.getTopRatedBooks();
    }

    @Override
    public BookResponse getBookById(Integer id) {
        return bookQueryService.getBookById(id);
    }

    @Override
    public Page<BookListResponse> getAdminBookInventory(String keyword, Integer categoryId, int page, int size) {
        return bookQueryService.getAdminBookInventory(keyword, categoryId, page, size);
    }

    @Override
    public BookResponse createBook(BookCreateRequest request) {
        return bookCommandService.createBook(request);
    }

    @Override
    public BookResponse updateBook(Integer id, BookUpdateRequest request) {
        return bookCommandService.updateBook(id, request);
    }

    @Override
    public void deleteBook(Integer id) {
        bookCommandService.deleteBook(id);
    }

    @Override
    public BookPageResponse getBooks(String keyword, Integer categoryId, Integer authorId, String publisher, int page, int size, String sortBy, Double minRating, Boolean isAvailable) {
        return bookQueryService.getBooks(keyword, categoryId, authorId, publisher, page, size, sortBy, minRating, isAvailable);
    }

    @Override
    public BookPageResponse getTrendingBooks(int limit) {
        return bookQueryService.getTrendingBooks(limit);
    }

    @Override
    public java.util.Map<String, Object> checkDuplicate(String isbn, String title) {
        return bookQueryService.checkDuplicate(isbn, title);
    }
}
