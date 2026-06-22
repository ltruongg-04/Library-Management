package library.service;

import library.dto.request.GoogleLoginRequest;
import library.dto.request.LoginRequest;
import library.dto.request.RegisterRequest;
import library.dto.response.LoginResponse;
import library.dto.response.RegisterResponse;

public interface UserService {

    RegisterResponse register(RegisterRequest request);

    LoginResponse login(LoginRequest request);

    LoginResponse loginWithGoogle(GoogleLoginRequest request);
}
