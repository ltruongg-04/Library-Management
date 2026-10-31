package library.service.impl;

import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import library.service.FileStorageService;
import library.common.exception.CustomBusinessException;
import library.common.utils.ImageTypeDetector;
import library.common.utils.PublicUrlValidator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileStorageServiceImpl implements FileStorageService {

    private static final int MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
    private static final int MAX_REDIRECTS = 5;
    private static final String NOT_AN_IMAGE_MESSAGE = "Chỉ chấp nhận ảnh định dạng JPG, PNG, GIF hoặc WEBP";
    private static final String IMAGE_TOO_LARGE_MESSAGE = "Ảnh không được vượt quá 10MB";

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
    public String uploadImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new CustomBusinessException(NOT_AN_IMAGE_MESSAGE, HttpStatus.BAD_REQUEST);
        }
        if (file.getSize() > MAX_IMAGE_SIZE_BYTES) {
            throw new CustomBusinessException(IMAGE_TOO_LARGE_MESSAGE, HttpStatus.BAD_REQUEST);
        }
        try {
            return storeImage(file.getBytes());
        } catch (IOException e) {
            log.error("Không đọc được tệp ảnh tải lên", e);
            throw new CustomBusinessException(library.common.constant.ErrorMessages.FILE_UPLOAD_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public String uploadFileFromUrl(String fileUrl) {
        HttpURLConnection connection = null;
        try {
            connection = openPublicConnection(fileUrl);
            byte[] content;
            try (InputStream inputStream = connection.getInputStream()) {
                // Đọc dư một byte để phát hiện file vượt giới hạn mà không phải tải hết về
                content = inputStream.readNBytes(MAX_IMAGE_SIZE_BYTES + 1);
            }
            if (content.length > MAX_IMAGE_SIZE_BYTES) {
                throw new CustomBusinessException(IMAGE_TOO_LARGE_MESSAGE, HttpStatus.BAD_REQUEST);
            }
            return storeImage(content);
        } catch (CustomBusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("Đã xảy ra lỗi khi tải tệp từ URL lên MinIO", e);
            throw new CustomBusinessException("Không thể tải ảnh từ URL", HttpStatus.BAD_REQUEST);
        } finally {
            if (connection != null) {
                connection.disconnect();
            }
        }
    }

    /**
     * Tự xử lý redirect để kiểm tra lại từng địa chỉ: URL công khai có thể redirect vào mạng nội bộ.
     */
    private HttpURLConnection openPublicConnection(String fileUrl) throws IOException, URISyntaxException {
        URI uri = new URI(fileUrl);
        for (int redirects = 0; redirects <= MAX_REDIRECTS; redirects++) {
            PublicUrlValidator.validate(uri);

            HttpURLConnection connection = (HttpURLConnection) uri.toURL().openConnection();
            connection.setRequestMethod("GET");
            connection.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
            connection.setConnectTimeout(8000);
            connection.setReadTimeout(15000);
            connection.setInstanceFollowRedirects(false);
            connection.connect();

            int responseCode = connection.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                return connection;
            }

            String location = connection.getHeaderField("Location");
            connection.disconnect();
            if (responseCode / 100 != 3 || location == null || location.isBlank()) {
                throw new CustomBusinessException("Không thể tải ảnh từ URL, mã phản hồi: " + responseCode, HttpStatus.BAD_REQUEST);
            }
            uri = uri.resolve(location);
        }
        throw new CustomBusinessException("Không thể tải ảnh từ URL: chuyển hướng quá nhiều lần", HttpStatus.BAD_REQUEST);
    }

    private String storeImage(byte[] content) {
        ImageTypeDetector.ImageType imageType = ImageTypeDetector.detect(content)
                .orElseThrow(() -> new CustomBusinessException(NOT_AN_IMAGE_MESSAGE, HttpStatus.BAD_REQUEST));
        String fileName = UUID.randomUUID() + imageType.getExtension();

        try (InputStream inputStream = new ByteArrayInputStream(content)) {
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(fileName)
                            .stream(inputStream, content.length, -1)
                            .contentType(imageType.getContentType())
                            .build()
            );
            return fileName;
        } catch (Exception e) {
            log.error("Đã xảy ra lỗi khi tải ảnh lên MinIO", e);
            throw new CustomBusinessException(library.common.constant.ErrorMessages.FILE_UPLOAD_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
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

    @Override
    public String copyFile(String sourceKey, String targetKey) {
        try {
            minioClient.copyObject(
                    io.minio.CopyObjectArgs.builder()
                            .bucket(bucketName)
                            .object(targetKey)
                            .source(io.minio.CopySource.builder().bucket(bucketName).object(sourceKey).build())
                            .build()
            );
            return targetKey;
        } catch (Exception e) {
            log.error("Lỗi khi sao chép tệp trong MinIO: {}", e.getMessage());
            throw new CustomBusinessException("Không thể sao chép tệp lưu trữ: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
