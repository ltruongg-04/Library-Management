package library.controller.user;

import jakarta.validation.Valid;
import library.common.base.ApiResponse;
import library.dto.request.GoogleLoginRequest;
import library.dto.request.LoginRequest;
import library.dto.request.RegisterRequest;
import library.dto.response.LoginResponse;
import library.dto.response.RegisterResponse;
import library.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

        private final UserService userService;

        @PostMapping("/register")
        public ResponseEntity<ApiResponse<RegisterResponse>> register(
                        @Valid @RequestBody RegisterRequest request) {

                RegisterResponse response = userService.register(request);

                return ResponseEntity
                                .status(HttpStatus.CREATED)
                                .body(ApiResponse.success("Đăng ký thành công", response));
        }

        @PostMapping("/login")
        public ResponseEntity<ApiResponse<LoginResponse>> login(
                        @Valid @RequestBody LoginRequest request) {

                LoginResponse response = userService.login(request);

                return ResponseEntity
                                .ok(ApiResponse.success("Đăng nhập thành công", response));
        }

        @PostMapping("/google")
        public ResponseEntity<ApiResponse<LoginResponse>> loginWithGoogle(
                        @Valid @RequestBody GoogleLoginRequest request) {

                LoginResponse response = userService.loginWithGoogle(request);

                return ResponseEntity
                                .ok(ApiResponse.success("Đăng nhập Google thành công", response));
        }

        @PostMapping("/refresh")
        public ResponseEntity<ApiResponse<library.dto.response.TokenRefreshResponse>> refreshToken(
                        @Valid @RequestBody library.dto.request.RefreshTokenRequest request) {

                library.dto.response.TokenRefreshResponse response = userService.refreshToken(request.getRefreshToken());

                return ResponseEntity
                                .ok(ApiResponse.success("Làm mới token thành công", response));
        }

        @PostMapping("/logout")
        public ResponseEntity<ApiResponse<String>> logout(
                        @Valid @RequestBody library.dto.request.RefreshTokenRequest request) {

                userService.logout(request.getRefreshToken());

                return ResponseEntity
                                .ok(ApiResponse.success("Đăng xuất thành công", null));
        }

        @PutMapping("/change-password")
        public ResponseEntity<ApiResponse<Void>> changePassword(
                        @Valid @RequestBody library.dto.request.ChangePasswordRequest request) {
                
                org.springframework.security.core.Authentication authentication = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
                if (authentication == null || authentication.getName() == null) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Vui lòng đăng nhập"));
                }
                String email = authentication.getName();

                userService.changePassword(email, request);

                return ResponseEntity
                                .ok(ApiResponse.success("Đổi mật khẩu thành công", null));
        }

        @PostMapping("/forgot-password")
        public ResponseEntity<ApiResponse<Void>> forgotPassword(
                        @Valid @RequestBody library.dto.request.ForgotPasswordRequest request) {

                userService.forgotPassword(request);

                return ResponseEntity
                                .ok(ApiResponse.success("Mã xác nhận đã được gửi đến email của bạn", null));
        }

        @PostMapping("/reset-password")
        public ResponseEntity<ApiResponse<Void>> resetPassword(
                        @Valid @RequestBody library.dto.request.ResetPasswordRequest request) {

                userService.resetPassword(request);

                return ResponseEntity
                                .ok(ApiResponse.success("Đặt lại mật khẩu thành công", null));
        }
}
