package library.controller.user;

import library.common.base.ApiResponse;
import library.dto.response.EbookResponse;
import library.service.EbookService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.InputStream;

@RestController
@RequestMapping("/api/books/{bookId}/ebook")
@RequiredArgsConstructor
public class EbookController {

    private final EbookService ebookService;

    /**
     * Lấy metadata và thông tin quyền đọc sách mềm (canReadFull, allowedPages, previewOnly)
     */
    @GetMapping
    public ResponseEntity<ApiResponse<EbookResponse>> getEbookInfo(@PathVariable Integer bookId) {
        EbookResponse response = ebookService.getEbookByBookId(bookId);
        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin sách mềm thành công", response));
    }

    /**
     * Stream dữ liệu PDF an toàn trực tiếp cho viewer
     */
    @GetMapping("/stream")
    public ResponseEntity<InputStreamResource> streamEbook(@PathVariable Integer bookId) {
        InputStream stream = ebookService.getEbookStream(bookId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"book-" + bookId + ".pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(stream));
    }
}
