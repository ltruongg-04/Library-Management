package library.unitest;

import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import library.common.exception.CustomBusinessException;
import library.common.utils.PublicUrlValidator;
import library.service.impl.FileStorageServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.ArgumentCaptor;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;

import java.net.URI;
import java.nio.charset.StandardCharsets;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

class ImageUploadSecurityTest {

    private static final byte[] PNG_HEADER = {(byte) 0x89, 'P', 'N', 'G', 0x0D, 0x0A, 0x1A, 0x0A, 0, 0};

    private final MinioClient minioClient = mock(MinioClient.class);
    private final FileStorageServiceImpl service = new FileStorageServiceImpl(minioClient);

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(service, "bucketName", "bucket");
    }

    @Test
    void storesRealImageWithDetectedTypeIgnoringClaimedName() throws Exception {
        String key = service.uploadImage(new MockMultipartFile("file", "cover.html", "text/html", PNG_HEADER));

        assertThat(key).endsWith(".png");
        ArgumentCaptor<PutObjectArgs> args = ArgumentCaptor.forClass(PutObjectArgs.class);
        verify(minioClient).putObject(args.capture());
        assertThat(args.getValue().contentType()).isEqualTo("image/png");
    }

    @Test
    void rejectsHtmlDisguisedAsImage() throws Exception {
        byte[] html = "<script>alert(1)</script>".getBytes(StandardCharsets.UTF_8);

        assertRejected(() -> service.uploadImage(new MockMultipartFile("file", "cover.png", "image/png", html)));
    }

    @Test
    void rejectsSvg() throws Exception {
        byte[] svg = "<svg xmlns=\"http://www.w3.org/2000/svg\"/>".getBytes(StandardCharsets.UTF_8);

        assertRejected(() -> service.uploadImage(new MockMultipartFile("file", "cover.svg", "image/svg+xml", svg)));
    }

    @Test
    void rejectsOversizedImage() throws Exception {
        byte[] oversized = new byte[10 * 1024 * 1024 + 1];
        System.arraycopy(PNG_HEADER, 0, oversized, 0, PNG_HEADER.length);

        assertRejected(() -> service.uploadImage(new MockMultipartFile("file", "cover.png", "image/png", oversized)));
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "http://127.0.0.1/cover.png",
            "http://localhost/cover.png",
            "http://169.254.169.254/computeMetadata/v1/",
            "http://10.0.0.5/cover.png",
            "http://172.16.0.1/cover.png",
            "http://192.168.1.1/cover.png",
            "http://100.64.0.1/cover.png",
            "http://[::1]/cover.png",
            "http://[fd00::1]/cover.png",
            "http://0.0.0.0/cover.png",
            "http://8.8.8.8:6379/cover.png",
            "file:///etc/passwd",
            "ftp://8.8.8.8/cover.png",
            "not a url"
    })
    void rejectsUrlsOutsidePublicInternet(String url) throws Exception {
        assertRejected(() -> service.uploadFileFromUrl(url));
    }

    @Test
    void acceptsPublicHttpAddress() {
        assertThatCode(() -> PublicUrlValidator.validate(URI.create("https://8.8.8.8/cover.png")))
                .doesNotThrowAnyException();
    }

    private void assertRejected(org.assertj.core.api.ThrowableAssert.ThrowingCallable action) throws Exception {
        assertThatThrownBy(action).isInstanceOfSatisfying(CustomBusinessException.class,
                e -> assertThat(e.getHttpStatus()).isEqualTo(HttpStatus.BAD_REQUEST));
        verify(minioClient, never()).putObject(any());
    }
}
