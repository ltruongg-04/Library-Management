package library.service;

import library.dto.response.BookPageResponse;
import library.dto.response.BookResponse;

public interface BookService {

    BookPageResponse getBooks(String keyword, String category, int page, int size, String sortBy);

    BookResponse getBookById(Integer id);

    BookPageResponse getTrendingBooks(int limit);
}
