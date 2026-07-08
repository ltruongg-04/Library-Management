package library.service;

import library.dto.response.NotificationResponse;
import library.entity.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface NotificationService {
    void createForUser(UserEntity user, String title, String content, String type);

    Page<NotificationResponse> getMyNotifications(String email, Pageable pageable);

    long countUnread(String email);

    void markAsRead(String email, Integer id);

    void markAllAsRead(String email);
}
