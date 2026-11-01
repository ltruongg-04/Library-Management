package library.unitest;

import library.config.ClientIpResolver;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;

import static org.assertj.core.api.Assertions.assertThat;

class ClientIpResolverTest {

    private static final String REMOTE_ADDRESS = "10.0.0.5";
    private static final String REAL_CLIENT = "203.0.113.9";

    @Test
    void headerIsIgnoredWhenNoProxyIsTrusted() {
        assertThat(resolve(0, "198.51.100.1")).isEqualTo(REMOTE_ADDRESS);
    }

    @Test
    void spoofedEntriesBeforeTrustedProxyAreIgnored() {
        assertThat(resolve(1, "198.51.100.1, " + REAL_CLIENT)).isEqualTo(REAL_CLIENT);
    }

    @Test
    void countsTrustedHopsFromTheEnd() {
        assertThat(resolve(2, "198.51.100.1, " + REAL_CLIENT + ", 10.0.0.1")).isEqualTo(REAL_CLIENT);
    }

    @Test
    void usesFirstEntryWhenChainIsShorterThanConfigured() {
        assertThat(resolve(2, REAL_CLIENT)).isEqualTo(REAL_CLIENT);
    }

    @Test
    void fallsBackToRemoteAddressWithoutUsableHeader() {
        assertThat(resolve(1, null)).isEqualTo(REMOTE_ADDRESS);
        assertThat(resolve(1, " ")).isEqualTo(REMOTE_ADDRESS);
        assertThat(resolve(1, ",")).isEqualTo(REMOTE_ADDRESS);
    }

    private String resolve(int trustedProxyHops, String forwardedFor) {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRemoteAddr(REMOTE_ADDRESS);
        if (forwardedFor != null) {
            request.addHeader("X-Forwarded-For", forwardedFor);
        }
        return new ClientIpResolver(trustedProxyHops).resolve(request);
    }
}
