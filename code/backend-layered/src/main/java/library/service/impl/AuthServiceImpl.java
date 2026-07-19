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
import library.service.EmailService;
import library.service.NotificationService;
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
    private static final int MAX_FAILED_LOGIN_ATTEMPTS = 5;
    private static final int LOCK_MINUTES = 15;

    private final UserRepository userRepository;
    private final library.repository.CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final SystemLogService systemLogService;
    private final TokenService tokenService;
    private final library.mapper.UserMapper userMapper;
    private final EmailService emailService;
    private final NotificationService notificationService;

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
                .role(UserEntity.Role.CUSTOMER)
                .active(true)
                .build();

        UserEntity savedUser = userRepository.save(user);

        library.entity.CustomerEntity customer = library.entity.CustomerEntity.builder()
                .user(savedUser)
                .fullName(savedUser.getFullName())
                .phone(savedUser.getPhone() != null ? savedUser.getPhone() : "0000000000")
                .email(savedUser.getEmail())
                .address("Chưa cập nhật")
                .build();
        customerRepository.save(customer);

        systemLogService.logAction(savedUser, "Đăng ký tài khoản", "Người dùng " + savedUser.getEmail() + " đã đăng ký tài khoản mới.");

        return userMapper.toRegisterResponse(savedUser, null, null);
    }

    @Override
    @Transactional
    public LoginResponse login(LoginRequest request) {
        UserEntity user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new CustomBusinessException("Email hoặc mật khẩu không chính xác",
                        HttpStatus.UNAUTHORIZED));

        validateLockout(user);

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            registerFailedLogin(user);
            throw new CustomBusinessException("Email hoặc mật khẩu không chính xác", HttpStatus.UNAUTHORIZED);
        }

        if (!user.isActive()) {
            throw new CustomBusinessException("Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email.", HttpStatus.FORBIDDEN);
        }

        user.setLastLogin(LocalDateTime.now());
        user.setFailedLoginAttempts(0);
        user.setLockedUntil(null);
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
                            .role(UserEntity.Role.CUSTOMER)
                            .active(true)
                            .build();
                    UserEntity savedUser = userRepository.save(newUser);
                    
                    library.entity.CustomerEntity customer = library.entity.CustomerEntity.builder()
                            .user(savedUser)
                            .fullName(savedUser.getFullName())
                            .phone("0000000000")
                            .email(savedUser.getEmail())
                            .address("Chưa cập nhật")
                            .build();
                    customerRepository.save(customer);
                    
                    return savedUser;
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
    public void activateAccount(String token) {
        UserEntity user = userRepository.findByActivationToken(token)
                .orElseThrow(() -> new CustomBusinessException("Token kích hoạt không hợp lệ", HttpStatus.BAD_REQUEST));

        if (user.getActivationTokenExpiresAt() == null || user.getActivationTokenExpiresAt().isBefore(LocalDateTime.now())) {
            throw new CustomBusinessException("Token kích hoạt đã hết hạn. Vui lòng yêu cầu gửi lại email kích hoạt.", HttpStatus.BAD_REQUEST);
        }

        user.setActive(true);
        user.setActivationToken(null);
        user.setActivationTokenExpiresAt(null);
        user.setFailedLoginAttempts(0);
        user.setLockedUntil(null);
        userRepository.save(user);

        notificationService.createForUser(user, "Tài khoản đã được kích hoạt", "Bạn có thể đăng nhập và sử dụng các tính năng mượn sách.", "ACCOUNT");
        systemLogService.logAction(user, "Kích hoạt tài khoản", "Người dùng " + user.getEmail() + " đã kích hoạt tài khoản.");
    }

    @Override
    @Transactional
    public void resendActivation(String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomBusinessException("Không tìm thấy tài khoản với email này", HttpStatus.NOT_FOUND));

        if (user.isActive()) {
            throw new CustomBusinessException("Tài khoản đã được kích hoạt", HttpStatus.BAD_REQUEST);
        }

        user.setActivationToken(UUID.randomUUID().toString());
        user.setActivationTokenExpiresAt(LocalDateTime.now().plusHours(24));
        userRepository.save(user);
        emailService.sendAccountActivationEmail(user.getEmail(), user.getFullName(), user.getActivationToken());
        systemLogService.logAction(user, "Gửi lại email kích hoạt", "Đã gửi lại email kích hoạt cho " + user.getEmail());
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

    private void validateLockout(UserEntity user) {
        if (user.getLockedUntil() != null && user.getLockedUntil().isAfter(LocalDateTime.now())) {
            throw new CustomBusinessException("Tài khoản đã bị tạm khóa do đăng nhập sai nhiều lần. Vui lòng thử lại sau 15 phút.", HttpStatus.FORBIDDEN);
        }

        if (user.getLockedUntil() != null && !user.getLockedUntil().isAfter(LocalDateTime.now())) {
            user.setLockedUntil(null);
            user.setFailedLoginAttempts(0);
            userRepository.save(user);
        }
    }

    private void registerFailedLogin(UserEntity user) {
        int attempts = user.getFailedLoginAttempts() + 1;
        user.setFailedLoginAttempts(attempts);
        if (attempts >= MAX_FAILED_LOGIN_ATTEMPTS) {
            user.setLockedUntil(LocalDateTime.now().plusMinutes(LOCK_MINUTES));
            systemLogService.logAction(user, "Khóa tài khoản tạm thời", "Tài khoản " + user.getEmail() + " bị khóa do đăng nhập sai nhiều lần.");
        }
        userRepository.save(user);
    }
}
