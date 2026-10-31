package library.service.impl.helper;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import library.common.exception.CustomBusinessException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;

/**
 * Tạo bản đọc thử chỉ chứa phần nội dung người đọc được phép xem.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class EbookPreviewHelper {

    private final ObjectMapper objectMapper;

    public InputStream createPreview(InputStream source, String fileFormat, int allowedPages) {
        try (InputStream input = source) {
            byte[] preview = isWebReaderFormat(fileFormat)
                    ? createWebReaderPreview(input, allowedPages)
                    : createPdfPreview(input, allowedPages);
            return new ByteArrayInputStream(preview);
        } catch (IOException e) {
            // Không tạo được bản đọc thử thì báo lỗi, tuyệt đối không trả về file gốc
            log.error("Không thể tạo bản đọc thử sách mềm", e);
            throw new CustomBusinessException("Không thể tạo bản đọc thử của sách mềm", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private boolean isWebReaderFormat(String fileFormat) {
        return "WEB_READER".equalsIgnoreCase(fileFormat) || "JSON".equalsIgnoreCase(fileFormat);
    }

    private byte[] createWebReaderPreview(InputStream input, int allowedChapters) throws IOException {
        JsonNode root = objectMapper.readTree(input);
        JsonNode chapters = root.path("chapters");
        // Giữ nguyên danh sách chương để mục lục vẫn hiển thị, chỉ bỏ nội dung các chương bị khóa
        for (int i = allowedChapters; i < chapters.size(); i++) {
            ((ObjectNode) chapters.get(i)).put("html", "");
        }
        return objectMapper.writeValueAsBytes(root);
    }

    private byte[] createPdfPreview(InputStream input, int allowedPages) throws IOException {
        // Ghi ra file tạm để không phải nạp toàn bộ file PDF lớn vào RAM
        Path tempFile = Files.createTempFile("ebook-preview-", ".pdf");
        try {
            Files.copy(input, tempFile, StandardCopyOption.REPLACE_EXISTING);
            try (PDDocument original = Loader.loadPDF(tempFile.toFile());
                 PDDocument preview = new PDDocument()) {
                int pageCount = Math.min(allowedPages, original.getNumberOfPages());
                for (int i = 0; i < pageCount; i++) {
                    PDPage page = preview.importPage(original.getPage(i));
                    // Annotation (link nội bộ) có thể tham chiếu tới trang bị khóa và kéo cả trang đó vào file
                    page.setAnnotations(List.of());
                }
                ByteArrayOutputStream output = new ByteArrayOutputStream();
                preview.save(output);
                return output.toByteArray();
            }
        } finally {
            Files.deleteIfExists(tempFile);
        }
    }
}
