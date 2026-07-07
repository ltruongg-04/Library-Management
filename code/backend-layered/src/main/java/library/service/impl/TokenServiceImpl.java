package library.service.impl;

import library.common.exception.CustomBusinessException;
import library.config.JwtUtil;
import library.dto.response.TokenRefreshResponse;
import library.entity.RefreshTokenEntity;
import library.entity.UserEntity;
import library.repository.RefreshTokenRepository;
import library.service.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TokenServiceImpl implements TokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtUtil jwtUtil;

    @Override
    @Transactional
    public TokenRefreshResponse generateTokenPair(UserEntity user) {
        // Create Access Token
        String accessToken = jwtUtil.generateToken(user);

        // Delete old refresh token if exists to prevent token accumulation
        refreshTokenRepository.deleteByUser(user);
        refreshTokenRepository.flush(); // Ensure DELETE runs before INSERT

        // Create new Refresh Token valid for 7 days
        RefreshTokenEntity refreshToken = RefreshTokenEntity.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiryDate(LocalDateTime.now().plusDays(7))
                .build();
                
        refreshTokenRepository.save(refreshToken);

        return TokenRefreshResponse.builder()
                .token(accessToken)
                .refreshToken(refreshToken.getToken())
                .build();
    }

    @Override
    @Transactional
    public TokenRefreshResponse refreshToken(String token) {
        RefreshTokenEntity refreshTokenEntity = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new CustomBusinessException("Refresh Token không hợp lệ", HttpStatus.UNAUTHORIZED));

        if (refreshTokenEntity.getExpiryDate().isBefore(LocalDateTime.now())) {
            refreshTokenRepository.delete(refreshTokenEntity);
            throw new CustomBusinessException("Refresh Token đã hết hạn, vui lòng đăng nhập lại", HttpStatus.UNAUTHORIZED);
        }

        UserEntity user = refreshTokenEntity.getUser();

        // VALIDATION FIX: Check if the user is still active before issuing a new token
        if (!user.isActive()) {
            refreshTokenRepository.delete(refreshTokenEntity); // revoke the token
            throw new CustomBusinessException("Tài khoản đã bị khoá", HttpStatus.FORBIDDEN);
        }

        String newToken = jwtUtil.generateToken(user);

        // Keep the old Refresh Token (do not rotate) to prevent race conditions
        // and session sync issues between Client/Server in NextAuth.
        return TokenRefreshResponse.builder()
                .token(newToken)
                .refreshToken(token)
                .build();
    }

    @Override
    @Transactional
    public java.util.Optional<UserEntity> revokeToken(String token) {
        return refreshTokenRepository.findByToken(token).map(refreshToken -> {
            UserEntity user = refreshToken.getUser();
            refreshTokenRepository.delete(refreshToken);
            return user;
        });
    }
}
