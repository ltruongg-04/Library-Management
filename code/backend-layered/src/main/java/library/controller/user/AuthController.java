package library.controller.user;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import library.common.base.ApiResponse;
import library.dto.request.GoogleLoginRequest;
import library.dto.request.LoginRequest;
import library.dto.request.RegisterRequest;
import library.dto.response.LoginResponse;
import library.dto.response.RegisterResponse;
import library.dto.response.TokenRefreshResponse;
import library.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<RegisterResponse>> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Đăng ký thành công", authService.register(request)));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Đăng nhập thành công", authService.login(request)));
    }

    @PostMapping("/google")
    public ResponseEntity<ApiResponse<LoginResponse>> loginWithGoogle(@Valid @RequestBody GoogleLoginRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Đăng nhập Google thành công", authService.loginWithGoogle(request)));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<TokenRefreshResponse>> refreshToken(@RequestParam String token) {
        return ResponseEntity.ok(ApiResponse.success("Làm mới token thành công", authService.refreshToken(token)));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            authService.logout(bearerToken.substring(7));
        }
        return ResponseEntity.ok(ApiResponse.success("Đăng xuất thành công", null));
    }
}
