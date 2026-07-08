package library.controller.admin;

import library.dto.request.BookVisitStatusRequest;
import library.dto.response.BookVisitResponse;
import library.service.BookVisitService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/book-visits")
@RequiredArgsConstructor
public class AdminBookVisitController {

    private final BookVisitService bookVisitService;

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Page<BookVisitResponse>> getAllVisits(Pageable pageable) {
        return ResponseEntity.ok(bookVisitService.getAllVisits(pageable));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<BookVisitResponse> updateStatus(
            @PathVariable Integer id,
            @RequestBody BookVisitStatusRequest request) {
        return ResponseEntity.ok(bookVisitService.updateStatus(id, request.getStatus(), request.getNotes()));
    }
}
