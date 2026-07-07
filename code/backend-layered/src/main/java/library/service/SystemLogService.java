package library.service;

import library.entity.UserEntity;

public interface SystemLogService {
    void logAction(String action, String details);
    void logAction(String action, String details, String status);
    void logAction(UserEntity user, String action, String details);
    void logAction(UserEntity user, String action, String details, String status);
}
