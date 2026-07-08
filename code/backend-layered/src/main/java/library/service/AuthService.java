package library.service;

import library.dto.request.GoogleLoginRequest;
import library.dto.request.LoginRequest;
import library.dto.request.RegisterRequest;
import library.dto.response.LoginResponse;
import library.dto.response.RegisterResponse;
import library.dto.response.TokenRefreshResponse;

public interface AuthService {

    RegisterResponse register(RegisterRequest request);

    LoginResponse login(LoginRequest request);

    LoginResponse loginWithGoogle(GoogleLoginRequest request);

    void activateAccount(String token);

    void resendActivation(String email);

    TokenRefreshResponse refreshToken(String refreshToken);

    void logout(String refreshToken);
}
