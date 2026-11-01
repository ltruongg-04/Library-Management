package library.unitest;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import library.common.exception.CustomBusinessException;
import library.dto.request.ForgotPasswordRequest;
import library.dto.request.GoogleLoginRequest;
import library.dto.request.RegisterRequest;
import library.dto.request.ResetPasswordRequest;
import library.dto.response.TokenRefreshResponse;
import library.entity.CustomerEntity;
import library.entity.UserEntity;
import library.mapper.UserMapper;
import library.repository.CustomerRepository;
import library.repository.UserRepository;
import library.service.AdminSessionService;
import library.service.EmailService;
import library.service.OtpService;
import library.service.RateLimitService;
import library.service.SystemLogService;
import library.service.TokenService;
import library.service.impl.AuthServiceImpl;
import library.service.impl.UserServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Tài khoản chỉ thuộc về người đã chứng minh sở hữu email, và mất mật khẩu thì phiên cũ cũng phải mất theo.
 */
@ExtendWith(MockitoExtension.class)
class AccountOwnershipTest {

    private static final int USER_ID = 7;
    private static final String EMAIL = "victim@example.com";
    private static final String ID_TOKEN = "google-id-token";

    @Mock
    private UserRepository userRepository;
    @Mock
    private CustomerRepository customerRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private SystemLogService systemLogService;
    @Mock
    private TokenService tokenService;
    @Mock
    private UserMapper userMapper;
    @Mock
    private EmailService emailService;
    @Mock
    private RateLimitService rateLimitService;

    @InjectMocks
    private AuthServiceImpl authService;

    @Test
    void newRegistrationStaysInactiveUntilEmailIsVerified() {
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.empty());
        when(rateLimitService.tryAcquire(anyString(), anyInt(), any())).thenReturn(true);
        when(userRepository.save(any())).thenAnswer(call -> call.getArgument(0));

        authService.register(new RegisterRequest("Reader", EMAIL, "password", null));

