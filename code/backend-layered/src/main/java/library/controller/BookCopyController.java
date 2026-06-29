package library.controller;

import library.dto.request.BookCopyRequest;
import library.dto.response.BookCopyResponse;
import library.service.BookCopyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/books")
@RequiredArgsConstructor
public class BookCopyController {

    private final BookCopyService bookCopyService;

    @GetMapping("/{bookId}/copies")
    public ResponseEntity<List<BookCopyResponse>> getCopies(@PathVariable Integer bookId) {
        return ResponseEntity.ok(bookCopyService.getCopiesByBookId(bookId));
    }

    @PostMapping("/{bookId}/copies")
    public ResponseEntity<List<BookCopyResponse>> addCopies(@PathVariable Integer bookId, @RequestParam(defaultValue = "1") int quantity) {
        if (quantity <= 0) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(bookCopyService.addCopies(bookId, quantity));
    }

    @PutMapping("/copies/{copyId}")
    public ResponseEntity<BookCopyResponse> updateCopy(@PathVariable Integer copyId, @RequestBody BookCopyRequest request) {
        return ResponseEntity.ok(bookCopyService.updateCopy(copyId, request));
    }

    @DeleteMapping("/copies/{copyId}")
    public ResponseEntity<Void> deleteCopy(@PathVariable Integer copyId) {
        bookCopyService.deleteCopy(copyId);
        return ResponseEntity.ok().build();
    }
}

