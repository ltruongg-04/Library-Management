package library.service;

import jakarta.servlet.http.HttpServletRequest;
import library.entity.SystemLogEntity;
import library.entity.UserEntity;
import library.repository.SystemLogRepository;
import library.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Service
@RequiredArgsConstructor
@Slf4j
public class SystemLogService {

    private final SystemLogRepository systemLogRepository;
    private final UserRepository userRepository;

    @Transactional
    public void logAction(String action, String details) {
        UserEntity user = null;
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated() && !authentication.getPrincipal().equals("anonymousUser")) {
                String email = (String) authentication.getPrincipal();
                user = userRepository.findByEmail(email).orElse(null);
            }
        } catch (Exception e) {
            log.warn("Could not get user from security context", e);
        }
        logAction(user, action, details, library.common.constant.SystemLogConstants.STATUS_SUCCESS);
    }

    @Transactional
    public void logAction(String action, String details, String status) {
        UserEntity user = null;
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated() && !authentication.getPrincipal().equals("anonymousUser")) {
                String email = (String) authentication.getPrincipal();
                user = userRepository.findByEmail(email).orElse(null);
            }
        } catch (Exception e) {
            log.warn("Could not get user from security context", e);
        }
        logAction(user, action, details, status);
    }

    @Transactional
    public void logAction(UserEntity user, String action, String details) {
        logAction(user, action, details, library.common.constant.SystemLogConstants.STATUS_SUCCESS);
    }

    @Transactional
    public void logAction(UserEntity user, String action, String details, String status) {
        try {
            String ipAddress = null;
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                ipAddress = request.getHeader("X-Forwarded-For");
                if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
                    ipAddress = request.getRemoteAddr();
                }
            }

            SystemLogEntity logEntity = SystemLogEntity.builder()
                    .user(user)
                    .action(action)
                    .details(details)
                    .status(status)
                    .ipAddress(ipAddress)
                    .build();

            systemLogRepository.save(logEntity);
        } catch (Exception e) {
            log.error("Failed to save system log", e);
        }
    }
}
