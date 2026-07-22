package library;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

@SpringBootApplication(exclude = { org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration.class })
@EnableJpaAuditing
@EnableAsync
@EnableScheduling
@org.springframework.data.web.config.EnableSpringDataWebSupport(pageSerializationMode = org.springframework.data.web.config.EnableSpringDataWebSupport.PageSerializationMode.VIA_DTO)
public class Application {
    private static final Logger log = LoggerFactory.getLogger(Application.class);

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @jakarta.annotation.PostConstruct
    public void init() {
        // Đặt múi giờ mặc định cho toàn hệ thống là GMT+7 (Giờ Việt Nam)
        java.util.TimeZone.setDefault(java.util.TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        log.info("Spring boot application running in GMT+7 timezone : {}", java.util.Date.from(java.time.Instant.now()));
    }

    @Bean
    public CommandLineRunner verifyDatabaseConnection(DataSource dataSource) {
        return args -> {
            try (Connection conn = dataSource.getConnection()) {
                String url = conn.getMetaData().getURL();
                String user = conn.getMetaData().getUserName();
                log.info("DB connection successful -> URL: {} , User: {}", url, user);
            } catch (SQLException e) {
                log.error("DB connection test failed: {}", e.getMessage());
            }
        };
    }
}
