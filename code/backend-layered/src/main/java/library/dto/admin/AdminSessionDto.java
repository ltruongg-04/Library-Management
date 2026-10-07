package library.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminSessionDto implements Serializable {
    private String id; // Token ID
    private Integer userId;
    private String username;
    private String fullName;
    private String userAgent;
    private String ipAddress;
    private LocalDateTime loginTime;
}
