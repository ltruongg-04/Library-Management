package library.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

public interface FileStorageService {
    String uploadFile(MultipartFile file);
    String uploadFileFromUrl(String fileUrl);
    String resolveFullUrl(String objectKey);
    InputStream getFileStream(String objectKey);
    void deleteFile(String objectKey);
    String copyFile(String sourceKey, String targetKey);
}
