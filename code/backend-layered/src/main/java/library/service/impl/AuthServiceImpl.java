package library.service.impl;

import library.common.exception.CustomBusinessException;
import library.dto.request.GoogleLoginRequest;
import library.dto.request.LoginRequest;
import library.dto.request.RegisterRequest;
import library.dto.response.LoginResponse;
import library.dto.response.RegisterResponse;
import library.dto.response.TokenRefreshResponse;
import library.entity.UserEntity;
import library.repository.UserRepository;
import library.service.AuthService;
import library.service.SystemLogService;
import library.service.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SystemLogService systemLogService;
    private final TokenService tokenService;
    private final library.mapper.UserMapper userMapper;

    @Override
    @Transactional
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
        
        TokenRefreshResponse tokens = tokenService.generateTokenPair(savedUser);

        systemLogService.logAction(savedUser, "Đăng ký tài khoản", "Người dùng " + savedUser.getEmail() + " đã đăng ký tài khoản mới.");

        return userMapper.toRegisterResponse(savedUser, tokens.getToken(), tokens.getRefreshToken());
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

        TokenRefreshResponse tokens = tokenService.generateTokenPair(user);

        systemLogService.logAction(user, "Đăng nhập", "Người dùng " + user.getEmail() + " đã đăng nhập hệ thống.");

        return userMapper.toLoginResponse(user, tokens.getToken(), tokens.getRefreshToken());
    }

    @Override
    @Transactional
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

        TokenRefreshResponse tokens = tokenService.generateTokenPair(user);

        systemLogService.logAction(user, "Đăng nhập Google", "Người dùng " + user.getEmail() + " đã đăng nhập bằng Google.");

        return userMapper.toLoginResponse(user, tokens.getToken(), tokens.getRefreshToken());
    }

    @Override
    @Transactional
    public TokenRefreshResponse refreshToken(String token) {
        return tokenService.refreshToken(token);
    }

    @Override
    @Transactional
    public void logout(String token) {
        tokenService.revokeToken(token).ifPresent(user -> {
            systemLogService.logAction(user, library.common.constant.SystemLogConstants.ACTION_LOGOUT, 
                String.format(library.common.constant.SystemLogConstants.DETAIL_LOGOUT_SUCCESS, user.getEmail()));
        });
    }
}
