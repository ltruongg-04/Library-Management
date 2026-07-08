package library.service.impl;

import library.common.exception.CustomBusinessException;
import library.dto.response.NotificationResponse;
import library.entity.NotificationEntity;
import library.entity.UserEntity;
import library.repository.NotificationRepository;
import library.repository.UserRepository;
import library.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public void createForUser(UserEntity user, String title, String content, String type) {
        if (user == null) {
            return;
        }

        notificationRepository.save(NotificationEntity.builder()
                .user(user)
                .title(title)
                .content(content)
                .type(type)
                .build());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<NotificationResponse> getMyNotifications(String email, Pageable pageable) {
        UserEntity user = findUser(email);
        return notificationRepository.findByUserOrderByCreatedAtDesc(user, pageable)
                .map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public long countUnread(String email) {
        return notificationRepository.countByUserAndReadAtIsNull(findUser(email));
    }

    @Override
    @Transactional
    public void markAsRead(String email, Integer id) {
        UserEntity user = findUser(email);
        NotificationEntity notification = notificationRepository.findById(id)
                .orElseThrow(() -> new CustomBusinessException("Không tìm thấy thông báo", HttpStatus.NOT_FOUND));
        if (notification.getUser() == null || !notification.getUser().getId().equals(user.getId())) {
            throw new CustomBusinessException("Không có quyền cập nhật thông báo này", HttpStatus.FORBIDDEN);
        }
        notification.setReadAt(LocalDateTime.now());
        notificationRepository.save(notification);
    }

    @Override
    @Transactional
    public void markAllAsRead(String email) {
        UserEntity user = findUser(email);
        notificationRepository.findByUserOrderByCreatedAtDesc(user, Pageable.unpaged())
                .forEach(notification -> {
                    if (notification.getReadAt() == null) {
                        notification.setReadAt(LocalDateTime.now());
                        notificationRepository.save(notification);
                    }
                });
    }

    private UserEntity findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomBusinessException("Không tìm thấy tài khoản", HttpStatus.NOT_FOUND));
    }

    private NotificationResponse toResponse(NotificationEntity entity) {
        return NotificationResponse.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .content(entity.getContent())
                .type(entity.getType())
                .read(entity.getReadAt() != null)
                .createdAt(entity.getCreatedAt())
                .readAt(entity.getReadAt())
                .build();
    }
}
