package library.service.impl;

import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import library.service.FileStorageService;
import library.common.exception.CustomBusinessException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
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

            try (InputStream inputStream = file.getInputStream()) {
                minioClient.putObject(
                        PutObjectArgs.builder()
                                .bucket(bucketName)
                                .object(fileName)
                                .stream(inputStream, inputStream.available(), -1)
                                .contentType(file.getContentType())
                                .build()
                );
            }

            return fileName;
        } catch (Exception e) {
            log.error("Đã xảy ra lỗi khi tải tệp lên MinIO", e);
            throw new CustomBusinessException(library.common.constant.ErrorMessages.FILE_UPLOAD_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public String uploadFileFromUrl(String fileUrl) {
        try {
            URL url = new URI(fileUrl).toURL();
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
            connection.setConnectTimeout(8000);
            connection.setReadTimeout(15000);
            connection.setInstanceFollowRedirects(true);
            connection.connect();

            int responseCode = connection.getResponseCode();
            int redirects = 0;
            while ((responseCode == HttpURLConnection.HTTP_MOVED_TEMP
                    || responseCode == HttpURLConnection.HTTP_MOVED_PERM
                    || responseCode == HttpURLConnection.HTTP_SEE_OTHER
                    || responseCode == 307
                    || responseCode == 308) && redirects < 5) {
                String newUrl = connection.getHeaderField("Location");
                if (newUrl == null || newUrl.isBlank()) break;
                connection.disconnect();
                url = new URI(newUrl).toURL();
                connection = (HttpURLConnection) url.openConnection();
                connection.setRequestMethod("GET");
                connection.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
                connection.setConnectTimeout(8000);
                connection.setReadTimeout(15000);
                connection.setInstanceFollowRedirects(true);
                connection.connect();
                responseCode = connection.getResponseCode();
                redirects++;
            }

            if (responseCode != 200) {
                throw new CustomBusinessException("Không thể tải ảnh từ URL, mã phản hồi: " + responseCode, HttpStatus.BAD_REQUEST);
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
            log.error("Đã xảy ra lỗi khi tải tệp từ URL lên MinIO", e);
            throw new CustomBusinessException("Đã xảy ra lỗi khi tải tệp từ URL lên MinIO: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
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

    @Override
    public InputStream getFileStream(String objectKey) {
        try {
            return minioClient.getObject(
                    io.minio.GetObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectKey)
                            .build()
            );
        } catch (Exception e) {
            log.error("Đã xảy ra lỗi khi đọc tệp từ MinIO", e);
            throw new CustomBusinessException("Không thể đọc tệp từ lưu trữ: " + e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @Override
    public void deleteFile(String objectKey) {
        if (objectKey == null || objectKey.isBlank()) {
            return;
        }
        try {
            minioClient.removeObject(
                    io.minio.RemoveObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectKey)
                            .build()
            );
        } catch (Exception e) {
            log.warn("Không thể xóa tệp từ MinIO: {}", objectKey, e);
        }
    }
}
