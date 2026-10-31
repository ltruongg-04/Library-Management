package library.unitest;

import io.minio.MinioClient;
import library.config.VnPayConfig;
import library.service.VnPayCallbackService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Khởi động toàn bộ context với lazy-initialization tắt để phát hiện lỗi wiring bean (thiếu bean, phụ thuộc vòng)
 * mà app thật chỉ lộ ra ở request đầu tiên. Mọi cấu hình kết nối được ghi đè nên không chạm vào hệ thống thật.
 */
@SpringBootTest(properties = {
        "spring.main.lazy-initialization=false",
        "spring.datasource.url=jdbc:h2:mem:smoke;DB_CLOSE_DELAY=-1",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "spring.flyway.enabled=false",
        "spring.data.redis.host=127.0.0.1",
        "spring.data.redis.port=1",
        "app.cache.provider=caffeine",
        "app.jwt.secret=c21va2UtdGVzdC1zZWNyZXQtc21va2UtdGVzdC1zZWNyZXQtc21va2U=",
        "vnpay.tmn-code=smoke",
        "vnpay.hash-secret=smoke",
        "vnpay.pay-url=https://vnpay.test",
        "VNPAY_PROCESS_ON_RETURN=false",
        "minio.url=http://127.0.0.1:1",
        "minio.access-key=smoke",
        "minio.secret-key=smoke",
        "minio.bucket-name=smoke",
        "recaptcha.secret-key=smoke",
        "resend.api-key=smoke"
})
class ApplicationContextSmokeTest {

    @MockitoBean
    private MinioClient minioClient;

    @Autowired
    private VnPayCallbackService vnPayCallbackService;
    @Autowired
    private VnPayConfig vnPayConfig;

    @Test
    void contextLoadsWithProductionDefaults() {
        assertThat(vnPayCallbackService).isNotNull();
        assertThat(vnPayConfig.isProcessOnReturn()).isFalse();
    }
}
