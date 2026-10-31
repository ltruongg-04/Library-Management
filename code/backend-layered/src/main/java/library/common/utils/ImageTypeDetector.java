package library.common.utils;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Optional;

/**
 * Nhận diện ảnh theo nội dung file, không tin tên file hay Content-Type do phía gửi khai báo.
 * Không hỗ trợ SVG vì SVG có thể chứa script.
 */
public final class ImageTypeDetector {

    public enum ImageType {
        JPEG(".jpg", "image/jpeg"),
        PNG(".png", "image/png"),
        GIF(".gif", "image/gif"),
        WEBP(".webp", "image/webp");

        private final String extension;
        private final String contentType;

        ImageType(String extension, String contentType) {
            this.extension = extension;
            this.contentType = contentType;
        }

        public String getExtension() {
            return extension;
        }

        public String getContentType() {
            return contentType;
        }
    }

    private static final byte[] JPEG_SIGNATURE = {(byte) 0xFF, (byte) 0xD8, (byte) 0xFF};
    private static final byte[] PNG_SIGNATURE = {(byte) 0x89, 'P', 'N', 'G', 0x0D, 0x0A, 0x1A, 0x0A};
    private static final byte[] GIF87_SIGNATURE = "GIF87a".getBytes(StandardCharsets.US_ASCII);
    private static final byte[] GIF89_SIGNATURE = "GIF89a".getBytes(StandardCharsets.US_ASCII);
    private static final byte[] RIFF_SIGNATURE = "RIFF".getBytes(StandardCharsets.US_ASCII);
    private static final byte[] WEBP_SIGNATURE = "WEBP".getBytes(StandardCharsets.US_ASCII);
    private static final int WEBP_SIGNATURE_OFFSET = 8;

    private ImageTypeDetector() {
        // Utility class — prevent instantiation
    }

    public static Optional<ImageType> detect(byte[] content) {
        if (startsWith(content, JPEG_SIGNATURE, 0)) {
            return Optional.of(ImageType.JPEG);
        }
        if (startsWith(content, PNG_SIGNATURE, 0)) {
            return Optional.of(ImageType.PNG);
        }
        if (startsWith(content, GIF87_SIGNATURE, 0) || startsWith(content, GIF89_SIGNATURE, 0)) {
            return Optional.of(ImageType.GIF);
        }
        if (startsWith(content, RIFF_SIGNATURE, 0) && startsWith(content, WEBP_SIGNATURE, WEBP_SIGNATURE_OFFSET)) {
            return Optional.of(ImageType.WEBP);
        }
        return Optional.empty();
    }

    private static boolean startsWith(byte[] content, byte[] signature, int offset) {
        return content.length >= offset + signature.length
                && Arrays.equals(content, offset, offset + signature.length, signature, 0, signature.length);
    }
}
