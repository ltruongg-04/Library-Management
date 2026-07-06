package library.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemLogDTO {
    private Integer id;
    private Integer userId;
    private String userEmail;
    private String userFullName;
    private String action;
    private String details;
    private String ipAddress;
    private String status;
    private LocalDateTime createdAt;
}
