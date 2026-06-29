package library.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

@RestController
public class DbHealthController {

    private final DataSource dataSource;

    public DbHealthController(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @GetMapping("/db-health")
    public String health() {
        try (Connection conn = dataSource.getConnection()) {
            if (conn.isValid(2)) {
                return "Kết nối Database thành công!";
            }
            return "Kết nối Database thất bại: Kết nối không hợp lệ.";
        } catch (SQLException e) {
            return "Kết nối Database thất bại: " + e.getMessage();
        }
    }
}