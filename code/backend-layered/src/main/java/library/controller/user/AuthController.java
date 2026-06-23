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
}
