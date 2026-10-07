package library.service.impl;

import library.common.constant.ErrorMessages;
import library.common.exception.CustomBusinessException;
import library.config.JwtUtil;
import library.dto.response.TokenRefreshResponse;
import library.entity.UserEntity;
import library.repository.UserRepository;
import library.service.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TokenServiceImpl implements TokenService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    // Keys
    private static final String SESSION_PREFIX = "session:";
    private static final String USER_SESSIONS_PREFIX = "user_sessions:";

    @Override
    public TokenRefreshResponse generateTokenPair(UserEntity user) {
        String refreshToken = UUID.randomUUID().toString();
        String accessToken = jwtUtil.generateToken(user, refreshToken);

        long expirationSecs = 7 * 24 * 60 * 60;

        String ipAddress = "Unknown";
        String userAgent = "Unknown";
        
        try {
            org.springframework.web.context.request.RequestAttributes attrs = org.springframework.web.context.request.RequestContextHolder.getRequestAttributes();
            if (attrs instanceof org.springframework.web.context.request.ServletRequestAttributes) {
                jakarta.servlet.http.HttpServletRequest request = ((org.springframework.web.context.request.ServletRequestAttributes) attrs).getRequest();
                ipAddress = request.getRemoteAddr();
                String xForwardedFor = request.getHeader("X-Forwarded-For");
                if (xForwardedFor != null && !xForwardedFor.isEmpty()) ipAddress = xForwardedFor.split(",")[0];
                userAgent = request.getHeader("User-Agent");
            }
        } catch (Exception ignored) {}

        library.dto.admin.AdminSessionDto sessionDto = library.dto.admin.AdminSessionDto.builder()
                .id(refreshToken)
                .userId(user.getId())
                .username(user.getEmail())
                .fullName(user.getFullName())
                .ipAddress(ipAddress)
                .userAgent(userAgent)
                .loginTime(java.time.LocalDateTime.now())
                .build();

        String sessionKey = SESSION_PREFIX + refreshToken;
        redisTemplate.opsForValue().set(sessionKey, sessionDto, Duration.ofSeconds(expirationSecs));

        String userSessionsKey = USER_SESSIONS_PREFIX + user.getId();
        redisTemplate.opsForSet().add(userSessionsKey, refreshToken);
        redisTemplate.expire(userSessionsKey, Duration.ofSeconds(expirationSecs));

        return TokenRefreshResponse.builder()
                .token(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    @Override
    public TokenRefreshResponse refreshToken(String token) {
        String sessionKey = SESSION_PREFIX + token;
        library.dto.admin.AdminSessionDto sessionDto = (library.dto.admin.AdminSessionDto) redisTemplate.opsForValue().get(sessionKey);

        if (sessionDto == null) {
            throw new CustomBusinessException(ErrorMessages.AUTH_REFRESH_TOKEN_INVALID, HttpStatus.UNAUTHORIZED);
        }

        UserEntity user = userRepository.findById(sessionDto.getUserId())
                .orElseThrow(() -> new CustomBusinessException("Người dùng không tồn tại", HttpStatus.UNAUTHORIZED));

        if (!user.isActive()) {
            redisTemplate.delete(sessionKey);
            redisTemplate.opsForSet().remove(USER_SESSIONS_PREFIX + user.getId(), token);
            throw new CustomBusinessException(ErrorMessages.AUTH_ACCOUNT_LOCKED, HttpStatus.FORBIDDEN);
        }

        String newToken = jwtUtil.generateToken(user, token);

        return TokenRefreshResponse.builder()
                .token(newToken)
                .refreshToken(token)
                .build();
    }

    @Override
    public Optional<UserEntity> revokeToken(String token) {
        String sessionKey = SESSION_PREFIX + token;
        library.dto.admin.AdminSessionDto sessionDto = (library.dto.admin.AdminSessionDto) redisTemplate.opsForValue().get(sessionKey);

        if (sessionDto != null) {
            Integer userId = sessionDto.getUserId();
            redisTemplate.delete(sessionKey);
            redisTemplate.opsForSet().remove(USER_SESSIONS_PREFIX + userId, token);
            
            return userRepository.findById(userId);
        }
        return Optional.empty();
    }
}
