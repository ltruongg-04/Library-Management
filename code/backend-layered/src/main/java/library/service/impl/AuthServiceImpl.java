package library.service.impl;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
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
import library.service.LoginAttemptService;
import library.service.NotificationService;
import library.service.RateLimitService;
import library.service.SystemLogService;
import library.service.TokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class AuthServiceImpl implements AuthService {
    private static final int ACTIVATION_TOKEN_HOURS = 24;
    private static final int MAX_ACTIVATION_EMAILS_PER_HOUR = 5;
    private static final String ACTIVATION_SEND_PREFIX = "activation:sends:";
    private static final String NO_PHONE = "0000000000";

    @Value("${GOOGLE_CLIENT_ID:${app.google.client-id:}}")
    private String googleClientId;

    private GoogleIdTokenVerifier tokenVerifier;

    private final UserRepository userRepository;
    private final library.repository.CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final SystemLogService systemLogService;
    private final TokenService tokenService;
    private final library.mapper.UserMapper userMapper;
    private final EmailService emailService;
    private final NotificationService notificationService;
    private final LoginAttemptService loginAttemptService;
    private final RateLimitService rateLimitService;

    @Override
    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        UserEntity existing = userRepository.findByEmail(request.getEmail()).orElse(null);
        if (existing != null) {
            if (!isPendingActivation(existing)) {
                throw new CustomBusinessException("Email đã được sử dụng", HttpStatus.CONFLICT);
            }
            return restartPendingRegistration(existing, request);
        }

        UserEntity user = UserEntity.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(UserEntity.Role.CUSTOMER)
                .active(false)
                .build();
        issueActivationToken(user);

        UserEntity savedUser = userRepository.save(user);

        library.entity.CustomerEntity customer = library.entity.CustomerEntity.builder()
                .user(savedUser)
                .fullName(savedUser.getFullName())
                .phone(savedUser.getPhone() != null ? savedUser.getPhone() : NO_PHONE)
                .email(savedUser.getEmail())
                .address("Chưa cập nhật")
                .build();
        customerRepository.save(customer);

        emailService.sendAccountActivationEmail(savedUser.getEmail(), savedUser.getFullName(), savedUser.getActivationToken());
        systemLogService.logAction(savedUser, "Đăng ký tài khoản", "Người dùng " + savedUser.getEmail() + " đã đăng ký tài khoản mới, chờ kích hoạt email.");

        return userMapper.toRegisterResponse(savedUser, null, null);
    }

    /**
     * Email chưa được xác minh nên chưa ai là chủ của đăng ký này: lần đăng ký sau thay toàn bộ dữ liệu và làm
     * mất hiệu lực link cũ, tránh việc kẻ đăng ký trước bằng email người khác chiếm luôn email đó.
     */
    private RegisterResponse restartPendingRegistration(UserEntity user, RegisterRequest request) {
        user.setFullName(request.getFullName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        issueActivationToken(user);
        userRepository.save(user);
        resetCustomerProfile(user, request.getFullName(), request.getPhone() != null ? request.getPhone() : NO_PHONE);

        emailService.sendAccountActivationEmail(user.getEmail(), user.getFullName(), user.getActivationToken());
        systemLogService.logAction(user, "Đăng ký tài khoản", "Đăng ký lại tài khoản chờ kích hoạt: " + user.getEmail());

        return userMapper.toRegisterResponse(user, null, null);
    }

    /**
     * Không bao trong transaction: BCrypt chạy chậm không nên giữ connection DB,
     * và exception đăng nhập sai không được rollback bộ đếm ở LoginAttemptService.
     */
    @Override
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    public LoginResponse login(LoginRequest request) {
        UserEntity user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new CustomBusinessException("Email hoặc mật khẩu không chính xác",
                        HttpStatus.UNAUTHORIZED));

        validateLockout(user);

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            loginAttemptService.recordFailedLogin(user.getId());
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
        GoogleIdToken.Payload payload = verifyGoogleIdToken(request.getIdToken());
        String email = payload.getEmail();
        if (email == null || email.isBlank()) {
            throw new CustomBusinessException("Không thể trích xuất địa chỉ email từ Google ID Token", HttpStatus.BAD_REQUEST);
        }
        if (!Boolean.TRUE.equals(payload.getEmailVerified())) {
            throw new CustomBusinessException("Email Google chưa được xác minh", HttpStatus.FORBIDDEN);
        }

        String fullName = (String) payload.get("name");
        if (fullName == null || fullName.isBlank()) {
            fullName = email.contains("@") ? email.substring(0, email.indexOf('@')) : "Google User";
        }
        final String finalFullName = fullName;

        UserEntity user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    UserEntity newUser = UserEntity.builder()
                            .fullName(finalFullName)
                            .email(email)
                            .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                            .role(UserEntity.Role.CUSTOMER)
                            .active(true)
                            .build();
                    UserEntity savedUser = userRepository.save(newUser);

                    library.entity.CustomerEntity customer = library.entity.CustomerEntity.builder()
                            .user(savedUser)
                            .fullName(savedUser.getFullName())
                            .phone(NO_PHONE)
                            .email(savedUser.getEmail())
                            .address("Chưa cập nhật")
                            .build();
                    customerRepository.save(customer);

                    return savedUser;
                });

        if (isPendingActivation(user)) {
            claimPendingRegistration(user, finalFullName);
        }

        if (!user.isActive()) {
            throw new CustomBusinessException("Tài khoản đã bị khóa", HttpStatus.FORBIDDEN);
        }

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        TokenRefreshResponse tokens = tokenService.generateTokenPair(user);

        systemLogService.logAction(user, "Đăng nhập Google", "Người dùng " + user.getEmail() + " đã đăng nhập bằng Google.");

        return userMapper.toLoginResponse(user, tokens.getToken(), tokens.getRefreshToken());
    }

    /**
     * Google đã xác minh chủ email, còn đăng ký đang chờ kích hoạt thì chưa: phải bỏ mật khẩu và thông tin đã nhập,
     * nếu không người đã đăng ký trước bằng email này vẫn đăng nhập được vào tài khoản của chủ email.
     */
    private void claimPendingRegistration(UserEntity user, String fullName) {
        user.setActive(true);
        user.setActivationToken(null);
        user.setActivationTokenExpiresAt(null);
        user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
        user.setFullName(fullName);
        user.setPhone(null);
        resetCustomerProfile(user, fullName, NO_PHONE);
    }

    private void resetCustomerProfile(UserEntity user, String fullName, String phone) {
        customerRepository.findByUserId(user.getId()).ifPresent(customer -> {
            customer.setFullName(fullName);
            customer.setPhone(phone);
            customerRepository.save(customer);
        });
    }

    private GoogleIdToken.Payload verifyGoogleIdToken(String idTokenString) {
        // Thiếu client ID thì token cấp cho bất kỳ ứng dụng Google nào cũng qua được, nên phải từ chối thay vì bỏ qua
        if (googleClientId == null || googleClientId.isBlank()) {
            throw new CustomBusinessException("Đăng nhập Google chưa được cấu hình", HttpStatus.SERVICE_UNAVAILABLE);
        }

        try {
            if (this.tokenVerifier == null) {
                GoogleIdTokenVerifier.Builder builder = new GoogleIdTokenVerifier.Builder(
                        GoogleNetHttpTransport.newTrustedTransport(),
                        GsonFactory.getDefaultInstance()
                );
                builder.setAudience(Collections.singletonList(googleClientId.trim()));
                this.tokenVerifier = builder.build();
            }

            GoogleIdToken idToken = this.tokenVerifier.verify(idTokenString);
            if (idToken == null) {
                throw new CustomBusinessException("Google ID Token không hợp lệ hoặc đã hết hạn", HttpStatus.UNAUTHORIZED);
            }
            return idToken.getPayload();
        } catch (CustomBusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("Lỗi khi xác thực Google ID Token: {}", e.getMessage(), e);
            throw new CustomBusinessException("Xác thực tài khoản Google thất bại. Vui lòng thử lại.", HttpStatus.UNAUTHORIZED);
        }
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

        // Không có yêu cầu kích hoạt đang chờ nghĩa là tài khoản do admin khóa, không được tự mở lại qua email
        if (user.getActivationToken() == null) {
            throw new CustomBusinessException("Tài khoản đã bị khóa. Vui lòng liên hệ thư viện.", HttpStatus.FORBIDDEN);
        }

        issueActivationToken(user);
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
        tokenService.revokeToken(token).ifPresent(this::logLogout);
    }

    @Override
    @Transactional
    public void logoutByAccessToken(String accessToken) {
        tokenService.revokeSessionOfAccessToken(accessToken).ifPresent(this::logLogout);
    }

    private void logLogout(UserEntity user) {
        systemLogService.logAction(user, library.common.constant.SystemLogConstants.ACTION_LOGOUT,
            String.format(library.common.constant.SystemLogConstants.DETAIL_LOGOUT_SUCCESS, user.getEmail()));
    }

    private boolean isPendingActivation(UserEntity user) {
        return !user.isActive() && user.getActivationToken() != null;
    }

    private void issueActivationToken(UserEntity user) {
        // Giới hạn theo email: đăng ký và gửi lại không được dùng để spam hộp thư của người khác
        String sendKey = ACTIVATION_SEND_PREFIX + user.getEmail().trim().toLowerCase(Locale.ROOT);
        if (!rateLimitService.tryAcquire(sendKey, MAX_ACTIVATION_EMAILS_PER_HOUR, Duration.ofHours(1))) {
            throw new CustomBusinessException(library.common.constant.ErrorMessages.TOO_MANY_REQUESTS, HttpStatus.TOO_MANY_REQUESTS);
        }

        user.setActivationToken(UUID.randomUUID().toString());
        user.setActivationTokenExpiresAt(LocalDateTime.now().plusHours(ACTIVATION_TOKEN_HOURS));
    }

    private void validateLockout(UserEntity user) {
        if (user.getLockedUntil() != null && user.getLockedUntil().isAfter(LocalDateTime.now())) {
            throw new CustomBusinessException("Tài khoản đã bị tạm khóa do đăng nhập sai nhiều lần. Vui lòng thử lại sau 15 phút.", HttpStatus.FORBIDDEN);
        }
    }
}
