package library;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SpringBootApplication
@EnableJpaAuditing
public class Aplication {
    private static final Logger log = LoggerFactory.getLogger(Aplication.class);

    public static void main(String[] args) {
        SpringApplication.run(Aplication.class, args);
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
