package library.controller.user;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import library.common.base.ApiResponse;
import library.dto.request.GoogleLoginRequest;
import library.dto.request.LoginRequest;
import library.dto.request.RegisterRequest;
import library.dto.request.ActivateAccountRequest;
import library.dto.request.ResendActivationRequest;
import library.dto.response.LoginResponse;
import library.dto.response.RegisterResponse;
import library.dto.response.TokenRefreshResponse;
import library.service.AuthService;
import library.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.validation.annotation.Validated;
import library.dto.request.ChangePasswordRequest;
import library.dto.request.ForgotPasswordRequest;
import library.dto.request.ResetPasswordRequest;
import library.dto.request.VerifyOtpRequest;
import library.dto.response.VerifyOtpResponse;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import library.dto.request.ChangePasswordRequest;
import library.dto.request.ForgotPasswordRequest;
import library.dto.request.ResetPasswordRequest;
import library.dto.request.VerifyOtpRequest;
import library.dto.response.VerifyOtpResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import library.common.constant.ErrorMessages;
import library.common.constant.SuccessMessages;
import library.common.exception.CustomBusinessException;
import org.springframework.http.HttpStatus;

import library.dto.request.RefreshTokenRequest;

@Validated
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<RegisterResponse>> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(ApiResponse.success(SuccessMessages.AUTH_REGISTER, authService.register(request)));
    }

    @PostMapping("/activate")
    public ResponseEntity<ApiResponse<Void>> activate(@Valid @RequestBody ActivateAccountRequest request) {
        authService.activateAccount(request.getToken());
        return ResponseEntity.ok(ApiResponse.success(SuccessMessages.AUTH_ACTIVATE, null));
    }

    @PostMapping("/resend-activation")
    public ResponseEntity<ApiResponse<Void>> resendActivation(@Valid @RequestBody ResendActivationRequest request) {
        authService.resendActivation(request.getEmail());
        return ResponseEntity.ok(ApiResponse.success(SuccessMessages.AUTH_RESEND_ACTIVATION, null));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(ApiResponse.success(SuccessMessages.AUTH_LOGIN, authService.login(request)));
    }

    @PostMapping("/google")
    public ResponseEntity<ApiResponse<LoginResponse>> loginWithGoogle(@Valid @RequestBody GoogleLoginRequest request) {
        return ResponseEntity.ok(ApiResponse.success(SuccessMessages.AUTH_GOOGLE_LOGIN, authService.loginWithGoogle(request)));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<TokenRefreshResponse>> refreshToken(@RequestParam String token) {
        return ResponseEntity.ok(ApiResponse.success(SuccessMessages.AUTH_TOKEN_REFRESH, authService.refreshToken(token)));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(@RequestBody(required = false) RefreshTokenRequest requestBody, HttpServletRequest request) {
        if (requestBody != null && org.springframework.util.StringUtils.hasText(requestBody.getRefreshToken())) {
            authService.logout(requestBody.getRefreshToken());
        } else {
            String bearerToken = request.getHeader("Authorization");
            if (org.springframework.util.StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
                authService.logout(bearerToken.substring(7));
            }
        }
        return ResponseEntity.ok(ApiResponse.success(SuccessMessages.AUTH_LOGOUT, null));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        userService.forgotPassword(request);
        return ResponseEntity.ok(ApiResponse.success(SuccessMessages.AUTH_FORGOT_PASSWORD, null));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<VerifyOtpResponse>> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        VerifyOtpResponse response = userService.verifyForgotPasswordOtp(request);
        return ResponseEntity.ok(ApiResponse.success(SuccessMessages.AUTH_VERIFY_OTP, response));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        userService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.success(SuccessMessages.AUTH_RESET_PASSWORD, null));
    }

    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new CustomBusinessException(ErrorMessages.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
        }
        String email = authentication.getPrincipal().toString();
        userService.changePassword(email, request);
        return ResponseEntity.ok(ApiResponse.success(SuccessMessages.AUTH_PASSWORD_CHANGED, null));
    }
}
