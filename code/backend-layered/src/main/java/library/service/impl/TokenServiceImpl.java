package library.service.impl;

import library.common.constant.ErrorMessages;
import library.common.exception.CustomBusinessException;
import library.config.ClientIpResolver;
import library.config.JwtUtil;
import library.dto.response.TokenRefreshResponse;
import library.entity.UserEntity;
import library.repository.UserRepository;
import library.service.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.util.HexFormat;
import java.util.Optional;
import java.util.UUID;

/**
 * Phiên đăng nhập có mã riêng (sessionId) nằm trong access token, tách khỏi refresh token:
 * trình duyệt đọc được access token nên không được chứa bất cứ thứ gì dùng để xin token mới.
 * Redis chỉ lưu hash của refresh token.
 */
@Service
@RequiredArgsConstructor
public class TokenServiceImpl implements TokenService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final ClientIpResolver clientIpResolver;

    // Keys
    private static final String SESSION_PREFIX = "session:";
    private static final String USER_SESSIONS_PREFIX = "user_sessions:";
    private static final String REFRESH_PREFIX = "refresh:";
    private static final String REFRESH_PREVIOUS_PREFIX = "refresh_previous:";

    private static final Duration SESSION_TTL = Duration.ofDays(7);

    @Override
    public TokenRefreshResponse generateTokenPair(UserEntity user) {
        String sessionId = UUID.randomUUID().toString();
        String accessToken = jwtUtil.generateToken(user, sessionId);

        String ipAddress = "Unknown";
        String userAgent = "Unknown";

        try {
            org.springframework.web.context.request.RequestAttributes attrs = org.springframework.web.context.request.RequestContextHolder.getRequestAttributes();
            if (attrs instanceof org.springframework.web.context.request.ServletRequestAttributes) {
                jakarta.servlet.http.HttpServletRequest request = ((org.springframework.web.context.request.ServletRequestAttributes) attrs).getRequest();
                ipAddress = clientIpResolver.resolve(request);
                userAgent = request.getHeader("User-Agent");
            }
        } catch (Exception ignored) {}

        library.dto.admin.AdminSessionDto sessionDto = library.dto.admin.AdminSessionDto.builder()
                .id(sessionId)
                .userId(user.getId())
                .username(user.getEmail())
                .fullName(user.getFullName())
                .ipAddress(ipAddress)
                .userAgent(userAgent)
                .loginTime(java.time.LocalDateTime.now())
                .build();

        redisTemplate.opsForValue().set(SESSION_PREFIX + sessionId, sessionDto, SESSION_TTL);

        String userSessionsKey = USER_SESSIONS_PREFIX + user.getId();
        redisTemplate.opsForSet().add(userSessionsKey, sessionId);
        redisTemplate.expire(userSessionsKey, SESSION_TTL);

        return TokenRefreshResponse.builder()
                .token(accessToken)
                .refreshToken(issueRefreshToken(sessionId, null, SESSION_TTL))
                .build();
    }

    /**
     * Mỗi lần refresh cấp một refresh token mới, nhưng token cũ chỉ bị hủy khi token mới đã được dùng lần đầu.
     * NextAuth lưu token trong cookie và route handler của Next không ghi lại được cookie sau khi refresh,
     * nên hủy token cũ ngay (hoặc sau một khoảng thời gian cố định) sẽ làm người dùng bị đăng xuất ngẫu nhiên.
     */
    @Override
    public TokenRefreshResponse refreshToken(String token) {
        String tokenHash = hash(token);
        String refreshKey = REFRESH_PREFIX + tokenHash;
        String sessionId = (String) redisTemplate.opsForValue().get(refreshKey);
        if (sessionId == null) {
            throw new CustomBusinessException(ErrorMessages.AUTH_REFRESH_TOKEN_INVALID, HttpStatus.UNAUTHORIZED);
        }

        String sessionKey = SESSION_PREFIX + sessionId;
        library.dto.admin.AdminSessionDto sessionDto = (library.dto.admin.AdminSessionDto) redisTemplate.opsForValue().get(sessionKey);

        if (sessionDto == null) {
            redisTemplate.delete(refreshKey);
            throw new CustomBusinessException(ErrorMessages.AUTH_REFRESH_TOKEN_INVALID, HttpStatus.UNAUTHORIZED);
        }

        UserEntity user = userRepository.findById(sessionDto.getUserId())
                .orElseThrow(() -> new CustomBusinessException("Người dùng không tồn tại", HttpStatus.UNAUTHORIZED));

        if (!user.isActive()) {
            revokeSession(sessionId);
            throw new CustomBusinessException(ErrorMessages.AUTH_ACCOUNT_LOCKED, HttpStatus.FORBIDDEN);
        }

        String previousKey = REFRESH_PREVIOUS_PREFIX + tokenHash;
        String previousHash = (String) redisTemplate.opsForValue().get(previousKey);
        if (previousHash != null) {
            redisTemplate.delete(REFRESH_PREFIX + previousHash);
            redisTemplate.delete(previousKey);
        }

        // Không kéo dài phiên: refresh token mới hết hạn cùng lúc với phiên đăng nhập
        Long remainingSeconds = redisTemplate.getExpire(sessionKey);
        Duration ttl = remainingSeconds != null && remainingSeconds > 0 ? Duration.ofSeconds(remainingSeconds) : SESSION_TTL;

        return TokenRefreshResponse.builder()
                .token(jwtUtil.generateToken(user, sessionId))
                .refreshToken(issueRefreshToken(sessionId, tokenHash, ttl))
                .build();
    }

    @Override
    public Optional<UserEntity> revokeToken(String token) {
        String tokenHash = hash(token);
        String refreshKey = REFRESH_PREFIX + tokenHash;
        String sessionId = (String) redisTemplate.opsForValue().get(refreshKey);

        if (sessionId == null) {
            return Optional.empty();
        }

        redisTemplate.delete(refreshKey);
        redisTemplate.delete(REFRESH_PREVIOUS_PREFIX + tokenHash);
        return revokeSession(sessionId);
    }

    @Override
    public Optional<UserEntity> revokeSessionOfAccessToken(String accessToken) {
        if (!jwtUtil.isTokenValid(accessToken)) {
            return Optional.empty();
        }
        String sessionId = jwtUtil.extractAllClaims(accessToken).get("sessionId", String.class);
        return sessionId != null ? revokeSession(sessionId) : Optional.empty();
    }

    /**
     * Các refresh token còn lại của phiên tự vô hiệu vì refreshToken() luôn kiểm tra phiên còn tồn tại.
     */
    private Optional<UserEntity> revokeSession(String sessionId) {
        String sessionKey = SESSION_PREFIX + sessionId;
        library.dto.admin.AdminSessionDto sessionDto = (library.dto.admin.AdminSessionDto) redisTemplate.opsForValue().get(sessionKey);

        if (sessionDto == null) {
            return Optional.empty();
        }

        Integer userId = sessionDto.getUserId();
        redisTemplate.delete(sessionKey);
        redisTemplate.opsForSet().remove(USER_SESSIONS_PREFIX + userId, sessionId);
        return userRepository.findById(userId);
    }

    private String issueRefreshToken(String sessionId, String previousHash, Duration ttl) {
        String refreshToken = UUID.randomUUID().toString();
        String tokenHash = hash(refreshToken);

        redisTemplate.opsForValue().set(REFRESH_PREFIX + tokenHash, sessionId, ttl);
        if (previousHash != null) {
            redisTemplate.opsForValue().set(REFRESH_PREVIOUS_PREFIX + tokenHash, previousHash, ttl);
        }
        return refreshToken;
    }

    private String hash(String token) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(token.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 is not available", e);
        }
    }
}
