package library.controller.user;

import library.common.base.ApiResponse;
import library.dto.response.BookListResponse;
import library.dto.response.BookPageResponse;
import library.dto.response.BookResponse;
import library.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    /**
     * GET /api/public/books?keyword=...&category=...&page=0&size=12&sortBy=newest
     * Danh sách sách (có phân trang, tìm kiếm, lọc category)
     */
    @GetMapping
    public ResponseEntity<ApiResponse<BookPageResponse>> getBooks(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "newest") String sortBy) {

        BookPageResponse response = bookService.getBooks(keyword, category, page, size, sortBy);
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách sách thành công", response));
    }

    /**
     * GET /api/public/books/{id}
     * Chi tiết một cuốn sách
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookResponse>> getBookById(@PathVariable Integer id) {
        BookResponse response = bookService.getBookById(id);
        return ResponseEntity.ok(ApiResponse.success("Lấy chi tiết sách thành công", response));
    }

    /**
     * GET /api/public/books/trending?limit=8
     * Sách thịnh hành (mới nhất)
     */
    @GetMapping("/trending")
    public ResponseEntity<ApiResponse<BookPageResponse>> getTrendingBooks(
            @RequestParam(defaultValue = "8") int limit) {
        BookPageResponse response = bookService.getTrendingBooks(limit);
        return ResponseEntity.ok(ApiResponse.success("Lấy sách thịnh hành thành công", response));
    }

    /**
     * Legacy endpoints from feature/books
     */
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<BookListResponse>>> getAllBooks() {
        List<BookListResponse> books = bookService.getAllBooks();
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách sách thành công", books));
    }

    @GetMapping("/top-rated")
    public ResponseEntity<ApiResponse<List<BookListResponse>>> getTopRatedBooks() {
        List<BookListResponse> books = bookService.getTopRatedBooks();
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách top sách thành công", books));
    }
}
