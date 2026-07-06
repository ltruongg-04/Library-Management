package library.controller.admin;

import library.dto.SystemLogDTO;
import library.entity.SystemLogEntity;
import library.repository.SystemLogRepository;
import library.service.SystemLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/system-logs")
@RequiredArgsConstructor
public class SystemLogController {

    private final SystemLogRepository systemLogRepository;
    private final SystemLogService systemLogService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public ResponseEntity<Page<SystemLogDTO>> getSystemLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<SystemLogEntity> logEntities = systemLogRepository.findAllByOrderByCreatedAtDesc(pageable);
        
        Page<SystemLogDTO> dtos = logEntities.map(log -> {
            String userEmail = null;
            String userFullName = null;
            Integer userId = null;
            
            if (log.getUser() != null) {
                userId = log.getUser().getId();
                userEmail = log.getUser().getEmail();
                userFullName = log.getUser().getFullName();
            }
            
            return SystemLogDTO.builder()
                    .id(log.getId())
                    .userId(userId)
                    .userEmail(userEmail)
                    .userFullName(userFullName)
                    .action(log.getAction())
                    .details(log.getDetails())
                    .ipAddress(log.getIpAddress())
                    .status(log.getStatus() != null ? log.getStatus() : library.common.constant.SystemLogConstants.STATUS_SUCCESS)
                    .createdAt(log.getCreatedAt())
                    .build();
        });
        
        return ResponseEntity.ok(dtos);
    }

    @org.springframework.web.bind.annotation.PostMapping("/export-event")
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public ResponseEntity<Void> logExportEvent(
            @org.springframework.web.bind.annotation.RequestBody java.util.Map<String, String> request
    ) {
        String format = request.getOrDefault("format", "unknown");
        String details = "Admin đã xuất dữ liệu nhật ký hệ thống ra định dạng " + format.toUpperCase();
        
        systemLogService.logAction("Xuất dữ liệu", details);
        return ResponseEntity.ok().build();
    }
}
