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
     * Stream dữ liệu sách an toàn trực tiếp cho viewer (PDF hoặc JSON Web Reader)
     */
    @GetMapping("/stream")
    public ResponseEntity<InputStreamResource> streamEbook(@PathVariable Integer bookId) {
        EbookResponse info = ebookService.getEbookByBookId(bookId);
        InputStream stream = ebookService.getEbookStream(bookId);

        MediaType mediaType = MediaType.APPLICATION_PDF;
        String ext = "pdf";
        if (info.getFileFormat() != null && 
            ("WEB_READER".equalsIgnoreCase(info.getFileFormat()) || "JSON".equalsIgnoreCase(info.getFileFormat()))) {
            mediaType = MediaType.APPLICATION_JSON;
            ext = "json";
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"book-" + bookId + "." + ext + "\"")
                .contentType(mediaType)
                .body(new InputStreamResource(stream));
    }
}
