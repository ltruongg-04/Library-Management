package library.mapper;

import library.dto.admin.AdminUserResponseDto;
import library.dto.response.LoginResponse;
import library.dto.response.RegisterResponse;
import library.entity.UserEntity;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;

@Component
public class UserMapper {

    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    public AdminUserResponseDto toAdminUserResponseDto(UserEntity user) {
        if (user == null) return null;

        String roleStr = user.getRole().name().toLowerCase();
        if ("user".equals(roleStr)) {
            roleStr = "customer";
        }

        return AdminUserResponseDto.builder()
                .id(user.getId())
                .name(user.getFullName())
                .email(user.getEmail())
                .role(roleStr)
                .status(user.isActive() ? "active" : "locked")
                .lastLogin(user.getLastLogin() != null ? user.getLastLogin().format(formatter) : "Chưa đăng nhập")
                .build();
    }

    public RegisterResponse toRegisterResponse(UserEntity user, String token, String refreshToken) {
        if (user == null) return null;

        return RegisterResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .token(token)
                .refreshToken(refreshToken)
                .createdAt(user.getCreatedAt())
                .build();
    }

    public LoginResponse toLoginResponse(UserEntity user, String token, String refreshToken) {
        if (user == null) return null;

        return LoginResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .user(LoginResponse.UserInfo.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .fullName(user.getFullName())
                        .role(user.getRole().name())
                        .build())
                .build();
    }
}
