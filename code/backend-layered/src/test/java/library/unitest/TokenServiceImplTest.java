package library.unitest;

import library.common.exception.CustomBusinessException;
import library.config.ClientIpResolver;
import library.config.JwtUtil;
import library.dto.response.TokenRefreshResponse;
import library.entity.UserEntity;
import library.repository.UserRepository;
import library.service.impl.AdminSessionServiceImpl;
import library.service.impl.TokenServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.SetOperations;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.http.HttpStatus;

import java.time.Duration;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class TokenServiceImplTest {

    private static final int USER_ID = 7;

    private final Map<String, Object> redisValues = new HashMap<>();
    private final Map<String, Set<Object>> redisSets = new HashMap<>();

    @SuppressWarnings("unchecked")
    private final RedisTemplate<String, Object> redisTemplate = mock(RedisTemplate.class);
    private final JwtUtil jwtUtil = mock(JwtUtil.class);
    private final UserRepository userRepository = mock(UserRepository.class);

    private final TokenServiceImpl service =
            new TokenServiceImpl(redisTemplate, jwtUtil, userRepository, new ClientIpResolver(0));

    private UserEntity user;

    @BeforeEach
    @SuppressWarnings("unchecked")
    void setUp() {
        ValueOperations<String, Object> values = mock(ValueOperations.class);
        SetOperations<String, Object> sets = mock(SetOperations.class);
        when(redisTemplate.opsForValue()).thenReturn(values);
        when(redisTemplate.opsForSet()).thenReturn(sets);

        doAnswer(call -> redisValues.put(call.getArgument(0), call.getArgument(1)))
                .when(values).set(anyString(), any(), any(Duration.class));
        when(values.get(any())).thenAnswer(call -> redisValues.get((String) call.getArgument(0)));
        when(redisTemplate.delete(anyString())).thenAnswer(call -> redisValues.remove((String) call.getArgument(0)) != null);
        when(sets.add(anyString(), any())).thenAnswer(call -> {
            redisSets.computeIfAbsent(call.getArgument(0), key -> new HashSet<>()).add(call.getArgument(1));
            return 1L;
        });
        when(sets.members(anyString())).thenAnswer(call -> redisSets.get((String) call.getArgument(0)));

        user = UserEntity.builder().email("reader@example.com").active(true).build();
        user.setId(USER_ID);
        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(user));
        when(jwtUtil.generateToken(any(), anyString())).thenReturn("access-token");
    }

    @Test
    void accessTokenAndRedisNeverContainRefreshToken() {
        String refreshToken = service.generateTokenPair(user).getRefreshToken();

        ArgumentCaptor<String> sessionId = ArgumentCaptor.forClass(String.class);
        verify(jwtUtil).generateToken(any(), sessionId.capture());
        assertThat(sessionId.getValue()).isNotEqualTo(refreshToken);

        assertThat(redisValues.keySet()).noneMatch(key -> key.contains(refreshToken));
        assertThat(redisValues.values()).noneMatch(refreshToken::equals);
        assertThat(redisValues).containsKey("session:" + sessionId.getValue());
    }

    @Test
    void refreshReturnsNewRefreshTokenInSameSession() {
        String first = service.generateTokenPair(user).getRefreshToken();
        int sessionsBefore = countSessions();

        TokenRefreshResponse refreshed = service.refreshToken(first);

        assertThat(refreshed.getRefreshToken()).isNotEqualTo(first);
        assertThat(countSessions()).isEqualTo(sessionsBefore);
    }

    @Test
    void previousTokenStaysUsableWhenRefreshResultWasLost() {
        String first = service.generateTokenPair(user).getRefreshToken();

        // Route handler của Next refresh xong nhưng không ghi được cookie: client vẫn giữ token cũ
        service.refreshToken(first);

        assertThat(service.refreshToken(first).getRefreshToken()).isNotBlank();
    }

    @Test
    void previousTokenIsRevokedOnceSuccessorIsUsed() {
        String first = service.generateTokenPair(user).getRefreshToken();
        String second = service.refreshToken(first).getRefreshToken();

        service.refreshToken(second);

        assertInvalid(first);
    }

    @Test
    void unknownTokenIsRejected() {
        assertInvalid("not-a-real-token");
    }

    @Test
    void logoutEndsSessionForEveryTokenOfIt() {
        String first = service.generateTokenPair(user).getRefreshToken();
        String second = service.refreshToken(first).getRefreshToken();

        assertThat(service.revokeToken(second)).contains(user);

        assertThat(countSessions()).isZero();
        assertInvalid(first);
    }

    @Test
    void terminatingAllSessionsInvalidatesRefreshTokens() {
        String refreshToken = service.generateTokenPair(user).getRefreshToken();

        new AdminSessionServiceImpl(redisTemplate, userRepository).terminateAllUserSessions(USER_ID);

        assertInvalid(refreshToken);
    }

    @Test
    void lockedUserCannotRefreshAndLosesSession() {
        String refreshToken = service.generateTokenPair(user).getRefreshToken();
        user.setActive(false);

        assertThatThrownBy(() -> service.refreshToken(refreshToken))
                .isInstanceOfSatisfying(CustomBusinessException.class,
                        e -> assertThat(e.getHttpStatus()).isEqualTo(HttpStatus.FORBIDDEN));

        assertThat(countSessions()).isZero();
    }

    private void assertInvalid(String refreshToken) {
        assertThatThrownBy(() -> service.refreshToken(refreshToken))
                .isInstanceOfSatisfying(CustomBusinessException.class,
                        e -> assertThat(e.getHttpStatus()).isEqualTo(HttpStatus.UNAUTHORIZED));
    }

    private int countSessions() {
        return (int) redisValues.keySet().stream().filter(key -> key.startsWith("session:")).count();
    }
}
