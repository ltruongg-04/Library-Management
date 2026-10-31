package library.unitest;

import library.common.exception.CustomBusinessException;
import library.service.EmailService;
import library.service.OtpService;
import library.service.OtpService.Purpose;
import library.service.RateLimitService;
import library.service.impl.OtpServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.http.HttpStatus;

import java.time.Duration;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyCollection;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class OtpServiceImplTest {

    private static final String EMAIL = "reader@example.com";
    private static final int MAX_ATTEMPTS = 5;

    private final Map<String, String> redisValues = new HashMap<>();
    private final Map<String, Integer> counters = new HashMap<>();

    private final EmailService emailService = mock(EmailService.class);
    private OtpService otpService;

    @BeforeEach
    @SuppressWarnings("unchecked")
    void setUp() {
        StringRedisTemplate redisTemplate = mock(StringRedisTemplate.class);
        ValueOperations<String, String> values = mock(ValueOperations.class);
        when(redisTemplate.opsForValue()).thenReturn(values);
        when(values.get(anyString())).thenAnswer(call -> redisValues.get(call.getArgument(0, String.class)));
        doAnswer(call -> redisValues.put(call.getArgument(0), call.getArgument(1)))
                .when(values).set(anyString(), anyString(), any(Duration.class));
        when(redisTemplate.delete(anyString())).thenAnswer(call -> {
            forget(call.getArgument(0, String.class));
            return true;
        });
        when(redisTemplate.delete(anyCollection())).thenAnswer(call -> {
            ((Collection<String>) call.getArgument(0)).forEach(this::forget);
            return 1L;
        });

        RateLimitService rateLimitService = (key, limit, window) -> counters.merge(key, 1, Integer::sum) <= limit;
        otpService = new OtpServiceImpl(emailService, redisTemplate, rateLimitService);
    }

    @Test
    void correctOtpIsAccepted() {
        assertThat(otpService.validateOtp(Purpose.GUEST_LOOKUP, EMAIL, requestLookupOtp())).isTrue();
    }

    @Test
    void otpIsBurnedAfterTooManyWrongAttempts() {
        String otp = requestLookupOtp();
        String wrongOtp = otp.equals("000000") ? "000001" : "000000";

        for (int i = 0; i < MAX_ATTEMPTS; i++) {
            assertThat(otpService.validateOtp(Purpose.GUEST_LOOKUP, EMAIL, wrongOtp)).isFalse();
        }

        // Lần thử vượt giới hạn hủy mã, kể cả đoán đúng cũng không còn tác dụng
        assertThat(otpService.validateOtp(Purpose.GUEST_LOOKUP, EMAIL, otp)).isFalse();
        assertThat(otpService.validateOtp(Purpose.GUEST_LOOKUP, EMAIL, otp)).isFalse();
    }

    @Test
    void otpForLookupCannotBeUsedToResetPassword() {
        assertThat(otpService.validateOtp(Purpose.PASSWORD_RESET, EMAIL, requestLookupOtp())).isFalse();
    }

    @Test
    void emailCaseDoesNotBypassLimitsOrLookup() {
        String otp = requestLookupOtp();

        assertThat(otpService.validateOtp(Purpose.GUEST_LOOKUP, "READER@example.com", otp)).isTrue();
        assertThatThrownBy(() -> otpService.requestOtp("READER@example.com"))
                .isInstanceOf(CustomBusinessException.class);
    }

    @Test
    void secondRequestWithinCooldownIsRejected() {
        requestLookupOtp();

        assertThatThrownBy(() -> otpService.requestOtp(EMAIL))
                .isInstanceOfSatisfying(CustomBusinessException.class,
                        e -> assertThat(e.getHttpStatus()).isEqualTo(HttpStatus.TOO_MANY_REQUESTS));
    }

    @Test
    void clearedResetTokenCanNoLongerBeUsed() {
        String token = otpService.generateResetToken(EMAIL);
        assertThat(otpService.validateAndGetEmailFromResetToken(token)).isEqualTo(EMAIL);

        otpService.clearResetToken(token);

        assertThat(otpService.validateAndGetEmailFromResetToken(token)).isNull();
    }

    private String requestLookupOtp() {
        otpService.requestOtp(EMAIL);
        ArgumentCaptor<String> otp = ArgumentCaptor.forClass(String.class);
        verify(emailService).sendOtpEmail(any(), otp.capture());
        return otp.getValue();
    }

    private void forget(String key) {
        redisValues.remove(key);
        counters.remove(key);
    }
}
