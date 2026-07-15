package library.service.impl;

import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import library.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileStorageServiceImpl implements FileStorageService {

    private final MinioClient minioClient;

    @Value("${minio.bucket-name}")
    private String bucketName;

    @Value("${minio.url}")
    private String minioUrl;

    @Override
    public String uploadFile(MultipartFile file) {
        try {
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String fileName = UUID.randomUUID().toString() + extension;

            InputStream inputStream = file.getInputStream();
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(fileName)
                            .stream(inputStream, inputStream.available(), -1)
                            .contentType(file.getContentType())
                            .build()
            );

            return fileName;
        } catch (Exception e) {
            throw new RuntimeException("Đã xảy ra lỗi khi tải tệp lên MinIO", e);
        }
    }

    @Override
    public String uploadFileFromUrl(String fileUrl) {
        try {
            URL url = new URI(fileUrl).toURL();
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
            connection.connect();

            if (connection.getResponseCode() != 200) {
                throw new RuntimeException("Không thể tải ảnh từ URL, mã phản hồi: " + connection.getResponseCode());
            }

            String contentType = connection.getContentType();
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            String extension = "";
            if (contentType.contains("image/jpeg") || contentType.contains("image/jpg")) {
                extension = ".jpg";
            } else if (contentType.contains("image/png")) {
                extension = ".png";
            } else if (contentType.contains("image/gif")) {
                extension = ".gif";
            } else if (contentType.contains("image/webp")) {
                extension = ".webp";
            } else {
                String path = url.getPath();
                if (path != null && path.contains(".")) {
                    extension = path.substring(path.lastIndexOf("."));
                }
            }

            String fileName = UUID.randomUUID().toString() + extension;

            long contentLength = connection.getContentLengthLong();
            long objectSize = contentLength > 0 ? contentLength : -1;
            long partSize = objectSize == -1 ? 10485760 : -1;

            try (InputStream inputStream = connection.getInputStream()) {
                minioClient.putObject(
                        PutObjectArgs.builder()
                                .bucket(bucketName)
                                .object(fileName)
                                .stream(inputStream, objectSize, partSize)
                                .contentType(contentType)
                                .build()
                );
            }

            return fileName;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Đã xảy ra lỗi khi tải tệp từ URL lên MinIO: " + e.getMessage(), e);
        }
    }

    @Override
    public String resolveFullUrl(String objectKey) {
        if (objectKey == null || objectKey.isBlank()) {
            return null;
        }
        // Backward-compatible: nếu DB vẫn lưu full URL cũ thì trả nguyên
        if (objectKey.startsWith("http://") || objectKey.startsWith("https://")) {
            return objectKey;
        }
        return minioUrl + "/" + bucketName + "/" + objectKey;
    }
}
