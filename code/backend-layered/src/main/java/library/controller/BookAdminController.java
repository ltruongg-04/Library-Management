package library.controller;

import library.dto.response.BookListResponse;
import library.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/books")
@RequiredArgsConstructor
public class BookAdminController {

    private final BookService bookService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN') or hasAuthority('books.view')")
    public ResponseEntity<Page<BookListResponse>> getAdminBookInventory(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Page<BookListResponse> bookPage = bookService.getAdminBookInventory(keyword, categoryId, page, size);
        return ResponseEntity.ok(bookPage);
    }

    @GetMapping("/check-duplicate")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('books.add-book')")
    public ResponseEntity<java.util.Map<String, Object>> checkDuplicate(
            @RequestParam(required = false) String isbn, 
            @RequestParam(required = false) String title) {
        return ResponseEntity.ok(bookService.checkDuplicate(isbn, title));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('books.add-book')")
    public ResponseEntity<library.dto.response.BookResponse> createBook(
            @RequestBody @jakarta.validation.Valid library.dto.request.BookCreateRequest request) {
        library.dto.response.BookResponse createdBook = bookService.createBook(request);
        return ResponseEntity.status(org.springframework.http.HttpStatus.CREATED).body(createdBook);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('books.edit-book')")
    public ResponseEntity<library.dto.response.BookResponse> updateBook(
            @PathVariable Integer id,
            @RequestBody library.dto.request.BookUpdateRequest request) {
        library.dto.response.BookResponse updatedBook = bookService.updateBook(id, request);
        return ResponseEntity.ok(updatedBook);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('books.delete-book')")
    public ResponseEntity<Void> deleteBook(@PathVariable Integer id) {
        bookService.deleteBook(id);
        return ResponseEntity.noContent().build();
    }
}
