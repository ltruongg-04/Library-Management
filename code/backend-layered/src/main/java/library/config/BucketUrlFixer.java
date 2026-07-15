package library.config;

import library.entity.BookEntity;
import library.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Chạy khi backend khởi động — tự động strip full URL prefix khỏi cover_image,
 * chỉ giữ lại object key (tên file).
 *
 * Ví dụ:
 *   "http://84.247.131.42:9000/library/abc.jpg"         → "abc.jpg"
 *   "https://storage.googleapis.com/lms1-bucket/abc.jpg" → "abc.jpg"
 *   "abc.jpg" (đã đúng)                                  → không đổi
 */
@Slf4j
@Component
@RequiredArgsConstructor
@Order(1) // Chạy trước các CommandLineRunner khác
public class BucketUrlFixer implements CommandLineRunner {

    private final BookRepository bookRepository;

    @Value("${minio.url}")
    private String minioUrl;

    @Value("${minio.bucket-name}")
    private String bucketName;

    /** Danh sách các prefix cũ có thể tồn tại trong DB */
    private static final String[] KNOWN_PREFIXES = {
            "https://storage.googleapis.com/lms1-bucket/",
            "https://storage.googleapis.com/lms2-bucket/",
            "https://storage.googleapis.com/lms2/",
            "http://84.247.131.42:9000/library/",
    };

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Migrating image URLs → object keys...");
        List<BookEntity> books = bookRepository.findAll();
        int count = 0;

        // Tạo prefix hiện tại từ config (.env)
        String currentPrefix = trimTrailingSlash(minioUrl) + "/" + bucketName + "/";

        for (BookEntity book : books) {
            String url = book.getImageUrl();
            if (url == null || url.isBlank() || !url.startsWith("http")) {
                continue; // Đã là object key hoặc null → bỏ qua
            }

            String objectKey = stripPrefix(url, currentPrefix);
            if (!objectKey.equals(url)) {
                book.setImageUrl(objectKey);
                bookRepository.save(book);
                count++;
            }
        }

        if (count > 0) {
            log.info("Migrated {} book image URLs → object keys.", count);
        } else {
            log.info("No image URLs need migration.");
        }
    }

    /**
     * Thử strip prefix hiện tại và tất cả prefix cũ đã biết.
     * Trả về object key nếu tìm thấy prefix, ngược lại trả nguyên URL.
     */
    private String stripPrefix(String url, String currentPrefix) {
        // Thử prefix hiện tại trước
        if (url.startsWith(currentPrefix)) {
            return url.substring(currentPrefix.length());
        }
        // Thử các prefix cũ
        for (String prefix : KNOWN_PREFIXES) {
            if (url.startsWith(prefix)) {
                return url.substring(prefix.length());
            }
        }
        return url; // Không nhận diện được → giữ nguyên
    }

    private String trimTrailingSlash(String value) {
        return (value != null && value.endsWith("/"))
                ? value.substring(0, value.length() - 1) : value;
    }
}
