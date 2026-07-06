package library.service;

import library.dto.request.GoogleLoginRequest;
import library.dto.request.LoginRequest;
import library.dto.request.RegisterRequest;
import library.dto.response.LoginResponse;
import library.dto.response.RegisterResponse;

public interface UserService {

    RegisterResponse register(RegisterRequest request);

    void changePassword(String email, library.dto.request.ChangePasswordRequest request);

    void forgotPassword(library.dto.request.ForgotPasswordRequest request);

    void resetPassword(library.dto.request.ResetPasswordRequest request);

    LoginResponse login(LoginRequest request);

    LoginResponse loginWithGoogle(GoogleLoginRequest request);

    library.dto.response.TokenRefreshResponse refreshToken(String refreshToken);

    void logout(String refreshToken);
}
