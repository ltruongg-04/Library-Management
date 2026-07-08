package library.controller.public_api;

import library.common.base.ApiResponse;
import library.dto.request.BookVisitRequest;
import library.service.BookVisitService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/book-visits")
@RequiredArgsConstructor
public class PublicBookVisitController {

    private final BookVisitService bookVisitService;

    @PostMapping("/confirm")
    public ResponseEntity<ApiResponse<String>> createBookVisit(@RequestBody BookVisitRequest request) {
        bookVisitService.createBookVisit(request);
        return ResponseEntity.ok(ApiResponse.success("Book visit created successfully", null));
    }
}
