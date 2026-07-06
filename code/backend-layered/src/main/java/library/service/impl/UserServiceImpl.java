package library.service.impl;

import library.common.exception.CustomBusinessException;
import library.config.JwtUtil;
import library.dto.request.GoogleLoginRequest;
import library.dto.request.LoginRequest;
import library.dto.request.RegisterRequest;
import library.dto.response.LoginResponse;
import library.dto.response.RegisterResponse;
import library.dto.response.TokenRefreshResponse;
import library.entity.RefreshTokenEntity;
import library.entity.UserEntity;
import library.repository.RefreshTokenRepository;
import library.repository.UserRepository;
import library.service.SystemLogService;
import library.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final SystemLogService systemLogService;

    @SuppressWarnings("null")
    private String createRefreshToken(UserEntity user) {
        // Xóa token cũ nếu có
        refreshTokenRepository.deleteByUser(user);
        refreshTokenRepository.flush(); // Bắt buộc flush để câu lệnh DELETE chạy trước INSERT
        
        // Tạo token mới sống 7 ngày
        RefreshTokenEntity refreshToken = RefreshTokenEntity.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiryDate(LocalDateTime.now().plusDays(7))
                .build();
                
        refreshTokenRepository.save(refreshToken);
        return refreshToken.getToken();
    }

    @Override
    @Transactional
    @SuppressWarnings("null")
    public RegisterResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new CustomBusinessException("Email đã được sử dụng", HttpStatus.CONFLICT);
        }

        UserEntity user = UserEntity.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(UserEntity.Role.USER)
                .active(true)
                .build();

        UserEntity savedUser = userRepository.save(user);
        String token = jwtUtil.generateToken(savedUser);
        String refreshToken = createRefreshToken(savedUser);

        systemLogService.logAction(savedUser, "Đăng ký tài khoản", "Người dùng " + savedUser.getEmail() + " đã đăng ký tài khoản mới.");

        return RegisterResponse.builder()
                .id(savedUser.getId())
                .fullName(savedUser.getFullName())
                .email(savedUser.getEmail())
                .phone(savedUser.getPhone())
                .role(savedUser.getRole().name())
                .token(token)
                .refreshToken(refreshToken)
                .createdAt(savedUser.getCreatedAt())
                .build();
    }

    @Override
    @Transactional
    public LoginResponse login(LoginRequest request) {
        UserEntity user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new CustomBusinessException("Email hoặc mật khẩu không chính xác",
                        HttpStatus.UNAUTHORIZED));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new CustomBusinessException("Email hoặc mật khẩu không chính xác", HttpStatus.UNAUTHORIZED);
        }

        if (!user.isActive()) {
            throw new CustomBusinessException("Tài khoản đã bị khóa", HttpStatus.FORBIDDEN);
        }

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        String token = jwtUtil.generateToken(user);
        String refreshToken = createRefreshToken(user);

        systemLogService.logAction(user, "Đăng nhập", "Người dùng " + user.getEmail() + " đã đăng nhập hệ thống.");

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

    @Override
    @Transactional
    @SuppressWarnings("null")
    public LoginResponse loginWithGoogle(GoogleLoginRequest request) {
        UserEntity user = userRepository.findByEmail(request.getEmail())
                .orElseGet(() -> {
                    UserEntity newUser = UserEntity.builder()
                            .fullName(request.getFullName())
                            .email(request.getEmail())
                            .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                            .role(UserEntity.Role.USER)
                            .active(true)
                            .build();
                    return userRepository.save(newUser);
                });

        if (!user.isActive()) {
            throw new CustomBusinessException("Tài khoản đã bị khóa", HttpStatus.FORBIDDEN);
        }

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        String token = jwtUtil.generateToken(user);
        String refreshToken = createRefreshToken(user);

        systemLogService.logAction(user, "Đăng nhập Google", "Người dùng " + user.getEmail() + " đã đăng nhập bằng Google.");

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

    @Override
    @Transactional
    public TokenRefreshResponse refreshToken(String token) {
        RefreshTokenEntity refreshTokenEntity = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new CustomBusinessException("Refresh Token không hợp lệ", HttpStatus.UNAUTHORIZED));

        if (refreshTokenEntity.getExpiryDate().isBefore(LocalDateTime.now())) {
            refreshTokenRepository.delete(refreshTokenEntity);
            throw new CustomBusinessException("Refresh Token đã hết hạn", HttpStatus.UNAUTHORIZED);
        }

        UserEntity user = refreshTokenEntity.getUser();
        String newToken = jwtUtil.generateToken(user);

        // Giữ nguyên Refresh Token cũ, không xoá và tạo lại để tránh lỗi Race Condition
        // và lỗi bất đồng bộ Session giữa Client/Server trong NextAuth

        return TokenRefreshResponse.builder()
                .token(newToken)
                .refreshToken(token) // Trả về lại token cũ
                .build();
    }

    @Override
    @Transactional
    public void logout(String token) {
        refreshTokenRepository.findByToken(token).ifPresent(refreshToken -> {
            UserEntity user = refreshToken.getUser();
            systemLogService.logAction(user, library.common.constant.SystemLogConstants.ACTION_LOGOUT, 
                String.format(library.common.constant.SystemLogConstants.DETAIL_LOGOUT_SUCCESS, user.getEmail()));
            refreshTokenRepository.delete(refreshToken);
        });
    }
}
