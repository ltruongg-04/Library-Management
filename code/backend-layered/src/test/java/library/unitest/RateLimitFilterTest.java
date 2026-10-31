package library.unitest;

import library.config.RateLimitFilter;
import library.service.RateLimitService;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.startsWith;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

class RateLimitFilterTest {

    private static final String OTP_PATH = "/api/public/borrow/otp/request";

    private final RateLimitService rateLimitService = mock(RateLimitService.class);
    private final RateLimitFilter filter = new RateLimitFilter(rateLimitService);

    @Test
    void returns429WhenLimitIsExceeded() throws Exception {
        when(rateLimitService.tryAcquire(anyString(), anyInt(), any())).thenReturn(false);

        MockFilterChain chain = new MockFilterChain();
        MockHttpServletResponse response = run("POST", OTP_PATH, chain);

        assertThat(response.getStatus()).isEqualTo(429);
        assertThat(chain.getRequest()).isNull();
    }

    @Test
    void limitIsTrackedPerClientIp() throws Exception {
        when(rateLimitService.tryAcquire(startsWith("ratelimit:ip:" + OTP_PATH + ":203.0.113.9"), anyInt(), any()))
                .thenReturn(true);

        MockHttpServletRequest request = new MockHttpServletRequest("POST", OTP_PATH);
        request.addHeader("X-Forwarded-For", "203.0.113.9, 10.0.0.1");
        MockFilterChain chain = new MockFilterChain();
        filter.doFilter(request, new MockHttpServletResponse(), chain);

        assertThat(chain.getRequest()).isNotNull();
    }

    @Test
    void loginAndOtherPathsAreNotLimited() throws Exception {
        for (String path : new String[]{"/api/auth/login", "/api/books"}) {
            MockFilterChain chain = new MockFilterChain();
            run("POST", path, chain);
            assertThat(chain.getRequest()).isNotNull();
        }
        verifyNoInteractions(rateLimitService);
    }

    @Test
    void corsPreflightIsNotCounted() throws Exception {
        run("OPTIONS", OTP_PATH, new MockFilterChain());

        verifyNoInteractions(rateLimitService);
    }

    @Test
    void redisFailureDoesNotBlockUsers() throws Exception {
        when(rateLimitService.tryAcquire(anyString(), anyInt(), any())).thenThrow(new IllegalStateException("redis down"));

        MockFilterChain chain = new MockFilterChain();
        run("POST", OTP_PATH, chain);

        assertThat(chain.getRequest()).isNotNull();
    }

    private MockHttpServletResponse run(String method, String path, MockFilterChain chain) throws Exception {
        MockHttpServletResponse response = new MockHttpServletResponse();
        filter.doFilter(new MockHttpServletRequest(method, path), response, chain);
        return response;
    }
}
