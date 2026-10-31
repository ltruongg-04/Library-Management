package library.unitest;

import library.common.exception.CustomBusinessException;
import library.dto.request.LoginRequest;
import library.entity.UserEntity;
import library.repository.UserRepository;
import library.service.EmailService;
import library.service.LoginAttemptService;
import library.service.TokenService;
import library.service.impl.AdminUserServiceImpl;
import library.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthAccountProtectionTest {

    private static final Integer USER_ID = 7;
    private static final String EMAIL = "reader@example.com";
    private static final String PASSWORD = "wrong-password";

    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private LoginAttemptService loginAttemptService;
    @Mock
    private TokenService tokenService;
    @Mock
    private EmailService emailService;

    @InjectMocks
    private AuthServiceImpl authService;

    @Test
    void wrongPasswordIsCountedAndNoTokenIssued() {
        UserEntity user = UserEntity.builder().email(EMAIL).password("hash").build();
        user.setId(USER_ID);
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(PASSWORD, "hash")).thenReturn(false);

        assertThatThrownBy(() -> authService.login(new LoginRequest(EMAIL, PASSWORD)))
                .isInstanceOf(CustomBusinessException.class);

        verify(loginAttemptService).recordFailedLogin(USER_ID);
        verify(tokenService, never()).generateTokenPair(any());
    }

    @Test
    void lockedAccountIsRejectedBeforePasswordCheck() {
        UserEntity user = UserEntity.builder().email(EMAIL).password("hash")
                .lockedUntil(LocalDateTime.now().plusMinutes(5)).build();
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));

        assertThatThrownBy(() -> authService.login(new LoginRequest(EMAIL, PASSWORD)))
                .isInstanceOfSatisfying(CustomBusinessException.class,
                        e -> assertThat(e.getHttpStatus()).isEqualTo(HttpStatus.FORBIDDEN));

        verify(passwordEncoder, never()).matches(any(), any());
    }

    @Test
    void lockedUserCannotRequestNewActivationToken() {
        UserEntity lockedUser = UserEntity.builder().email(EMAIL).fullName("Reader").active(false).build();
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(lockedUser));

        assertThatThrownBy(() -> authService.resendActivation(EMAIL))
                .isInstanceOfSatisfying(CustomBusinessException.class,
                        e -> assertThat(e.getHttpStatus()).isEqualTo(HttpStatus.FORBIDDEN));

        assertThat(lockedUser.getActivationToken()).isNull();
        verify(emailService, never()).sendAccountActivationEmail(any(), any(), any());
    }

    @Test
    void adminLockRevokesPendingActivationToken() {
        UserEntity user = UserEntity.builder().email(EMAIL).active(true)
                .activationToken("pending")
                .activationTokenExpiresAt(LocalDateTime.now().plusHours(1))
                .build();
        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(user));
        AdminUserServiceImpl adminUserService = new AdminUserServiceImpl(userRepository, null, null, null,
                mock(library.service.SystemLogService.class), null);

        adminUserService.updateUserStatus(USER_ID, false);

        assertThat(user.isActive()).isFalse();
        assertThat(user.getActivationToken()).isNull();
        assertThat(user.getActivationTokenExpiresAt()).isNull();
    }
}
