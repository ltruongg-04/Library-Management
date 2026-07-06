package library.controller;

import library.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    private final FileStorageService fileStorageService;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        String fileUrl = fileStorageService.uploadFile(file);
        return ResponseEntity.ok(Map.of("url", fileUrl));
    }

    public static class UrlRequest {
        private String url;
        public String getUrl() { return url; }
        public void setUrl(String url) { this.url = url; }
    }

    @PostMapping("/upload-url")
    public ResponseEntity<Map<String, String>> uploadFromUrl(@RequestBody UrlRequest request) {
        String fileUrl = fileStorageService.uploadFileFromUrl(request.getUrl());
        return ResponseEntity.ok(Map.of("url", fileUrl));
    }
}
