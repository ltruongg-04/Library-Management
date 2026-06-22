package library.service.impl;

import library.common.exception.CustomBusinessException;
import library.config.JwtUtil;
import library.dto.request.GoogleLoginRequest;
import library.dto.request.LoginRequest;
import library.dto.request.RegisterRequest;
import library.dto.response.LoginResponse;
import library.dto.response.RegisterResponse;
import library.entity.UserEntity;
import library.repository.UserRepository;
import library.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        // 1. Kiểm tra email đã tồn tại
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new CustomBusinessException("Email đã được sử dụng", HttpStatus.CONFLICT);
        }

        // 2. Tạo entity và hash password
        UserEntity user = UserEntity.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(UserEntity.Role.USER)
                .active(true)
                .build();

        // 3. Lưu vào database
        UserEntity savedUser = userRepository.save(user);

        // 4. Tạo JWT token
        String token = jwtUtil.generateToken(savedUser);

        // 5. Trả về response
        return RegisterResponse.builder()
                .id(savedUser.getId())
                .fullName(savedUser.getFullName())
                .email(savedUser.getEmail())
                .phone(savedUser.getPhone())
                .role(savedUser.getRole().name())
                .token(token)
                .createdAt(savedUser.getCreatedAt())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        // 1. Tìm user bằng email
        UserEntity user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new CustomBusinessException("Email hoặc mật khẩu không chính xác",
                        HttpStatus.UNAUTHORIZED));

        // 2. Kiểm tra mật khẩu
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new CustomBusinessException("Email hoặc mật khẩu không chính xác", HttpStatus.UNAUTHORIZED);
        }

        // 3. Kiểm tra xem tài khoản có hoạt động không
        if (!user.isActive()) {
            throw new CustomBusinessException("Tài khoản đã bị khóa", HttpStatus.FORBIDDEN);
        }

        // 4. Tạo JWT token
        String token = jwtUtil.generateToken(user);

        // 5. Trả về response
        return LoginResponse.builder()
                .token(token)
                .user(LoginResponse.UserInfo.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .fullName(user.getFullName())
                        .role(user.getRole().name())
                        .build())
                .build();
    }

    @Override
    @Transactional
    public LoginResponse loginWithGoogle(GoogleLoginRequest request) {
        // 1. Tìm user theo email, nếu chưa có thì tạo mới
        UserEntity user = userRepository.findByEmail(request.getEmail())
                .orElseGet(() -> {
                    // Tạo user mới với mật khẩu ngẫu nhiên (không thể đăng nhập thủ công)
                    UserEntity newUser = UserEntity.builder()
                            .fullName(request.getFullName())
                            .email(request.getEmail())
                            .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                            .role(UserEntity.Role.USER)
                            .active(true)
                            .build();
                    return userRepository.save(newUser);
                });

        // 2. Kiểm tra tài khoản có bị khóa không
        if (!user.isActive()) {
            throw new CustomBusinessException("Tài khoản đã bị khóa", HttpStatus.FORBIDDEN);
        }

        // 3. Tạo JWT token
        String token = jwtUtil.generateToken(user);

        // 4. Trả về response (giống login thường)
        return LoginResponse.builder()
                .token(token)
                .user(LoginResponse.UserInfo.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .fullName(user.getFullName())
                        .role(user.getRole().name())
                        .build())
                .build();
    }
}
