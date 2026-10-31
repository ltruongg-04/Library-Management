package library.unitest;

import io.jsonwebtoken.Jwts;
import library.config.JwtAuthenticationFilter;
import library.config.JwtUtil;
import library.entity.UserEntity;
import library.repository.UserRepository;
import library.service.AdminRoleService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class JwtAuthenticationFilterTest {

    private static final String TOKEN = "token";
    private static final String EMAIL = "demoted@example.com";

    private final JwtUtil jwtUtil = mock(JwtUtil.class);
    private final UserRepository userRepository = mock(UserRepository.class);
    private final AdminRoleService adminRoleService = mock(AdminRoleService.class);

    @SuppressWarnings("unchecked")
    private final RedisTemplate<String, Object> redisTemplate = mock(RedisTemplate.class);

    private final JwtAuthenticationFilter filter =
            new JwtAuthenticationFilter(jwtUtil, userRepository, adminRoleService, redisTemplate);

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void usesRoleFromDatabaseInsteadOfTokenClaim() throws Exception {
        UserEntity demotedUser = UserEntity.builder()
                .email(EMAIL)
                .role(UserEntity.Role.CUSTOMER)
                .active(true)
                .build();
        when(jwtUtil.isTokenValid(TOKEN)).thenReturn(true);
        when(jwtUtil.extractEmail(TOKEN)).thenReturn(EMAIL);
        when(jwtUtil.extractAllClaims(TOKEN)).thenReturn(Jwts.claims().add("role", "ADMIN").build());
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(demotedUser));
        when(adminRoleService.getPermissionIds(UserEntity.Role.CUSTOMER)).thenReturn(List.of());

        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer " + TOKEN);
        filter.doFilter(request, new MockHttpServletResponse(), new MockFilterChain());

        assertThat(SecurityContextHolder.getContext().getAuthentication().getAuthorities())
                .extracting(GrantedAuthority::getAuthority)
                .containsExactly("ROLE_CUSTOMER");
    }
}
