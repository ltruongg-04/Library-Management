package library.controller;

import library.dto.response.BookListResponse;
import library.entity.BookStatus;
import library.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/books")
@RequiredArgsConstructor
public class BookAdminController {

    private final BookService bookService;

    @GetMapping
    public ResponseEntity<Page<BookListResponse>> getAdminBookInventory(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) BookStatus status,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Page<BookListResponse> bookPage = bookService.getAdminBookInventory(keyword, status, category, page, size);
        return ResponseEntity.ok(bookPage);
    }

    @PutMapping("/{id}")
    public ResponseEntity<library.dto.response.BookResponse> updateBook(
            @PathVariable Integer id,
            @RequestBody library.dto.request.BookUpdateRequest request) {
        library.dto.response.BookResponse updatedBook = bookService.updateBook(id, request);
        return ResponseEntity.ok(updatedBook);
    }
}