        ArgumentCaptor<UserEntity> saved = ArgumentCaptor.forClass(UserEntity.class);
        verify(userRepository).save(saved.capture());
        assertThat(saved.getValue().isActive()).isFalse();
        assertThat(saved.getValue().getActivationToken()).isNotBlank();
        verify(emailService).sendAccountActivationEmail(EMAIL, "Reader", saved.getValue().getActivationToken());
    }

    @Test
    void activeEmailCannotBeRegisteredAgain() {
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(UserEntity.builder().email(EMAIL).active(true).build()));

        assertConflict();
    }

    @Test
    void adminLockedEmailCannotBeReclaimedByRegistering() {
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(UserEntity.builder().email(EMAIL).active(false).build()));

        assertConflict();
    }

    @Test
    void laterRegistrationReplacesUnverifiedAttackerData() {
        UserEntity attackerAccount = pendingAccount();
        CustomerEntity profile = CustomerEntity.builder().fullName("Attacker").phone("0911111111").build();
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(attackerAccount));
        when(customerRepository.findByUserId(USER_ID)).thenReturn(Optional.of(profile));
        when(rateLimitService.tryAcquire(anyString(), anyInt(), any())).thenReturn(true);
        when(passwordEncoder.encode("owner-password")).thenReturn("owner-hash");

        authService.register(new RegisterRequest("Owner", EMAIL, "owner-password", null));

        assertThat(attackerAccount.getPassword()).isEqualTo("owner-hash");
        assertThat(attackerAccount.getFullName()).isEqualTo("Owner");
        assertThat(attackerAccount.getActivationToken()).isNotEqualTo("attacker-link");
        assertThat(profile.getFullName()).isEqualTo("Owner");
        assertThat(profile.getPhone()).isEqualTo("0000000000");
    }

    @Test
    void activationEmailsPerAddressAreLimited() {
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(pendingAccount()));
        when(rateLimitService.tryAcquire(eq("activation:sends:" + EMAIL), anyInt(), any())).thenReturn(false);

        assertThatThrownBy(() -> authService.resendActivation(EMAIL))
                .isInstanceOfSatisfying(CustomBusinessException.class,
                        e -> assertThat(e.getHttpStatus()).isEqualTo(HttpStatus.TOO_MANY_REQUESTS));

        verify(emailService, never()).sendAccountActivationEmail(any(), any(), any());
    }

    @Test
    void googleLoginRemovesAttackerPasswordFromPendingAccount() throws Exception {
        configureGoogle(payload(true));
        UserEntity attackerAccount = pendingAccount();
        CustomerEntity profile = CustomerEntity.builder().fullName("Attacker").phone("0911111111").build();
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(attackerAccount));
        when(customerRepository.findByUserId(USER_ID)).thenReturn(Optional.of(profile));
        when(passwordEncoder.encode(anyString())).thenReturn("random-hash");
        when(tokenService.generateTokenPair(any())).thenReturn(TokenRefreshResponse.builder().build());

        authService.loginWithGoogle(new GoogleLoginRequest(ID_TOKEN));

        assertThat(attackerAccount.isActive()).isTrue();
        assertThat(attackerAccount.getPassword()).isEqualTo("random-hash");
        assertThat(attackerAccount.getFullName()).isEqualTo("Owner");
        assertThat(attackerAccount.getActivationToken()).isNull();
        assertThat(profile.getPhone()).isEqualTo("0000000000");
    }

    @Test
    void googleLoginCannotUnlockAccountLockedByAdmin() throws Exception {
        configureGoogle(payload(true));
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(UserEntity.builder().email(EMAIL).active(false).build()));

        assertThatThrownBy(() -> authService.loginWithGoogle(new GoogleLoginRequest(ID_TOKEN)))
                .isInstanceOfSatisfying(CustomBusinessException.class,
                        e -> assertThat(e.getHttpStatus()).isEqualTo(HttpStatus.FORBIDDEN));

        verify(tokenService, never()).generateTokenPair(any());
    }

    @Test
    void googleLoginRejectsUnverifiedGoogleEmail() throws Exception {
        configureGoogle(payload(false));

        assertThatThrownBy(() -> authService.loginWithGoogle(new GoogleLoginRequest(ID_TOKEN)))
                .isInstanceOfSatisfying(CustomBusinessException.class,
                        e -> assertThat(e.getHttpStatus()).isEqualTo(HttpStatus.FORBIDDEN));

        verify(userRepository, never()).findByEmail(any());
    }

    @Test
    void googleLoginIsRefusedWithoutConfiguredClientId() {
        ReflectionTestUtils.setField(authService, "googleClientId", "");

        assertThatThrownBy(() -> authService.loginWithGoogle(new GoogleLoginRequest(ID_TOKEN)))
                .isInstanceOfSatisfying(CustomBusinessException.class,
                        e -> assertThat(e.getHttpStatus()).isEqualTo(HttpStatus.SERVICE_UNAVAILABLE));
    }

    @Test
    void changingPasswordEndsAllSessions() {
        AdminSessionService sessionService = mock(AdminSessionService.class);
        UserServiceImpl userService = new UserServiceImpl(userRepository, passwordEncoder, mock(OtpService.class), sessionService);
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(activeAccount()));
        when(passwordEncoder.matches("current", "hash")).thenReturn(true);
        when(passwordEncoder.matches("new-password", "hash")).thenReturn(false);

        library.dto.request.ChangePasswordRequest request = new library.dto.request.ChangePasswordRequest();
        request.setCurrentPassword("current");
        request.setNewPassword("new-password");
        userService.changePassword(EMAIL, request);

        verify(sessionService).terminateAllUserSessions(USER_ID);
    }

    @Test
    void resettingPasswordEndsAllSessions() {
        AdminSessionService sessionService = mock(AdminSessionService.class);
        OtpService otpService = mock(OtpService.class);
        UserServiceImpl userService = new UserServiceImpl(userRepository, passwordEncoder, otpService, sessionService);
        when(otpService.validateAndGetEmailFromResetToken("reset-token")).thenReturn(EMAIL);
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(activeAccount()));

        ResetPasswordRequest request = new ResetPasswordRequest();
        request.setResetToken("reset-token");
        request.setNewPassword("new-password");
        userService.resetPassword(request);

        verify(sessionService).terminateAllUserSessions(USER_ID);
    }

    @Test
    void forgotPasswordDoesNotRevealUnknownEmail() {
        OtpService otpService = mock(OtpService.class);
        UserServiceImpl userService = new UserServiceImpl(userRepository, passwordEncoder, otpService, mock(AdminSessionService.class));
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.empty());

        ForgotPasswordRequest request = new ForgotPasswordRequest();
        request.setEmail(EMAIL);
        userService.forgotPassword(request);

        verify(otpService, never()).requestForgotPasswordOtp(any());
    }

    private void assertConflict() {
        assertThatThrownBy(() -> authService.register(new RegisterRequest("Attacker", EMAIL, "password", null)))
                .isInstanceOfSatisfying(CustomBusinessException.class,
                        e -> assertThat(e.getHttpStatus()).isEqualTo(HttpStatus.CONFLICT));
        verify(userRepository, never()).save(any());
    }

    private UserEntity pendingAccount() {
        UserEntity user = UserEntity.builder().email(EMAIL).fullName("Attacker").password("attacker-hash")
                .phone("0911111111").active(false)
                .activationToken("attacker-link")
                .activationTokenExpiresAt(LocalDateTime.now().plusHours(1))
                .build();
        user.setId(USER_ID);
        return user;
    }

    private UserEntity activeAccount() {
        UserEntity user = UserEntity.builder().email(EMAIL).password("hash").active(true).build();
        user.setId(USER_ID);
        return user;
    }

    private GoogleIdToken.Payload payload(boolean emailVerified) {
        GoogleIdToken.Payload payload = new GoogleIdToken.Payload();
        payload.setEmail(EMAIL);
        payload.setEmailVerified(emailVerified);
        payload.set("name", "Owner");
        return payload;
    }

    private void configureGoogle(GoogleIdToken.Payload payload) throws Exception {
        GoogleIdToken idToken = mock(GoogleIdToken.class);
        when(idToken.getPayload()).thenReturn(payload);
        GoogleIdTokenVerifier verifier = mock(GoogleIdTokenVerifier.class);
        when(verifier.verify(ID_TOKEN)).thenReturn(idToken);
        ReflectionTestUtils.setField(authService, "googleClientId", "client-id");
        ReflectionTestUtils.setField(authService, "tokenVerifier", verifier);
    }
}
